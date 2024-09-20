import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClasificadosService } from 'src/app/core/services/dashboard/clasificados.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  API_URI = environment.API_URI;
  public token: any;
  public id: any = '';
  public secciones: any[] = [];
  public seccionesVerificated: any[] = [];
  public display: boolean = false;
  public form = this.fb.group({
    name: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private clasificadosService: ClasificadosService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerSecciones();
  }

  showEditar(id: any) {
    this.id = id;
    this.display = !this.display;
  }

  submit() {
    if( this.seccionesVerificated.includes( this.form.value.name.trim().toLowerCase())){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Esta seccion ya existe' })
    }

    try {
      this.clasificadosService.update(`${this.API_URI}/advertisements/seccion/update/${this.id}/`, this.form.value, this.token).subscribe(r => {
        this.traerSecciones();
        this.form.reset();
        this.display = false;
        return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Editado correctamente !!!' })
      })
    } catch (error) {
      console.log(error)
    }
  }

  traerSecciones() {
    this.secciones = [];
    this.seccionesVerificated = [];
    try {
      this.clasificadosService.getAll(`${this.API_URI}/advertisements/seccion/`, this.token).subscribe(r => {
        this.secciones = r.data.results;
        r.data.results.map((seccion: any) => this.seccionesVerificated.push(seccion.name.trim().toLowerCase()));
      })
    } catch (error) {
      console.log(error)
    }
  }

}
