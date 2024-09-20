import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seguimiento, Solicitud, Pasos, Estado } from 'src/app/models/solicitudes';
import { UserService } from 'src/app/core/services/usuarios/user.service';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {

  seguimientoSeleccionado: Seguimiento | null = null;
  solicitudes: Solicitud[] = [];
  pasos: Pasos[] = [];
  seguimientoForm: FormGroup;
  seguimientos: Seguimiento[] = [];
  mostrarDialogo: boolean = false;
  eliminarConfirmado: boolean = false;
  estados: Estado[] = [];
  responsables: any[] = [];
  searchText: string = '';
  filteredSeguimientos: Seguimiento[] = [];

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.seguimientoForm = this.formBuilder.group({
      solicitud: ['', Validators.required],
      paso: ['', Validators.required],
      fecha: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.obtenerSeguimientos();
    this.obtenerPasos();
    this.obtenerSolicitudes();
    this.obtenerEstados();
    this.obtenerUsuarios();
  }

  obtenerSeguimientos() {
    this.solicitudesService.obtenerSeguimientos().subscribe(
      (seguimientos: Seguimiento[]) => {
        this.seguimientos = seguimientos;
        this.filteredSeguimientos = seguimientos;
      },
      (error: any) => {
        console.error('Error al obtener los seguimientos', error);
      }
    );
  }

  obtenerPasos(): void {
    this.solicitudesService.obtenerPasos().subscribe(
      (pasos: any[]) => {
        this.pasos = pasos;
      },
      (error: any) => {
        console.error('Error al obtener los pasos de solicitud', error);
      }
    );
  }

  obtenerSolicitudes(): void {
    this.solicitudesService.obtenerSolicitudes().subscribe(
      (solicitudes: Solicitud[]) => {
        this.solicitudes = solicitudes;
      },
      (error: any) => {
        console.error('Error al obtener las solicitudes', error);
      }
    );
  }

  obtenerUsuarios(): void {
    this.userService.ObtenerUsuarios().subscribe(
      (response: any) => {

        if (response && Array.isArray(response)) {
          this.responsables = response;
        } else {
          console.error('Respuesta inválida del backend:', response);
        }
      },
      (error: any) => {
        console.error('Error al obtener la lista de usuarios', error);
      }
    );
  }

  obtenerEstados(): void {
    this.solicitudesService.obtenerEstados().subscribe(
      (estados: any[]) => {
        this.estados = estados;
      },
      (error: any) => {
        console.error('Error al obtener los estados', error);
      }
    );
  }

  getSolicitudNombre(solicitudId: number): string {
    const solicitud = this.solicitudes.find(s => s.id === solicitudId);
    return solicitud ? solicitud.titulo_articulo : '';
  }

  getPasoNombre(pasoId: number): string {
    const paso = this.pasos.find(p => p.id === pasoId);
    return paso ? paso.nombre : '';
  }

  getEstadoNombre(estadoId: number): string {
    const estado = this.estados.find(e => e.id === estadoId);
    return estado ? estado.nombre : '';
  }

  getResponsableNombre(responsableId: number): string {
    const responsable = this.responsables.find(r => r.user === responsableId);
    return responsable ? `${responsable.nombres} ${responsable.apellidos}` : '';
  }

  confirmarEliminacion(seguimiento: Seguimiento) {
    this.seguimientoSeleccionado = seguimiento;
    this.mostrarDialogo = true;
  }

  cerrarDialogoEliminacion() {
    this.seguimientoSeleccionado = null; // Cambiar a null para indicar que no hay seguimiento seleccionado
    this.mostrarDialogo = false;
    this.eliminarConfirmado = false;
  }

  eliminarSeguimiento() {
    if (this.seguimientoSeleccionado) {
      const idSeguimiento = this.seguimientoSeleccionado.id;
  
      this.solicitudesService.eliminarSeguimiento(idSeguimiento).subscribe(
        () => {
          this.mostrarDialogo = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Seguimiento eliminado correctamente' });
          this.obtenerSeguimientos();
        },
        (error: any) => {
          this.mostrarDialogo = false;
          console.error('Error al eliminar el seguimiento', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al eliminar el seguimiento' });
        }
      );
    }
  }
  
  buscarSeguimientos(): void {
    if (this.searchText.trim() === '') {
      this.filteredSeguimientos = this.seguimientos;
    } else {
      this.filteredSeguimientos = this.seguimientos.filter((seguimiento) => {
        const tituloArticuloMatch = this.getSolicitudNombre(seguimiento.solicitudId).toLowerCase().includes(this.searchText.toLowerCase());
        const responsableMatch = this.getResponsableNombre(seguimiento.responsableId).toLowerCase().includes(this.searchText.toLowerCase());

        return tituloArticuloMatch || responsableMatch;
      });
    }
  }

  obtenerNombreArchivo(url: string): string {
    const partesURL = url.split('/');
    return partesURL[partesURL.length - 1]; // El último segmento es el nombre del archivo
  }

  
  abrirCorreciones(correcionesUrl: string) {
    window.open(correcionesUrl, '_blank'); // Abre en una nueva pestaña
  }

  abrirFormato(formatoUrl: string) {
    window.open(formatoUrl, '_blank'); // Abre en una nueva pestaña
  }

}
