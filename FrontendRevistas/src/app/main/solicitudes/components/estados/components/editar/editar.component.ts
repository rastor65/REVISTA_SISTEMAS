import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Estado } from 'src/app/models/solicitudes';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  estados: any[] = [];
  estadoSeleccionado: any = {};
  mostrarDialogo = false;

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

  abrirDialogo(estado: any) {
    this.estadoSeleccionado = { ...estado };
    this.mostrarDialogo = true;
  }

  guardarCambios() {
    // Lógica para guardar los cambios en el estado seleccionado
    this.solicitudesService.actualizarEstado(this.estadoSeleccionado).subscribe(
      response => {
        this.mostrarDialogo = false;
        this.cargarEstados(); // Vuelve a cargar la lista de estados actualizada
      },
      error => {
        console.error('Error al actualizar estado:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    );
  }

}
