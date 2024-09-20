import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { Revistas } from 'src/app/models/solicitudes';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  revistas: Revistas[] = [];
  mostrarDialogo = false;
  revistaeditada: Revistas = {
    id: 0,
    nombre: '',
    status: true
  };

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

  editarRevista(revista: Revistas): void {
    this.revistaeditada = { ...revista };
    this.mostrarDialogo = true;
  }

  guardarCambios(): void {
    this.solicitudesService.actualizarRevista(this.revistaeditada).subscribe(
      response => {
        // Actualizar la lista de pasos si es necesario
        this.obtenerRevistas();
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
