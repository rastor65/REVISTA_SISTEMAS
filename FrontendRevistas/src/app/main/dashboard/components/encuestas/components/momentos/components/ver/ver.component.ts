import { Component, OnInit } from '@angular/core';
import { EncuestasService } from 'src/app/core/services/dashboard/encuestas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  API_URI = environment.API_URI;

  public momentos: any[] = [];
  public token:any;

  constructor(
    private momentosService: EncuestasService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerMomentos();
  }

  traerMomentos(){
    this.momentosService.getAll(`${this.API_URI}/poll/momentos/`,this.token).subscribe( respuesta => {
      respuesta.data.results.map( (momento:any) => this.momentos.push(momento))
    })
  }

}
