import { Component, OnInit } from '@angular/core';
import { TablasTipoService } from 'src/app/core/services/auth/tablas-tipo.service';
import { MessageService } from 'primeng/api';
import { GenderType } from 'src/app/models/user/person';
@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {

  ngOnInit(): void {

    this.cargarGeneros();
  }

  genero: GenderType[] = [];
  mostrarDialogo: boolean = false;
  generoSeleccionado: GenderType | null = null;


  constructor(private tablasTipoService: TablasTipoService, private messageService: MessageService) { }

  mostrarDialogoEliminacion(nivel: GenderType) {
    this.generoSeleccionado = nivel;
    this.mostrarDialogo = true;
  }

  cerrarDialogoEliminacion() {
    this.generoSeleccionado = null;
    this.mostrarDialogo = false;
  }

  cargarGeneros() {
    this.tablasTipoService.obtenerGeneros().subscribe(data => {
      this.genero = data as GenderType[];
    });
  }

  eliminarGenero() {
    if (this.generoSeleccionado) {
      const nivelId: number = this.generoSeleccionado.id;

      this.tablasTipoService.eliminarGeneros(nivelId).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Nivel de formacion eliminado de manera exitosa'});
          this.cargarGeneros();
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
