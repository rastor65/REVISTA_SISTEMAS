import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserLoginI } from 'src/app/models/authorization/usr_User';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent implements OnInit {
  displayMaximizable: boolean = true
  public form: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  public motrar: boolean = false
  passwordVisible: boolean = false;
  public image3: string = 'assets/demo.png'

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const token: string | null = localStorage.getItem('token');
    const user: string | null = localStorage.getItem('user');
    if (token !== null && user !== null) {
      this.router.navigateByUrl('/landing');

    } else {
      this.router.navigateByUrl('/login');
    }
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    const form: UserLoginI = this.form.value;
    const requestBody = JSON.stringify(form);

    this.authService.login(form).subscribe((result) => {
      if (result)
        this.motrar = true;
      if (result && result.data && result.data.user && result.data.user.name) {
        this.messageService.add({ severity: 'success', summary: `Bienvenido ${result.data.user.name}` });
      }

      var date = new Date('2020-01-01 00:00:04');
      function padLeft(n: any) {
        return n = "00".substring(0, "00".length - n.length) + n;
      }
      var interval = setInterval(() => {
        var minutes = padLeft(date.getMinutes() + "");
        var seconds = padLeft(date.getSeconds() + "");


        date = new Date(date.getTime() - 1000);
        if (minutes === '00' && seconds === '01') {
          this.router.navigateByUrl('/landing');
          clearInterval(interval);
        }
      }, 1000);
    }, async error => {
      this.motrar = false;

      if (error != undefined) {
        if (error.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Credenciales incorrectas` });
        }

        console.log(error);
      }
    })
  }
}
