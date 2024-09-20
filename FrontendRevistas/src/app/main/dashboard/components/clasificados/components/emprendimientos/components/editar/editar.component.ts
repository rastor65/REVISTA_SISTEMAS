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
  public emprendimientos: any[] = [];
  public emprendimientosVerificated: any[] = [];
  public display: boolean = false;
  public form = this.fb.group({
    datos: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private clasificadosService: ClasificadosService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerEmprendimientos();
  }

  showEditar(id: any) {
    this.id = id;
    this.display = !this.display;
  }

  submit() {
    if( this.emprendimientosVerificated.includes( this.form.value.datos.trim().toLowerCase())){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Esta seccion ya existe' })
    }

    try {
      this.clasificadosService.update(`${this.API_URI}/advertisements/update/${this.id}`, this.form.value, this.token).subscribe(r => {
        this.traerEmprendimientos();
        this.form.reset();
        this.display = false;
        return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Editado correctamente !!!' })
      })
    } catch (error) {
      console.log(error)
    }
  }

  traerEmprendimientos() {
    this.emprendimientos = [];
    this.emprendimientosVerificated = [];
    try {
      this.clasificadosService.getAll(`${this.API_URI}/advertisements/`, this.token).subscribe(r => {
        this.emprendimientos = r.data;
        r.data.map((emprendimiento: any) => this.emprendimientosVerificated.push(emprendimiento.datos.trim().toLowerCase()));
      })
    } catch (error) {
      console.log(error)
    }
  }


}
