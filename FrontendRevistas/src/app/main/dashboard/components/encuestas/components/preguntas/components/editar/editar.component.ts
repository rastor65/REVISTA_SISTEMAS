import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EncuestasService } from 'src/app/core/services/dashboard/encuestas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  API_URI = environment.API_URI;

  public preguntas: any[] = [];
  public momentos: any[] = [];
  // public preguntasVerificated: any[] = [];
  public token: any;
  public idPregunta: any = '';
  public display: boolean = false;
  public form = this.fb.group({
    pregunta_nombre: ['', Validators.required],
    momento: ['', Validators.required],
  })

  constructor(
    private preguntaService: EncuestasService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerPreguntas();
    this.traerMomentos();
  }

  traerPreguntas() {
    this.preguntas = [];
    // this.preguntasVerificated = [];
    try {
      this.preguntaService.getAll(`${this.API_URI}/poll/questions/`, this.token).subscribe(respuesta => {
        this.preguntas = respuesta.data.results;
        // respuesta.data.results.map((pregunta: any) => this.preguntasVerificated.push(pregunta.trim().toLowerCase()))
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  traerMomentos(){
    this.momentos = [];

    try {
      this.preguntaService.getAll(`${this.API_URI}/poll/momentos/`, this.token).subscribe(respuesta => {
        this.momentos = respuesta.data.results;
      //  respuesta.data.results.map( (momento:any) => this.momentos.push( momento.id))
      })
    } catch (error) {
      console.log(error)
    }
  }

  submit() {

    // if( this.preguntasVerificated.includes(this.form.value.pregunta_nombre.trim().toLowerCase())){
    //   return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Esta pregunta ya existe' });
    // }
    // console.log(this.form.value)

    let body = {
      pregunta_nombre: this.form.value.pregunta_nombre,
      momento: this.form.value.momento.id
    }
    try {
      this.preguntaService.update(`${this.API_URI}/poll/questions/update/${this.idPregunta}/`, body, this.token).subscribe(respuesta => {
        this.form.reset();
        this.traerPreguntas();
        this.traerMomentos();
        this.showEditar(this.idPregunta)
        return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Pregunta editada correctamente' });
      })
    } catch (error) {
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error : ${error}` });
    }


  }

  showEditar(id: any) {
    this.idPregunta = id;
    this.display = !this.display;
  }
}
