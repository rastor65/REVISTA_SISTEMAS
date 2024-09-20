import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PqrsService } from 'src/app/core/services/dashboard/pqrs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  API_URI = environment.API_URI;
  public token: any;
  public tipoSolicitudes: any[] = [];
  public User: any;
  public form = this.fb.group({
    description: ['', Validators.required],
    tipopqrs: ['', Validators.required],
    titulo: ['', Validators.required],
  })

  constructor(
    private pqrsService: PqrsService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.User = JSON.parse(localStorage.getItem('user')!);
    this.traerTipoSolicitudes();
  }


  onSubmit() {

    // console.log(this.form.value)
    let body = {
      "description": this.form.value.description,
      "persona": this.User.id,
      "tipopqrs": this.form.value.tipopqrs.id,
      "titulo": this.form.value.titulo
    }
    // console.log(body)

    try {
      this.pqrsService.createPqrs(`${this.API_URI}/pqrs/create/`, body, this.token).subscribe(respuesta => {
        
        this.form.reset();
        return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Creado correctamente !!!' })
      })
    } catch (error) {
      console.log(error)
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema en la consulta' })
    }
  }

  traerTipoSolicitudes() {
    try {
      this.pqrsService.getAllPqrs(`${this.API_URI}/pqrs/tipo/`, this.token).subscribe(respuesta => {
        // console.log(respuesta.data.results)
        this.tipoSolicitudes = respuesta.data.results;
      })
    } catch (error) {
      console.log(error)
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema en la consulta' })
    }
  }

}
