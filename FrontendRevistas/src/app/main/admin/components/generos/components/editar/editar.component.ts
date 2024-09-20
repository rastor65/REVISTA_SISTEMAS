import { Component, OnInit } from '@angular/core';
import { TablasTipoService } from 'src/app/core/services/auth/tablas-tipo.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { GenderType } from 'src/app/models/user/person';



@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  generos: GenderType[] = [];
  mostrarDialogo: boolean = false;
  tituloDialogo: string = 'Editar tipo de documento';
  generoEdicion: GenderType = {} as GenderType;
  generoSeleccionado: GenderType | undefined;


  constructor(private tablasTipoService: TablasTipoService, public dialogService: DialogService, private messageService: MessageService) { }

  ngOnInit() {
    this.cargarDocumentos();
  }

  mostrarDialogoEdicion(documento: GenderType) {
    if (documento.id) {
      this.generoSeleccionado = documento;
      this.generoEdicion.id = documento.id; // Asignar el ID del nivel de formación seleccionado
      this.generoEdicion.name = documento.name; // Asignar otros valores que desees editar
      this.mostrarDialogo = true;
    } else {
      console.error("El tipo de documento seleccionado no tiene un ID válido.");
    }
  }


  cerrarDialogoEdicion() {
    this.generoEdicion = {} as GenderType;
    this.mostrarDialogo = false;
  }

  cargarDocumentos() {
    this.tablasTipoService.obtenerGeneros().subscribe(data => {
      this.generos = data as GenderType[]; // Asegúrate de que 'data' sea el arreglo de documentos
    });
  }


  editarGenero() {
    if (this.generoEdicion.id) {
      this.tablasTipoService.editarGeneros(this.generoEdicion).subscribe(
        response => {
          console.log("Tipo de documento editado satisfactoriamente.", response);
          this.messageService.add({ severity: 'success', summary: 'Tipo de documento editado de manera exitosa' });
          this.cerrarDialogoEdicion();
          this.cargarDocumentos();
        },
        error => {
          console.error("Error al editar el Tipo de documento", error);
          this.messageService.add({ severity: 'error', summary: 'El Tipo de documento no pudo ser editado' });
          // Realizar el manejo de errores adecuado.
        }
      );
    } else {
      console.error("No se puede editar el Tipo de documento sin un ID válido.");
    }
  }

}