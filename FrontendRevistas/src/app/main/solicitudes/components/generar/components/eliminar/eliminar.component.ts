import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { Solicitud, Contenido } from 'src/app/models/solicitudes';
import { Person } from 'src/app/models/user/person';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent {
  solicitudes: Solicitud[] = [];
  eliminarDialogVisible: boolean = false;
  solicitudSeleccionada: Solicitud | null = null;
  searchText: string = '';
  filteredSolicitudes: Solicitud[] = [];
  usuarios: Person[] = [];
  viewType: string = 'table';

  constructor(
    private dialogService: DialogService,
    private solicitudesService: SolicitudesService,
    private messageService: MessageService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarAutores();
  }

  cargarAutores(): void {
    this.userService.ObtenerUsuarios().subscribe(
      (data: Person[]) => {
        this.usuarios = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  toggleView(view: string) {
    this.viewType = view;
  }

  getAutoresNombres(AutoresIds: number[] | undefined): string {
    if (AutoresIds && AutoresIds.length > 0) {
      const nombresUnicos = new Set<string>();
      for (const usuarioId of AutoresIds) {
        const usuario = this.usuarios.find(u => u.user === usuarioId);
        if (usuario) {
          nombresUnicos.add(`${usuario.nombres} ${usuario.apellidos}`);
        }
      }
      if (nombresUnicos.size > 0) {
        return Array.from(nombresUnicos).join(', '); // Concatenar nombres únicos separados por comas
      }
    }
    return 'Autores desconocidos';
  }

  cargarSolicitudes(): void {
    this.solicitudesService.obtenerSolicitudes().subscribe(
      (data: Solicitud[]) => {
        this.solicitudes = data;
        this.filteredSolicitudes = this.solicitudes;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  eliminarSolicitud(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.eliminarDialogVisible = true;
  }

  cancelarEliminar(): void {
    this.eliminarDialogVisible = false;
    this.solicitudSeleccionada = null;
  }

  confirmarEliminar(): void {
    if (this.solicitudSeleccionada) {
      this.solicitudSeleccionada.status = false; // Cambiar el estado
      this.solicitudesService.editarSolicitud(this.solicitudSeleccionada).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Solicitud Eliminada', detail: 'La solicitud se eliminó exitosamente' });
          this.cargarSolicitudes();
        },
        (error) => {
          console.error('Error al cambiar el estado de la solicitud:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la solicitud' });
        }
      );
      this.eliminarDialogVisible = false;
      this.solicitudSeleccionada = null;
    }
  }

  buscarSolicitudes(): void {
    if (this.searchText.trim() === '') {
      this.filteredSolicitudes = this.solicitudes;
    } else {
      this.filteredSolicitudes = this.solicitudes.filter((solicitud) => {

        const tituloArticuloMatch = solicitud.titulo_articulo.toLowerCase().includes(this.searchText.toLowerCase());
        const afiliacionMatch = solicitud.afiliacion.toLowerCase().includes(this.searchText.toLowerCase());
        const autoresMatch = this.getAutoresNombres(solicitud.autores).toLowerCase().includes(this.searchText.toLowerCase());

        return tituloArticuloMatch || afiliacionMatch || autoresMatch;
      });
    }
  }



}
