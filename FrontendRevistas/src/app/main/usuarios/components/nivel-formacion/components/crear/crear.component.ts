import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { MessageService } from 'primeng/api';
import { NivelFormacion } from 'src/app/models/user/person';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  nivel: NivelFormacion = {
    id: 0,
    nombre: ''
  };
  mensaje: string = '';

  constructor(private UserService: UserService, private messageService: MessageService) { }

  ngOnInit(): void {

  }

  crearNivelFormacion() {
    this.UserService.crearNivelFormacion(this.nivel).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Nivel de formacion creado de manera exitosa' });
        this.nivel.nombre = '';
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'El nivel de formacion no pudo ser creado' });
        console.error(error);
      }
    );
  }

}