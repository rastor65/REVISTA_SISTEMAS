import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Pasos, Revistas } from 'src/app/models/solicitudes';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {

  revistas: Revistas[] = [];
  mostrarDialogo = false;
  revistaSeleccionada: Revistas = { 
    id: 0, 
    nombre: '', 
    status: false };

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


  mostrarDialogoConfirmacion(revista: Revistas): void {
    this.revistaSeleccionada = { ...revista };
    this.mostrarDialogo = true;
  }

  desactivarRevista(): void {
    if (this.revistaSeleccionada) {
      this.revistaSeleccionada.status = false;
      this.solicitudesService.actualizarRevista(this.revistaSeleccionada).subscribe(
        response => {
          this.obtenerRevistas();
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
    this.revistaSeleccionada = { 
      id: 0, 
      nombre: '', 
      status: false 
    };
  }
}
