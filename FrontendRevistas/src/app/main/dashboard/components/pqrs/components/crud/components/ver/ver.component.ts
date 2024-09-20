import { Component, OnInit } from '@angular/core';
import { PqrsService } from 'src/app/core/services/dashboard/pqrs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {

  API_URI = environment.API_URI;
  public token:any;
  public solicitudes: any [] = [];

  constructor(
    private pqrsService: PqrsService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerSolicitudes();
  }


  traerSolicitudes(){
    try {
      this.pqrsService.getAllPqrs(`${this.API_URI}/pqrs`, this.token).subscribe( respuesta => {
        // console.log(respuesta)
        this.solicitudes = respuesta.data.results;
      })
    } catch (error) {
      console.log(error)
    }
  }

}
