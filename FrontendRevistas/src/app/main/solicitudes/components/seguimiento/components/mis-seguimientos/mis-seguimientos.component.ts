import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seguimiento, Pasos, Solicitud, Estado } from 'src/app/models/solicitudes';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mis-seguimientos',
  templateUrl: './mis-seguimientos.component.html',
  styleUrls: ['./mis-seguimientos.component.css']
})
export class MisSeguimientosComponent implements OnInit {
  API_URI = environment.API_URI;
  seguimientoSeleccionado: any;
  solicitudes: Solicitud[] = [];
  pasos: Pasos[] = [];
  estados: Estado[] = [];
  seguimientos: Seguimiento[] = [];
  seguimiento: Seguimiento | undefined;
  DialogoCorreciones: boolean = false;
  usuarioId: number | undefined;
  totalPasos: number = 5;
  correcciones: any[] = [];
  revisionEvaluador1Seguimientos: any[] = [];
  revisionEvaluador2Seguimientos: any[] = [];

  constructor(
    private solicitudesService: SolicitudesService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.usuarioId = this.authService.getUserId();
    if (this.usuarioId !== undefined) {
      this.cargarSeguimientosUsuario(this.usuarioId);
    } else {
      console.error('El usuario no tiene un ID válido.');
    }
    this.obtenerPasos();
    this.obtenerEstados();
    this.obtenerSolicitudes();
  }

  mostrarDialogoCorreciones(seguimiento: Seguimiento): void {
    this.cargarResultados(seguimiento)
    this.seguimiento = seguimiento; // Asigna el seguimiento seleccionado
    this.DialogoCorreciones = true;
  }
  
  cerrarDialogoCorreciones() {
    this.DialogoCorreciones = false;
  }

  cargarSeguimientosUsuario(usuarioId: number): void {
    // Obtener las autorizaciones del usuario desde la tabla autor por solicitud
    this.solicitudesService.obtenerSolicitudesPorUsuario(usuarioId).subscribe(
      (autorSolicitudes: any[]) => {
        if (autorSolicitudes.length > 0) {
          const idsSolicitudesUsuario = autorSolicitudes.map(autorSolicitud => autorSolicitud.id);
          // Obtener todas los seguimientos disponibles
          this.solicitudesService.obtenerSeguimientos().subscribe(
            (Seguimientos: Seguimiento[]) => {
              // Ordenar los seguimientos por el nivel de paso en orden descendente
              Seguimientos.sort((a, b) => b.pasos_seguimiento - a.pasos_seguimiento);
  
              // Filtrar los seguimientos para mostrar solo las generadas por el usuario
              const seguimientosFiltrados: Seguimiento[] = [];
              idsSolicitudesUsuario.forEach(idSolicitud => {
                const seguimientosPorSolicitud = Seguimientos.filter(seguimiento => seguimiento.solicitudId === idSolicitud);
                if (seguimientosPorSolicitud.length > 0) {
                  // Inicializar la variable como undefined
                  let seguimientoConResponsable: Seguimiento | undefined = undefined;
                  // Verificar si algún seguimiento tiene un responsable
                  seguimientoConResponsable = seguimientosPorSolicitud.find(seguimiento => seguimiento.responsableId !== null);
                  if (!seguimientoConResponsable) {
                    // Si no se encuentra un seguimiento con responsable, buscar el seguimiento con el paso de nivel anterior
                    seguimientoConResponsable = seguimientosPorSolicitud.find(seguimiento => seguimiento.pasos_seguimiento === (seguimientoConResponsable?.pasos_seguimiento || 0) - 1);
                  }
                  if (seguimientoConResponsable) {
                    // Si se encuentra un seguimiento válido, agrégalo a la lista de seguimientos
                    seguimientosFiltrados.push(seguimientoConResponsable);
                  }
                }
              });
  
              this.seguimientos = seguimientosFiltrados;
            },
            (error) => {
              console.error(error);
            }
          );
        } else {
          // No hay solicitudes generadas por el usuario
          this.seguimientos = [];
        }
      },
      (error) => {
        console.error(error);
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

  obtenerEstados(): void {
    this.solicitudesService.obtenerEstados().subscribe(
      (estados: any[]) => {
        this.estados = estados;
      },
      (error: any) => {
        console.error('Error al obtener los pasos de solicitud', error);
      }
    );
  }

  obtenerSolicitudes(): void {
    this.solicitudesService.obtenerSolicitudes().subscribe(
      (solicitudes: any[]) => {
        this.solicitudes = solicitudes;
      },
      (error: any) => {
        console.error('Error al obtener las solicitudes', error);
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
    const estado = this.estados.find(p => p.id === estadoId);
    return estado ? estado.nombre : '';
  }

  getPorcentaje(pasoId: number): number {
    const pasoEncontrado = this.pasos.find(p => p.id === pasoId);
    if (pasoEncontrado) {
      const nivelNumerico = (pasoEncontrado.nivel);
      const porcentaje = (nivelNumerico / this.totalPasos) * 100;
      return parseFloat(porcentaje.toFixed(2)); // Redondea a dos decimales
    }
    return 0;
  }

  getNivelActual(pasoId: number): number {
    const pasoEncontrado = this.pasos.find(p => p.id === pasoId);
    if (pasoEncontrado) {
      return (pasoEncontrado.nivel);
    }
    return 0;
  }

  cargarResultados(seguimiento: Seguimiento) {
    this.solicitudesService.getSeguimientosBySolicitud(seguimiento.solicitudId)
      .subscribe((data: any[]) => {

        this.revisionEvaluador1Seguimientos = data.filter(seg =>
          seg.solicitudId === seguimiento.solicitudId && seg.pasos_seguimiento === 5);

        this.revisionEvaluador2Seguimientos = data.filter(seg =>
          seg.solicitudId === seguimiento.solicitudId && seg.pasos_seguimiento === 6);
      });
  }

  descargarCorrecciones(seguimientoId: number) {
    const correccionesUrl = `${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/descargar/correciones/`;
    // Redirige al usuario a la URL de descarga
    window.open(correccionesUrl, '_blank');
  }

  descargarFormato(seguimientoId: number) {
    const formatoUrl =`${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/descargar/formato_evaluacion/`;
    // Redirige al usuario a la URL de descarga
    window.open(formatoUrl, '_blank');
  }

  esPendiente(estadoId: number): boolean {
    const estado = this.estados.find(p => p.id === estadoId);
    return estado ? estado.nombre.toLowerCase() === 'pendiente' : false;
  }

}