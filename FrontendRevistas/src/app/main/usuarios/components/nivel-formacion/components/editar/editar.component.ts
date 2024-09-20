import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { NivelFormacion } from 'src/app/models/user/person';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})

export class EditarComponent implements OnInit {

  niveles: NivelFormacion[] = [];
  mostrarDialogo: boolean = false;
  tituloDialogo: string = 'Editar Nivel de Formación';
  nivelEdicion: NivelFormacion = {} as NivelFormacion;
  nivelSeleccionado: NivelFormacion | undefined;


  constructor(private UserService: UserService, public dialogService: DialogService, private messageService: MessageService) { }

  ngOnInit() {
    this.cargarNivelesFormacion();
  }

  mostrarDialogoEdicion(nivel: NivelFormacion) {
    if (nivel.id) {
      this.nivelSeleccionado = nivel;
      this.nivelEdicion.id = nivel.id; // Asignar el ID del nivel de formación seleccionado
      this.nivelEdicion.nombre = nivel.nombre; // Asignar otros valores que desees editar
      this.mostrarDialogo = true;
    } else {
      console.error("El nivel de formación seleccionado no tiene un ID válido.");
    }
  }
  

  cerrarDialogoEdicion() {
    this.nivelEdicion = {} as NivelFormacion;
    this.mostrarDialogo = false;
  }

  cargarNivelesFormacion() {
    this.UserService.obtenerNivelesFormacion().subscribe(data => {
      this.niveles = data as NivelFormacion[];
    });
  }

  editarNivelFormacion() {
    if (this.nivelEdicion.id) {
      this.UserService.editarNivelFormacion(this.nivelEdicion).subscribe(
        response => {
          console.log("Nivel de formación editado satisfactoriamente.", response);
          this.messageService.add({ severity: 'success', summary: 'Nivel de formacion editado de manera exitosa'});
          this.cerrarDialogoEdicion();
          this.cargarNivelesFormacion();
        },
        error => {
          console.error("Error al editar el nivel de formación", error);
          this.messageService.add({ severity: 'error', summary: 'El nivel de formacion no pudo ser editado'});
          // Realizar el manejo de errores adecuado.
        }
      );
    } else {
      console.error("No se puede editar el nivel de formación sin un ID válido.");
    }
  }

}