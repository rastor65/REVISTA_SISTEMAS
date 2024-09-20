import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PqrsService } from 'src/app/core/services/dashboard/pqrs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {



  API_URI = environment.API_URI;
  public token: any;
  public solicitudes: any;
  public display: boolean = false;
  public solicitud = {
    "id": '',
    "titulo": "",
    "description": "",
    "persona": "",
    "tipopqrs": ""
  };
  // public solicitud = {
  //   "id": 19,
  //   "titulo": "Necesito mi comprobante",
  //   "description": "Necesito mi comprobante para mi proyecto de grado",
  //   "persona": "egresado",
  //   "tipopqrs": "Quejas"
  // };

  constructor(
    private pqrsService: PqrsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.traerSolicitudes();
  }

  traerSolicitudes() {
    try {
      this.pqrsService.getAllPqrs(`${this.API_URI}/pqrs`, this.token).subscribe(respuesta => {
        this.solicitudes = respuesta.data.results;
        console.log(respuesta)
      })
    } catch (error) {

    }
  }

  verDetalles(solicitud: any) {
    this.display = true;
    this.solicitud = solicitud;
    // console.log(solicitud)
  }

  atender(id:any) {
    this.router.navigate(['/dashboard/pqrs/respuesta/verDetalles'], { queryParams: { id: id } });
    // this.router.navigateByUrl('/dashboard/pqrs/respuesta/verDetalles')
  }



}
