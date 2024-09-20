import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Pasos } from 'src/app/models/solicitudes';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {

  pasos: Pasos[] = [];
  currentView: 'table' | 'cards' = 'table';

  constructor(private solicitudesService: SolicitudesService) { }

  ngOnInit(): void {
    this.obtenerPasos();
  }

  toggleView(view: 'table' | 'cards'): void {
    this.currentView = view;
  }

  obtenerPasos(): void {
    this.solicitudesService.obtenerPasos().subscribe(
      response => {
        this.pasos = response;
      },
      error => {
        console.error('Error al obtener pasos:', error);
      }
    );
  }
}
