import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClasificadosService } from 'src/app/core/services/dashboard/clasificados.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  API_URI = environment.API_URI;
  // public form = this.fb.group({
  //   datos: ['', Validators.required],
  //   seccion: ['', Validators.required],
  //   categoria: new FormControl({value: '', disabled: true}, Validators.required),
  //   subCategori: new FormControl({value: '', disabled: true}, Validators.required),
  // })
  public token: any;
  public secciones: any[] = [];
  public categorias: any[] = [];
  public subCategorias: any[] = [];

  public datos: string = '';
  public seccion: any = '';
  public categoria: any = '';
  public subCategoria: any = '';

  public banderaCategorias: boolean = true;
  public banderaSubCategorias: boolean = true;


  constructor(
    private fb: FormBuilder,
    private clasificadosService: ClasificadosService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerSecciones();
  }

  onSubmit() {
    let body = {
      "datos": this.datos,
      "subCategori": this.subCategoria.id
    }
    try {
      this.clasificadosService.create(`${this.API_URI}/advertisements/create/`, body ,this.token).subscribe(r => {
        this.reset();  
        return this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Creado correctamente'})
      })
    } catch (error) {
      console.log(error)
    }
  }

  traerSecciones() {
    try {
      this.clasificadosService.getAll(`${this.API_URI}/advertisements/seccion/`, this.token).subscribe(r => {
        this.secciones = r.data.results;
      })
    } catch (error) {
      console.log(error)
    }
  }

  onChangeSecciones(event: any) {
    let body = {
      "type": "categorias",
      "id": event.id
    }
    try {
      this.clasificadosService.create(`${this.API_URI}/advertisements/seccion/query/`, body, this.token).subscribe(r => {
        this.categorias = r.data.results;
        this.banderaCategorias = false;
      })
    } catch (error) {
      console.log(error)
    }
  }
  onChangeCategorias(event: any) {
    let body = {
      "type": "subCategorias",
      "id": event.id
    }

    try {
      this.clasificadosService.create(`${this.API_URI}/advertisements/seccion/query/`, body, this.token).subscribe(r => {
        this.subCategorias = r.data.results;
        this.banderaSubCategorias = false;
      })
    } catch (error) {
      console.log(error)
    }
  }

  reset(){
    this.datos = '';
    this.seccion = '';
    this.categoria = '';
    this.subCategoria = '';   

    this.banderaCategorias = true;
    this.banderaSubCategorias = true;

    this.categorias = [];
    this.subCategorias = [];
  }

}
