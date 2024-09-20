import { Component, OnInit } from '@angular/core';
import { TablasTipoService } from 'src/app/core/services/auth/tablas-tipo.service';
import { MessageService } from 'primeng/api';
import { DocumentType } from 'src/app/models/user/person';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})

export class CrearComponent implements OnInit {

  documento: DocumentType = {
    id: 0,
    createdAt: '',
    updateAt: '',
    name: '',
    status: true,
  };
  
  mensaje: string = '';

  constructor(private tablasTipoService: TablasTipoService, private messageService: MessageService) { }

  ngOnInit(): void {

  }

  crearNivelFormacion() {
    this.tablasTipoService.createDocument(this.documento).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Tipo de documento creado de manera exitosa' });
        this.documento.name = '';
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'El tipo de documento no pudo ser creado' });
        console.error(error);
      }
    );
  }

}