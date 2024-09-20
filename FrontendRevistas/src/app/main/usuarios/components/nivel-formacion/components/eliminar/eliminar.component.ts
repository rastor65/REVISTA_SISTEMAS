import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { MessageService } from 'primeng/api';
import { NivelFormacion } from 'src/app/models/user/person';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})

export class EliminarComponent implements OnInit {

  ngOnInit(): void {

    this.cargarNivelesFormacion();
  }

  niveles: NivelFormacion[] = [];
  mostrarDialogo: boolean = false;
  nivelSeleccionado: any | null = null;


  constructor(private userService: UserService, private messageService: MessageService) { }

  mostrarDialogoEliminacion(nivel: NivelFormacion) {
    this.nivelSeleccionado = nivel;
    this.mostrarDialogo = true;
  }

  cerrarDialogoEliminacion() {
    this.nivelSeleccionado = null;
    this.mostrarDialogo = false;
  }

  cargarNivelesFormacion() {
    this.userService.obtenerNivelesFormacion().subscribe(data => {
      this.niveles = data as NivelFormacion[];
    });
  }

  eliminarNivelFormacion() {
    if (this.nivelSeleccionado) {
      const nivelId: number = this.nivelSeleccionado.id;

      this.userService.eliminarNivelFormacion(nivelId).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Nivel de formacion eliminado de manera exitosa'});
          this.cargarNivelesFormacion();
        },
        error => {
          console.error("Error al eliminar el nivel de formación", error);
          this.messageService.add({ severity: 'error', summary: 'El nivel de formacion no pudo ser eliminado'});
        }
      );
    }

    this.cerrarDialogoEliminacion();
  }


}
