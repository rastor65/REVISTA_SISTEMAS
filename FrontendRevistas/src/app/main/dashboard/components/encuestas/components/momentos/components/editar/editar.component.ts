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
  public momentos: any[] = [];
  public momentosTipo: any[] = [];
  public token: any;
  public display: boolean = false;
  public id: any = '';

  public form = this.fb.group({
    tipo: ['', Validators.required]
  })

  constructor(
    private messageService: MessageService,
    private momentosService: EncuestasService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerMomentos();
  }


  submit() {

    if (this.momentosTipo.includes(this.form.value.tipo)) {
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Este momento ya existe' });
    }
    try {
      this.momentosService.update(`${this.API_URI}/poll/momentos/update/${this.id}/`, this.form.value, this.token).subscribe(respuesta => {
        
        this.form.reset();
        this.traerMomentos();
        this.changeDisplay(this.id)
        return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Editado correctamente' });
      })
    } catch (error: any) {
      this.traerMomentos();
      return this.messageService.add({ severity: 'success', summary: 'Success', detail: `${error.errors.error}` });
    }
  }

  traerMomentos() {
    this.momentos = [];
    this.momentosTipo = [];
    this.momentosService.getAll(`${this.API_URI}/poll/momentos/`, this.token).subscribe(respuesta => {
      respuesta.data.results.map((momento: any) => this.momentosTipo.push(momento.tipo.toLowerCase()))
      respuesta.data.results.map((momento: any) => this.momentos.push(momento))

    })
  }
  changeDisplay(id: any = '') {
    this.id = id
    this.display = !this.display
  }


}
