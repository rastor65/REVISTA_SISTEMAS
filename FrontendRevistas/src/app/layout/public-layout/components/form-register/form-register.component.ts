import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpHeaders } from '@angular/common/http';

import { UserService } from 'src/app/core/services/usuarios/user.service';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    email1: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password2: ['', [Validators.required, Validators.minLength(8)]]
  });

  loading = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  heroImage = 'assets/revista_principal.jpeg';
  logoImage = 'assets/logo_r.jpg';

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
      this.router.navigateByUrl('/welcome');
    }
  }

  campoInvalido(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  get passwordsMismatch(): boolean {
    const pass1 = this.form.get('password')?.value;
    const pass2 = this.form.get('password2')?.value;

    return !!pass1 && !!pass2 && pass1 !== pass2;
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPassword(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  verificarDominioInstitucional(email: string): boolean {
    if (!email || !email.includes('@')) {
      return false;
    }

    const [, domain] = email.split('@');
    return domain === 'uniguajira.edu.co';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor completa todos los campos obligatorios.'
      });
      return;
    }

    if (this.passwordsMismatch) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Contraseñas diferentes',
        detail: 'Las contraseñas no coinciden.'
      });
      return;
    }

    const email = this.form.value.email1;

    if (!this.verificarDominioInstitucional(email)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Dominio no permitido',
        detail: 'Solo se permite el dominio @uniguajira.edu.co'
      });
      return;
    }

    const payload = {
      username: email.substring(0, email.indexOf('@')),
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name,
      email: email,
      password: this.form.value.password
    };

    this.loading = true;

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.userService.getUserDetailsByEmail(payload.email).subscribe({
          next: (userData) => {
            if (userData?.id) {
              const userRoleData = {
                status: true,
                userId: userData.id,
                rolesId: 7
              };

              const bodyString = JSON.stringify(userRoleData);
              const httpOptions = {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json'
                })
              };

              this.usuariosService.asignarRoles(bodyString, httpOptions).subscribe({
                next: () => {
                  this.loading = false;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Registro exitoso',
                    detail: 'Tu cuenta fue creada correctamente.'
                  });
                  this.router.navigateByUrl('/login');
                },
                error: (error) => {
                  console.error('Error al asignar rol autor:', error);
                  this.loading = false;
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Cuenta creada',
                    detail: 'La cuenta fue creada, pero hubo un inconveniente al asignar el rol.'
                  });
                  this.router.navigateByUrl('/login');
                }
              });
            } else {
              this.loading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Registro exitoso',
                detail: 'Tu cuenta fue creada correctamente.'
              });
              this.router.navigateByUrl('/login');
            }
          },
          error: (error) => {
            console.error('Error al consultar usuario creado:', error);
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Registro exitoso',
              detail: 'Tu cuenta fue creada correctamente.'
            });
            this.router.navigateByUrl('/login');
          }
        });
      },
      error: (responseError) => {
        console.error(responseError);
        this.loading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error en el registro',
          detail: 'No fue posible completar el registro. Verifica los datos e intenta nuevamente.'
        });
      }
    });
  }
}