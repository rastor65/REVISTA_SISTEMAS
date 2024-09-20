import { Component, OnInit } from '@angular/core';
import { TablasTipoService } from 'src/app/core/services/auth/tablas-tipo.service';
import { MessageService } from 'primeng/api';
import { DocumentType } from 'src/app/models/user/person';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {

  ngOnInit(): void {

    this.cargarDocumentos();
  }

  documento: DocumentType[] = [];
  mostrarDialogo: boolean = false;
  documentoSeleccionado: DocumentType | null = null;


  constructor(private tablasTipoService: TablasTipoService, private messageService: MessageService) { }

  mostrarDialogoEliminacion(nivel: DocumentType) {
    this.documentoSeleccionado = nivel;
    this.mostrarDialogo = true;
  }

  cerrarDialogoEliminacion() {
    this.documentoSeleccionado = null;
    this.mostrarDialogo = false;
  }

  cargarDocumentos() {
    this.tablasTipoService.getDocuments().subscribe(data => {
      this.documento = data as DocumentType[];
    });
  }

  eliminarDocumento() {
    if (this.documentoSeleccionado) {
      const nivelId: number = this.documentoSeleccionado.id;

      this.tablasTipoService.eliminarDocumento(nivelId).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Nivel de formacion eliminado de manera exitosa' });
          this.cargarDocumentos();
        },
        error => {
          console.error("Error al eliminar el nivel de formación", error);
          this.messageService.add({ severity: 'error', summary: 'El nivel de formacion no pudo ser eliminado' });
        }
      );
    }

    this.cerrarDialogoEliminacion();
  }

}
