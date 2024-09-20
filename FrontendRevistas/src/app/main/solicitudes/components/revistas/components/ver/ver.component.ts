import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Revistas } from 'src/app/models/solicitudes';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent {
  
  revistas: Revistas[] = [];

  constructor(private solicitudesService: SolicitudesService) { }

  ngOnInit(): void {
    this.obtenerRevistas();
  }

  obtenerRevistas(): void {
    this.solicitudesService.obtenerRevistas().subscribe(
      response => {
        this.revistas = response;
      },
      error => {
        console.error('Error al obtener las revistas:', error);
      }
    );
  }

}
