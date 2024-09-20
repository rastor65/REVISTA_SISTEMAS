import { Component, OnInit } from '@angular/core';
import { ClasificadosService } from 'src/app/core/services/dashboard/clasificados.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {

  API_URI = environment.API_URI;
  public token: any;
  public categorias: any[] = [];

  constructor(
    private clasificadosService: ClasificadosService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerCategorias();
  }


  traerCategorias(){
    try {
      this.clasificadosService.getAll(`${this.API_URI}/advertisements/sub/category/`, this.token).subscribe( r => {
        this.categorias =  r.data.results
      })
    } catch (error) {
      console.log( error)
    }
  }

}
