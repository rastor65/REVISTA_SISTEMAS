import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PqrsService } from 'src/app/core/services/dashboard/pqrs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  API_URI = environment.API_URI;
  public token: any;
  public id: string = '';
  public display: boolean = false;
  public solicitudes: any[] = [];
  public tipoSolicitudes: any[] = [];

  public form = this.fb.group({
    tipopqrs: ['', Validators.required],
    description: ['', Validators.required],
    titulo: ['', Validators.required],
  })


  constructor(
    private fb: FormBuilder,
    private pqrsService: PqrsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerSolicitudes();
    this.traerTipoSolicitudes();
  }

  showEditar(id: any) {
    this.id = id;
    this.display = !this.display;
  }

  submit() {
    try {
      this.pqrsService.updatePqrs(`${this.API_URI}/pqrs/update/${this.id}/`, this.form.value, this.token).subscribe(respuesta => {
        this.form.reset();
        this.traerSolicitudes();
        this.showEditar('');
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Editado correctamente' })
      })
    } catch (error) {
      console.log(error)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema con la peticion' })
    }
  }

  traerSolicitudes() {
    this.solicitudes = [];
    try {
      this.pqrsService.getAllPqrs(`${this.API_URI}/pqrs`, this.token).subscribe(respuesta => {
        this.solicitudes = respuesta.data.results;
      })
    } catch (error) {
      console.log(error)
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al traer las solicitudes' })
    }
  }


  traerTipoSolicitudes() {

    try {
      this.pqrsService.getAllPqrs(`${this.API_URI}/pqrs/tipo/`, this.token).subscribe(respuesta => {
        this.tipoSolicitudes = respuesta.data.results;
      })
    } catch (error) {
      console.log(error)
    }
  }

}
