import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EncuestasService } from 'src/app/core/services/dashboard/encuestas.service';
import { environment } from 'src/environments/environment';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {

  API_URI = environment.API_URI;
  public preguntas: any[] = [];
  public token: any;

  constructor(
    private preguntasService: EncuestasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerPreguntas();
  }


  traerPreguntas() {
    this.preguntas = [];
    try {
      this.preguntasService.getAll(`${this.API_URI}/poll/questions/`, this.token).subscribe(respuesta => this.preguntas = respuesta.data.results)
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
          this.preguntasService.delete(`${this.API_URI}/poll/questions/${id}/`, this.token).subscribe(respuesta => this.preguntas = respuesta.data.results);
          this.traerPreguntas();
          return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Pregunta eliminada correctamente !!!' });
        } catch (error) {
          console.log(error)
        }
      },
      reject: () => {
        //reject action
      }
    });
  }

}
