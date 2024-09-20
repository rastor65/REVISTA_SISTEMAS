import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { PqrsService } from 'src/app/core/services/dashboard/pqrs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {

  API_URI = environment.API_URI;
  public tipo_solicitudes: any[] = [];
  public token: any;

  constructor(
    private pqrsService: PqrsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerPreguntas();
  }


  traerPreguntas() {
    this.tipo_solicitudes = [];
    try {
      this.pqrsService.getAllPqrs(`${this.API_URI}/pqrs/tipo/`, this.token).subscribe(respuesta => this.tipo_solicitudes = respuesta.data.results)
    } catch (error) {
      console.log(error)
    }
  }

  confirm(event: Event | any, id:any) {
    this.confirmationService.confirm({
      target: event.target,
      message: '¿Seguro que desea eliminar la pregunta?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        try {
          this.pqrsService.deletePqrs(`${this.API_URI}/pqrs/tipo/delete/${id}/`, this.token).subscribe(respuesta => {
            this.traerPreguntas();
            return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Eliminado correctamente !!!' });
          });
        } catch (error) {
          console.log(error)
          return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema en la consulta' });
        }
      },
      reject: () => {
        //reject action
      }
    });
  }
}
