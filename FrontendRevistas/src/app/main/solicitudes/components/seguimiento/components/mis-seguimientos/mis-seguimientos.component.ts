import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Seguimiento, Pasos, Solicitud, Estado } from 'src/app/models/solicitudes';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mis-seguimientos',
  templateUrl: './mis-seguimientos.component.html',
  styleUrls: ['./mis-seguimientos.component.css']
})
export class MisSeguimientosComponent implements OnInit {
  API_URI = environment.API_URI;

  solicitudes: Solicitud[] = [];
  pasos: Pasos[] = [];
  estados: Estado[] = [];
  seguimientos: Seguimiento[] = [];

  seguimientoSeleccionado: Seguimiento | null = null;
  DialogoCorreciones = false;
  usuarioId: number | undefined;

  cargandoVista = true;
  cargandoResultados = false;

  revisionEvaluador1Seguimientos: Seguimiento[] = [];
  revisionEvaluador2Seguimientos: Seguimiento[] = [];

  constructor(
    private solicitudesService: SolicitudesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.usuarioId = this.authService.getUserId();

    if (this.usuarioId === undefined) {
      console.error('El usuario no tiene un ID válido.');
      this.cargandoVista = false;
      return;
    }

    this.cargarDatosIniciales(this.usuarioId);
  }

  get totalSolicitudes(): number {
    return this.seguimientos.length;
  }

  get totalPasos(): number {
    if (!this.pasos || this.pasos.length === 0) {
      return 1;
    }

    return Math.max(...this.pasos.map((p) => Number(p.nivel) || 0), 1);
  }

  get progresoPromedio(): number {
    if (!this.seguimientos.length) return 0;
    const total = this.seguimientos.reduce(
      (acc, item) => acc + this.getPorcentaje(item.pasos_seguimiento),
      0
    );
    return Math.round(total / this.seguimientos.length);
  }

  get solicitudesConResultado(): number {
    return this.seguimientos.filter((item) => !this.esPendiente(item.estado_seguimiento)).length;
  }

  cargarDatosIniciales(usuarioId: number): void {
    this.cargandoVista = true;

    forkJoin({
      misSolicitudes: this.solicitudesService.obtenerSolicitudesPorUsuario(usuarioId),
      seguimientos: this.solicitudesService.obtenerSeguimientos(),
      pasos: this.solicitudesService.obtenerPasos(),
      estados: this.solicitudesService.obtenerEstados(),
      solicitudes: this.solicitudesService.obtenerSolicitudes()
    }).subscribe({
      next: ({
        misSolicitudes,
        seguimientos,
        pasos,
        estados,
        solicitudes
      }: {
        misSolicitudes: any[];
        seguimientos: Seguimiento[];
        pasos: Pasos[];
        estados: Estado[];
        solicitudes: Solicitud[];
      }) => {
        this.pasos = pasos || [];
        this.estados = estados || [];
        this.solicitudes = solicitudes || [];

        const idsSolicitudesUsuario = (misSolicitudes || []).map((item: any) => item.id);
        const seguimientosFiltrados: Seguimiento[] = [];

        idsSolicitudesUsuario.forEach((idSolicitud: number) => {
          const seguimientosPorSolicitud = (seguimientos || []).filter(
            (seg: Seguimiento) => seg.solicitudId === idSolicitud
          );

          if (!seguimientosPorSolicitud.length) return;

          const seguimientosConResponsable = seguimientosPorSolicitud.filter(
            (seg: Seguimiento) =>
              seg.responsableId !== null &&
              seg.responsableId !== undefined
          );

          const listaBase =
            seguimientosConResponsable.length > 0
              ? seguimientosConResponsable
              : seguimientosPorSolicitud;

          const seguimientoVisible = [...listaBase].sort(
            (a: Seguimiento, b: Seguimiento) => {
              const nivelA = this.getNivelActual(a.pasos_seguimiento);
              const nivelB = this.getNivelActual(b.pasos_seguimiento);

              if (nivelB !== nivelA) {
                return nivelB - nivelA;
              }

              const fechaA = a.fecha_asignacion ? new Date(a.fecha_asignacion).getTime() : 0;
              const fechaB = b.fecha_asignacion ? new Date(b.fecha_asignacion).getTime() : 0;

              return fechaB - fechaA;
            }
          )[0];

          if (seguimientoVisible) {
            seguimientosFiltrados.push(seguimientoVisible);
          }
        });

        this.seguimientos = seguimientosFiltrados.sort((a: Seguimiento, b: Seguimiento) => {
          const fechaA = a.fecha_asignacion ? new Date(a.fecha_asignacion).getTime() : 0;
          const fechaB = b.fecha_asignacion ? new Date(b.fecha_asignacion).getTime() : 0;
          return fechaB - fechaA;
        });

        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar los seguimientos del usuario:', error);
        this.cargandoVista = false;
      }
    });
  }

  mostrarDialogoCorreciones(seguimiento: Seguimiento): void {
    this.seguimientoSeleccionado = seguimiento;
    this.DialogoCorreciones = true;
    this.cargandoResultados = true;
    this.cargarResultados(seguimiento);
  }

  cerrarDialogoCorreciones(): void {
    this.DialogoCorreciones = false;
    this.seguimientoSeleccionado = null;
    this.revisionEvaluador1Seguimientos = [];
    this.revisionEvaluador2Seguimientos = [];
  }

  getSolicitudNombre(solicitudId: number): string {
    const solicitud = this.solicitudes.find((s) => s.id === solicitudId);
    return solicitud ? solicitud.titulo_articulo : 'Solicitud no encontrada';
  }

  getPasoNombre(pasoId: number): string {
    const paso = this.pasos.find((p) => p.id === pasoId);
    return paso ? paso.nombre : 'Paso no encontrado';
  }

  getEstadoNombre(estadoId: number): string {
    const estado = this.estados.find((e) => e.id === estadoId);
    return estado ? estado.nombre : 'Estado no encontrado';
  }

  getPorcentaje(pasoId: number): number {
    const pasoEncontrado = this.pasos.find((p) => p.id === pasoId);

    if (!pasoEncontrado) {
      return 0;
    }

    const nivelNumerico = Number(pasoEncontrado.nivel) || 0;
    const porcentaje = (nivelNumerico / this.totalPasos) * 100;

    return Math.round(porcentaje);
  }

  getNivelActual(pasoId: number): number {
    const pasoEncontrado = this.pasos.find((p) => p.id === pasoId);
    return pasoEncontrado ? Number(pasoEncontrado.nivel) || 0 : 0;
  }

  getEstadoClase(estadoId: number): string {
    const nombre = this.getEstadoNombre(estadoId).toLowerCase();

    if (nombre.includes('pendiente')) return 'status-pending';
    if (nombre.includes('acept') || nombre.includes('aprob')) return 'status-success';
    if (nombre.includes('rechaz')) return 'status-danger';
    if (nombre.includes('corre') || nombre.includes('ajuste')) return 'status-warning';

    return 'status-neutral';
  }

  getPasoClase(pasoId: number): string {
    const porcentaje = this.getPorcentaje(pasoId);

    if (porcentaje >= 100) return 'progress-complete';
    if (porcentaje >= 60) return 'progress-advanced';
    if (porcentaje >= 30) return 'progress-medium';
    return 'progress-initial';
  }

  cargarResultados(seguimiento: Seguimiento): void {
    this.solicitudesService.getSeguimientosBySolicitud(seguimiento.solicitudId).subscribe({
      next: (data: Seguimiento[]) => {
        this.revisionEvaluador1Seguimientos = data.filter(
          (seg: Seguimiento) =>
            seg.solicitudId === seguimiento.solicitudId &&
            seg.pasos_seguimiento === 5
        );

        this.revisionEvaluador2Seguimientos = data.filter(
          (seg: Seguimiento) =>
            seg.solicitudId === seguimiento.solicitudId &&
            seg.pasos_seguimiento === 6
        );

        this.cargandoResultados = false;
      },
      error: (error) => {
        console.error('Error al cargar resultados de evaluadores:', error);
        this.revisionEvaluador1Seguimientos = [];
        this.revisionEvaluador2Seguimientos = [];
        this.cargandoResultados = false;
      }
    });
  }

  descargarCorrecciones(seguimientoId: number): void {
    const correccionesUrl = `${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/descargar/correciones/`;
    window.open(correccionesUrl, '_blank');
  }

  descargarFormato(seguimientoId: number): void {
    const formatoUrl = `${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/descargar/formato_evaluacion/`;
    window.open(formatoUrl, '_blank');
  }

  esPendiente(estadoId: number): boolean {
    const estado = this.estados.find((e) => e.id === estadoId);
    return estado ? estado.nombre.toLowerCase() === 'pendiente' : false;
  }

  tieneCorrecciones(seguimiento: any): boolean {
    return !!seguimiento?.correciones;
  }

  tieneFormato(seguimiento: any): boolean {
    return !!seguimiento?.formato_evaluacion;
  }
}