import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EncuestasService } from 'src/app/core/services/dashboard/encuestas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {

  API_URI = environment.API_URI;
  public token: any;
  public momentos: any[] = [];


  constructor(
    private confirmationService: ConfirmationService,
    private encuestasService: EncuestasService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerMomentos();
  }

  confirm(event: Event | any, id: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: '¿Seguro que desea eliminar este momento?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        try {
          this.encuestasService.delete(`${this.API_URI}/poll/momentos/delete/${id}/`, this.token).subscribe( respuesta =>  {
            this.traerMomentos();
            return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Eliminado correctamente !!!' })
          });
        } catch (error) {
          console.log(error)
        }
      },
      reject: () => {
        //reject action
      }
    });
  }

  traerMomentos(){
    this.momentos = [];
    try {
      this.encuestasService.getAll(`${this.API_URI}/poll/momentos/`, this.token).subscribe( respuesta =>  this.momentos = respuesta.data.results);
    } catch (error) {
      console.log(error)
    }
  }

}
