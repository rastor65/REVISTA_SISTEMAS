import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EncuestasService } from 'src/app/core/services/dashboard/encuestas.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  API_URI = environment.API_URI;
  public form = this.fb.group({
    tipo: ['', Validators.required]
  })
  public token: any;
  public momentos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private momentoService: EncuestasService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerMomentos()
  }

  onSubmit() {
    if (this.momentos.includes(this.form.value.tipo.toLowerCase())) {
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Este momento ya existe' });
    }

    this.momentoService.create(`${this.API_URI}/poll/momentos/create/`, this.form.value, this.token).subscribe(respuesta => {
      
      this.form.reset()
      this.traerMomentos();
      return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Momento creado correctamente' });
    })
  }


  traerMomentos() {
    this.momentoService.getAll(`${this.API_URI}/poll/momentos/`, this.token).subscribe(respuesta => {
      this.momentos = [];
      respuesta.data.results.map((momento: any) => this.momentos.push(momento.tipo))
    })

  }


}
