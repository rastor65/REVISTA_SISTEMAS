import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Estado } from 'src/app/models/solicitudes';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit{

  estados: Estado[] = [];

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.cargarEstados();
  }

  cargarEstados() {
    this.solicitudesService.obtenerEstados().subscribe(
      response => {
        this.estados = response;
      },
      error => {
        console.error('Error al cargar estados:', error);
      }
    );
  }
}
