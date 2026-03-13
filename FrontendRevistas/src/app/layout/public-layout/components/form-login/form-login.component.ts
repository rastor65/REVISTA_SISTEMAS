import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserLoginI } from 'src/app/models/authorization/usr_User';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent implements OnInit {
  public form: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    captcha: ['', [Validators.required]]
  });

  passwordVisible = false;
  submitted = false;
  loading = false;

  numero1 = 0;
  numero2 = 0;

  heroImage = 'assets/revista_principal.jpeg';
  logoImage = 'assets/logo_r.jpg';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.generarCaptcha();

    const token: string | null = localStorage.getItem('token');
    const user: string | null = localStorage.getItem('user');

    if (token && user) {
      this.router.navigateByUrl('/landing');
    }
  }

  get f() {
    return this.form.controls;
  }

  get captchaPregunta(): string {
    return `¿Cuánto es ${this.numero1} + ${this.numero2}?`;
  }

  generarCaptcha(): void {
    this.numero1 = Math.floor(Math.random() * 10) + 1;
    this.numero2 = Math.floor(Math.random() * 10) + 1;
  }

  regenerarCaptcha(): void {
    this.generarCaptcha();
    this.form.patchValue({ captcha: '' });
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  campoInvalido(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor completa los campos requeridos.'
      });
      return;
    }

    const formValue = this.form.value;
    const captchaInput = parseInt(formValue.captcha, 10);
    const captchaCorrecto =
      !isNaN(captchaInput) && captchaInput === (this.numero1 + this.numero2);

    if (!captchaCorrecto) {
      this.messageService.add({
        severity: 'error',
        summary: 'Captcha incorrecto',
        detail: 'Verifica el resultado e inténtalo nuevamente.'
      });
      this.regenerarCaptcha();
      return;
    }

    this.loading = true;

    const payload: UserLoginI = {
      email: formValue.username,
      username: formValue.username,
      password: formValue.password
    };

    this.authService.login(payload).subscribe({
      next: (result) => {
        this.loading = false;

        if (result?.data?.user?.name) {
          this.messageService.add({
            severity: 'success',
            summary: `Bienvenido ${result.data.user.name}`,
            detail: 'Inicio de sesión exitoso.'
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Bienvenido',
            detail: 'Inicio de sesión exitoso.'
          });
        }

        setTimeout(() => {
          this.router.navigateByUrl('/landing');
        }, 700);
      },
      error: (error) => {
        this.loading = false;
        this.regenerarCaptcha();

        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Acceso denegado',
          detail: 'Credenciales incorrectas.'
        });
      }
    });
  }
}