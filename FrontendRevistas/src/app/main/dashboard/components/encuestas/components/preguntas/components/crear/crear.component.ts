import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EncuestasService } from 'src/app/core/services/dashboard/encuestas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  API_URI = environment.API_URI;

  public token: any;

  public momentos: any[] = [];

  public form = this.fb.group({
    pregunta_nombre: ['', Validators.required],
    momento: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private preguntasService: EncuestasService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerMomentos();
  }

  onSubmit() {
    let body = {
      "pregunta_nombre": this.form.value.pregunta_nombre,
      "momento": this.form.value.momento.id,
    }
    // console.log(body)
    try {
      this.preguntasService.create(`${this.API_URI}/poll/questions/create/`, body, this.token).subscribe(respuesta => {
        this.form.reset();
        return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Pregunta creada correctamente' });
      })
    } catch (error) {
      console.log(error)
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
    }
    // console.log(this.form.value)
  }

  traerMomentos() {
    try {
      this.preguntasService.getAll(`${this.API_URI}/poll/momentos/`, this.token).subscribe(respuesta => {
        this.momentos = respuesta.data.results;
      })
    } catch (error) {
      console.log(error)
    }
  }

}
