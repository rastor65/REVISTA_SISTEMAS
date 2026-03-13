import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';
import { HttpHeaders } from '@angular/common/http';
import { finalize, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent implements OnInit {
  public form!: FormGroup;

  public displayMaximizable = true;
  public bandera = false;

  public passwordVisible = false;
  public confirmPasswordVisible = false;

  readonly acceptedDomain = 'uniguajira.edu.co';
  readonly roleAutorId = 7;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.router.navigateByUrl('/landing');
      return;
    }

    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group(
      {
        first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
        last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
        email1: ['', [Validators.required, Validators.email, this.institutionalEmailValidator.bind(this)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
        password2: ['', [Validators.required]]
      },
      {
        validators: [this.passwordMatchValidator]
      }
    );
  }

  private institutionalEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value || '').trim().toLowerCase();

    if (!value) {
      return null;
    }

    const parts = value.split('@');
    if (parts.length !== 2) {
      return null;
    }

    return parts[1] === this.acceptedDomain ? null : { institutionalDomain: true };
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;

    if (!password || !password2) {
      return null;
    }

    return password === password2 ? null : { passwordMismatch: true };
  }

  get passwordsNoCoinciden(): boolean {
    return !!(
      this.form?.hasError('passwordMismatch') &&
      (this.form.get('password2')?.touched || this.form.get('password')?.touched)
    );
  }

  hasFieldError(controlName: string, errorName?: string): boolean {
    const control = this.form.get(controlName);

    if (!control) {
      return false;
    }

    if (!errorName) {
      return control.invalid && (control.dirty || control.touched);
    }

    return !!(control.hasError(errorName) && (control.dirty || control.touched));
  }

  togglePassword(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
      return;
    }

    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor revisa los campos requeridos.'
      });
      return;
    }

    const email = this.form.value.email1.trim().toLowerCase();
    const username = email.substring(0, email.indexOf('@'));

    const formValue = {
      username,
      first_name: this.form.value.first_name.trim(),
      last_name: this.form.value.last_name.trim(),
      email,
      password: this.form.value.password
    };

    this.bandera = true;

    this.userService.createUser(formValue).pipe(
      switchMap(() => this.userService.getUserDetailsByEmail(email)),
      switchMap((userData: any) => {
        const userId = userData?.id || userData?.data?.id;

        if (!userId) {
          return throwError(() => new Error('No fue posible recuperar el usuario creado.'));
        }

        const userRoleData = {
          status: true,
          userId,
          rolesId: this.roleAutorId
        };

        const bodyString = JSON.stringify(userRoleData);
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };

        return this.usuariosService.asignarRoles(bodyString, httpOptions);
      }),
      finalize(() => {
        this.bandera = false;
      })
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Tu cuenta fue creada correctamente.'
        });

        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 1200);
      },
      error: (responseError) => {
        console.error('Error al registrar usuario:', responseError);

        const detail =
          responseError?.error?.errors?.error?.person ||
          responseError?.error?.message ||
          'No fue posible completar el registro.';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail
        });
      }
    });
  }
}