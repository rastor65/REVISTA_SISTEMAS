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
  public subCategoria: any[] = [];
  public subCategoriaVerificated: any[] = [];
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
    this.traerSubCategorias();
  }

  showEditar(id: any) {
    this.id = id;
    this.display = !this.display;
  }

  submit() {
    if( this.subCategoriaVerificated.includes( this.form.value.name.trim().toLowerCase())){
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Esta SubCategoria ya existe' })
    }

    try {
      this.clasificadosService.update(`${this.API_URI}/advertisements/sub/category/update/${this.id}/`, this.form.value, this.token).subscribe(r => {
        this.traerSubCategorias();
        this.form.reset();
        this.display = false;
        return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Editado correctamente !!!' })
      })
    } catch (error) {
      console.log(error)
    }
  }

  traerSubCategorias() {
    this.subCategoria = [];
    this.subCategoriaVerificated = [];
    try {
      this.clasificadosService.getAll(`${this.API_URI}/advertisements/sub/category/`, this.token).subscribe(r => {
        this.subCategoria = r.data.results;
        r.data.results.map((seccion: any) => this.subCategoriaVerificated.push(seccion.name.trim().toLowerCase()));
      })
    } catch (error) {
      console.log(error)
    }
  }

}
