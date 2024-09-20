import { Component, OnInit } from '@angular/core';
import { TablasTipoService } from 'src/app/core/services/auth/tablas-tipo.service';
import { MessageService } from 'primeng/api';
import { GenderType } from 'src/app/models/user/person';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  genero: GenderType = {
    id: 0,
    name: '',
    status: true,
  };
  mensaje: string = '';

  constructor(private tablasTipoService: TablasTipoService, private messageService: MessageService) { }

  ngOnInit(): void {

  }

  crearNivelFormacion() {
    this.tablasTipoService.createGeneros(this.genero).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Genero creado de manera exitosa' });
        this.genero.name = '';
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'El Genero no pudo ser creado' });
        console.error(error);
      }
    );
  }

}