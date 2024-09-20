import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { Pasos } from 'src/app/models/solicitudes';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  pasos: Pasos[] = [];
  mostrarDialogo = false;
  pasoEditado: Pasos = { id: 0, nivel: 0, nombre: '', dias_programacion: '', status: false };

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

  editarPaso(paso: Pasos): void {
    this.pasoEditado = { ...paso };
    this.mostrarDialogo = true;
  }

  guardarCambios(): void {
    this.solicitudesService.actualizarPaso(this.pasoEditado).subscribe(
      response => {
        // Actualizar la lista de pasos si es necesario
        this.obtenerPasos();
        this.mostrarDialogo = false;
      },
      error => {
        console.error('Error al guardar los cambios:', error);
      }
    );
  }
  

  cerrarDialogo(): void {
    this.mostrarDialogo = false;
  }
}
