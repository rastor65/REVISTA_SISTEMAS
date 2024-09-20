import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Pasos } from 'src/app/models/solicitudes';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {

  pasos: Pasos[] = [];
  mostrarDialogo = false;
  pasoSeleccionado: Pasos = { id: 0, nivel: 0, nombre: '', dias_programacion: '', status: false };

  constructor(private solicitudesService: SolicitudesService) { }

  ngOnInit(): void {
    this.obtenerPasos();
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

  mostrarDialogoConfirmacion(paso: Pasos): void {
    this.pasoSeleccionado = { ...paso };
    this.mostrarDialogo = true;
  }

  desactivarPaso(): void {
    if (this.pasoSeleccionado) {
      this.pasoSeleccionado.status = false;
      this.solicitudesService.actualizarPaso(this.pasoSeleccionado).subscribe(
        response => {
          this.obtenerPasos();
          this.cerrarDialogo();
        },
        error => {
          console.error('Error al desactivar paso:', error);
        }
      );
    }
  }

  cerrarDialogo(): void {
    this.mostrarDialogo = false;
    this.pasoSeleccionado = { id: 0, nivel: 0, nombre: '', dias_programacion: '', status: false };
  }
}
