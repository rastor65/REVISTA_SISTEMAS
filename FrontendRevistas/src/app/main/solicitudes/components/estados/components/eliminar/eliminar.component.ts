import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css'],
  providers: [ConfirmationService]
})
export class EliminarComponent implements OnInit {

  estados: any[] = [];
  estadoSeleccionado: any = {};
  mostrarDialogo = false;

  constructor(private solicitudesService: SolicitudesService, private confirmationService: ConfirmationService) { }

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

  confirmarEliminarEstado(estado: any) {
    this.estadoSeleccionado = estado;
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este estado?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarEstado();
      }
    });
  }

  eliminarEstado() {
    this.solicitudesService.eliminarEstado(this.estadoSeleccionado.id).subscribe(
      response => {
        this.cargarEstados(); // Vuelve a cargar la lista de estados actualizada
      },
      error => {
        console.error('Error al eliminar estado:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    );
  }


}