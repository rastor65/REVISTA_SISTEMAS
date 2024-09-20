import { Component, OnInit } from '@angular/core';
import { TablasTipoService } from 'src/app/core/services/auth/tablas-tipo.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { DocumentType } from 'src/app/models/user/person';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  documentos: DocumentType[] = [];
  mostrarDialogo: boolean = false;
  tituloDialogo: string = 'Editar tipo de documento';
  documentoEdicion: DocumentType = {} as DocumentType;
  documentoSeleccionado: DocumentType | undefined;


  constructor(private tablasTipoService: TablasTipoService, public dialogService: DialogService, private messageService: MessageService) { }

  ngOnInit() {
    this.cargarDocumentos();
  }

  mostrarDialogoEdicion(documento: DocumentType) {
    if (documento.id) {
      this.documentoSeleccionado = documento;
      this.documentoEdicion.id = documento.id; // Asignar el ID del nivel de formación seleccionado
      this.documentoEdicion.name = documento.name; // Asignar otros valores que desees editar
      this.mostrarDialogo = true;
    } else {
      console.error("El tipo de documento seleccionado no tiene un ID válido.");
    }
  }
  

  cerrarDialogoEdicion() {
    this.documentoEdicion = {} as DocumentType;
    this.mostrarDialogo = false;
  }

  cargarDocumentos() {
  this.tablasTipoService.getDocuments().subscribe(data => {
    this.documentos = data as DocumentType[]; // Asegúrate de que 'data' sea el arreglo de documentos
  });
}


  editarDocumento() {
    if (this.documentoEdicion.id) {
      this.tablasTipoService.editarDocumento(this.documentoEdicion).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Tipo de documento editado de manera exitosa'});
          this.cerrarDialogoEdicion();
          this.cargarDocumentos();
        },
        error => {
          console.error("Error al editar el Tipo de documento", error);
          this.messageService.add({ severity: 'error', summary: 'El Tipo de documento no pudo ser editado'});
          // Realizar el manejo de errores adecuado.
        }
      );
    } else {
      console.error("No se puede editar el Tipo de documento sin un ID válido.");
    }
  }

}