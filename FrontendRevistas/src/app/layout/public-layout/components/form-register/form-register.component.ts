import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { RoleI } from 'src/app/models/authorization/usr_roles';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})

export class FormRegisterComponent implements OnInit {
  public form: FormGroup = this.formBuilder.group({});
  public mostrar: boolean = false;
  displayMaximizable: boolean = true
  selectedCities3: any[] = [];
  cities: RoleI[] = [];
  public image: string = 'assets/demo.png'
  blockSpecial: RegExp = /^[^<>*!@.,]+$/
  public Roles1: any[] = []
  public bandera: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService,
    private usuariosService: UsuariosService,
  ) { }

  ngOnInit(): void {
    var token: string | null = localStorage.getItem('token');
    var user: string | null = localStorage.getItem('user');
    // var menu :string | null= localStorage.getItem('menu');
    if (token != null && user != null) {
      // this.showSuccess()
      let userObjeto: any = JSON.parse(user);
      // let menuObjeto:any = JSON.parse(menu); 
      let userLoginResponse = {
        user: userObjeto,
        token: token,
      }
      this.router.navigateByUrl('/welcome');
    } else { }
    this.buildForm();
  }
  public verificar() {
    // e.preventDefault();
    let email = this.form;

    let dominios = new Array('uniguajira.edu.co');

    // email.addEventListener('blur', function() {


    if (email.value.email1 == '' || email.value.email1 == 'undefined') {
      return false;

    } else {
      let value = email.value.email1.split('@'); //split() funciona para dividir una cadena en un array pasando un caracter como delimitador


      if (value[1] == undefined) {
        return false;
      } else {
        if (dominios.indexOf(value[1]) == -1) { //.indexOf() sirve para encontrar un elemento en un array

          dominios.forEach(function (dominio) { //utilizamos forEach para recorrer el arreglo.

          })
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: `El dominio aceptado es: ${dominios[0]}`, life: 1000 });

          return false;
        } else {
          return true;

        }
      }


    }

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      // DocumentTypeId: [1],
      // identification: ['', [Validators.required]],
      // GenderId:['', [Validators.required]],
      // address:['', [Validators.required]],
      // phone:['', [Validators.required]],
      email1: ['', [Validators.required]],
      // nationality: ['', [Validators.required]],
      // date_of_birth: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
      // documentTypeId: [1]
    });
  }

  onSubmit() {
    let email = this.form.value.email1;
    let formValue = {
      username: email.substring(0, email.indexOf('@')),
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name,
      email: this.form.value.email1,
      password: this.form.value.password,
    };
    if (this.form.value.password !== this.form.value.password2) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'Las contraseñas no coinciden' });
    } else {
      if (formValue.username != "" && formValue.email != "" && formValue.password != "") {
        this.bandera = true

        this.userService.createUser(formValue).subscribe(
          (user) => {
            var date = new Date('2020-01-01 00:00:03');
            function padLeft(n: any) {
              return n = "00".substring(0, "00".length - n.length) + n;
            }
            var interval = setInterval(() => {
              var minutes = padLeft(date.getMinutes() + "");
              var seconds = padLeft(date.getSeconds() + "");
              if (seconds == '03') {
                this.messageService.add({ severity: 'success', summary: 'Registro', detail: 'Registro exitoso.' });
              }
              if (seconds == '01') {
                this.bandera = false
                this.userService.getUserDetailsByEmail(formValue.email).subscribe(
                  (userData) => {
                    if (userData) {
                      const userId = userData.id;
                      const userRoleData = {
                        status: true,
                        userId: userId,
                        rolesId: 7
                      };
                      const bodyString = JSON.stringify(userRoleData);
                      const httpOptions = {
                        headers: new HttpHeaders({
                          'Content-Type': 'application/json'
                        })
                      };

                      this.usuariosService.asignarRoles(bodyString, httpOptions).subscribe(
                        (response) => {
                          if (response.status) {
                            this.messageService.add({ severity: 'success', summary: 'Registro', detail: 'Registro de autor exitoso.' });
                          }
                        },
                        (error) => {
                          console.error('Error al asignar el rol "autor" al usuario', error);
                        }
                      );
                    }
                  }
                )
              }

              date = new Date(date.getTime() - 1000);

              if (user.ok) {
                this.bandera = false
                this.router.navigateByUrl('/login');
                clearInterval(interval);
              }
            }, 1000);
          }, async (responseError) => {
            if (responseError.error && responseError.error.errors && responseError.error.errors.error) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error. ${responseError.error.errors.error.person}` });
            }
            this.bandera = false;
          });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Faltan datos' });
        this.bandera = false
      }
    }
  }
}
