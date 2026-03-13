import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Seguimiento, Solicitud, Pasos, Estado } from 'src/app/models/solicitudes';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

export interface Contenido {
  id: number;
  resumen: string;
  resumenCorrecto: boolean;
  palabras_claves: string;
  palabrasClavesCorrecto: boolean;
  abstract: string;
  abstractCorrecto: boolean;
  Keywords: string;
  keywordsCorrecto: boolean;
  introduccion: string;
  introduccionCorrecto: boolean;
  materi_metodos: string;
  materiMetodosCorrecto: boolean;
  result_discu: string;
  resultDiscuCorrecto: boolean;
  agradecimientos: string;
  agradecimientosCorrecto: boolean;
  literact_citada: string;
  literactCitadaCorrecto: boolean;
  observacionGeneral: string;
}

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  API_URI = environment.API_URI;

  seguimientos: Seguimiento[] = [];
  usuarios: any[] = [];
  solicitudes: Solicitud[] = [];
  pasos: Pasos[] = [];
  estados: Estado[] = [];

  displayDialog = false;
  selectedSeguimiento: Seguimiento | null = null;
  selectedContenido: any = null;

  descripcionEvaluacion = '';
  usuarioLogueadoId: number | null = null;

  selectedFileCorreciones: File | null = null;
  selectedFileFormato: File | null = null;
  archivoSeleccionadoCorreciones = '';
  archivoSeleccionadoFormato = '';

  cargandoVista = true;
  cargandoDialogo = false;
  guardandoEvaluacion = false;

  constructor(
    private solicitudService: SolicitudesService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const loggedUser = this.authService.getUserId();
    if (loggedUser != null) {
      this.usuarioLogueadoId = loggedUser;
    }

    this.cargarVista();
  }

  get evaluacionesPendientes(): Seguimiento[] {
    return this.seguimientos.filter(
      (seguimiento) =>
        seguimiento.estado_seguimiento === 1 &&
        this.seguimientoEnPaso(seguimiento.pasos_seguimiento)
    );
  }

  get totalPendientes(): number {
    return this.evaluacionesPendientes.length;
  }

  get totalSolicitudes(): number {
    return this.solicitudes.length;
  }

  get totalArticulosAsignados(): number {
    return this.seguimientos.length;
  }

  get puedeGuardarEvaluacion(): boolean {
  return !!(
    this.selectedSeguimiento &&
    this.selectedSeguimiento.estado_seguimiento &&
    this.selectedFileFormato
  );
}

  async cargarVista(): Promise<void> {
    this.cargandoVista = true;

    try {
      await Promise.all([
        this.obtenerUsuarios(),
        this.obtenerEstados(),
        this.obtenerPasos(),
        this.obtenerSeguimientosYSolicitudes()
      ]);
    } catch (error) {
      console.error('Error al cargar la vista de evaluación:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No fue posible cargar la información de las evaluaciones.'
      });
    } finally {
      this.cargandoVista = false;
    }
  }

  async obtenerSeguimientosYSolicitudes(): Promise<void> {
    if (!this.usuarioLogueadoId) {
      return;
    }

    const data = await firstValueFrom(this.solicitudService.getSeguimientos());
    this.seguimientos = data.filter(
      (seguimiento: Seguimiento) => seguimiento.responsableId === this.usuarioLogueadoId
    );

    this.solicitudes = await firstValueFrom(this.solicitudService.getSolicitudes());
  }

  async obtenerPasos(): Promise<void> {
    this.pasos = await firstValueFrom(this.solicitudService.obtenerPasos());
  }

  async obtenerEstados(): Promise<void> {
    this.estados = await firstValueFrom(this.solicitudService.obtenerEstados());
  }

  async obtenerUsuarios(): Promise<void> {
    const response = await firstValueFrom(this.userService.ObtenerUsuarios());
    if (response && Array.isArray(response)) {
      this.usuarios = response;
    } else {
      this.usuarios = [];
    }
  }

  getUsuarioNombre(usuarioId: number): string {
    const usuario = this.usuarios.find((u) => u.user === usuarioId);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Evaluador desconocido';
  }

  getTituloSolicitud(solicitudId: number): string {
    const solicitud = this.solicitudes.find((item) => item.id === solicitudId);
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

  getSolicitudFechaMaxima(solicitud: Seguimiento): string {
    return solicitud.fecha_programacion || '';
  }

  getEstadoClase(estadoId: number): string {
    const nombre = this.getEstadoNombre(estadoId).toLowerCase();

    if (nombre.includes('pendiente')) return 'status-pending';
    if (nombre.includes('aprob') || nombre.includes('acept')) return 'status-success';
    if (nombre.includes('rechaz')) return 'status-danger';
    return 'status-neutral';
  }

  seguimientoEnPaso(paso: number): boolean {
    const pasosNivel4 = this.pasos.filter((p) => p.nivel === 4);
    return pasosNivel4.some((p) => p.id === paso);
  }

  async showDialog(seguimiento: Seguimiento): Promise<void> {
    this.selectedSeguimiento = { ...seguimiento };
    this.cargandoDialogo = true;
    this.displayDialog = true;

    const fechaActual = new Date();
    const fechaActualISO = fechaActual.toISOString().split('T')[0];
    this.selectedSeguimiento.fecha_evaluacion = fechaActualISO;

    this.selectedFileCorreciones = null;
    this.selectedFileFormato = null;
    this.archivoSeleccionadoCorreciones = '';
    this.archivoSeleccionadoFormato = '';
    this.descripcionEvaluacion = '';

    try {
      const solicitudResponse: any = await firstValueFrom(
        this.solicitudService.getSolicitud(seguimiento.solicitudId)
      );

      const solicitud = solicitudResponse.solicitud;
      this.selectedContenido = await firstValueFrom(
        this.solicitudService.getContenido(solicitud.contenidoSolicitud)
      );

      this.descripcionEvaluacion = this.selectedContenido?.observacionGeneral || '';
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error fetching data:', error);
      this.selectedContenido = null;
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No fue posible cargar completamente el contenido del artículo.'
      });
      this.cdRef.detectChanges();
    } finally {
      this.cargandoDialogo = false;
    }
  }

  hideDialog(): void {
    this.selectedSeguimiento = null;
    this.selectedContenido = null;
    this.displayDialog = false;
    this.descripcionEvaluacion = '';
    this.selectedFileCorreciones = null;
    this.selectedFileFormato = null;
    this.archivoSeleccionadoCorreciones = '';
    this.archivoSeleccionadoFormato = '';
  }

  DescargarContenido(id: number, tipo: 'archivo_adjunto' | 'originalidad'): void {
    this.solicitudService.descargarArchivo(id, tipo).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tipo}_${id}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible descargar el archivo.'
        });
      }
    );
  }

  guardarEvaluacion(): void {
    if (!this.selectedSeguimiento) {
      return;
    }

    if (!this.selectedSeguimiento.estado_seguimiento) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Debes seleccionar un estado de evaluación.'
      });
      return;
    }

    if (!(this.selectedFileFormato instanceof File)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo requerido',
        detail: 'Debes adjuntar el formato de evaluación diligenciado.'
      });
      return;
    }

    const seguimientoId = this.selectedSeguimiento.id;

    if (
      typeof this.selectedSeguimiento.pasos_seguimiento !== 'number' ||
      typeof this.selectedSeguimiento.solicitudId !== 'number'
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La información del seguimiento no es válida.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('pasos_seguimiento', this.selectedSeguimiento.pasos_seguimiento.toString());
    formData.append('solicitudId', this.selectedSeguimiento.solicitudId.toString());
    formData.append('fecha_evaluacion', this.selectedSeguimiento.fecha_evaluacion);
    formData.append('estado_seguimiento', String(this.selectedSeguimiento.estado_seguimiento));
    formData.append('formato_evaluacion', this.selectedFileFormato);
    formData.append('status', 'true');

    this.guardandoEvaluacion = true;

    this.http.put(`${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/`, formData)
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'La evaluación fue guardada exitosamente.'
          });
          this.obtenerSeguimientosYSolicitudes();
          this.hideDialog();
          this.guardandoEvaluacion = false;
        },
        (error) => {
          console.error('Error al guardar la evaluación:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible guardar la evaluación.'
          });
          this.guardandoEvaluacion = false;
        }
      );
  }

  handleFileInputCorreciones(event: any): void {
    const file = event?.target?.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo inválido',
        detail: 'El archivo de correcciones debe estar en formato PDF.'
      });
      return;
    }

    this.selectedFileCorreciones = file;
    this.archivoSeleccionadoCorreciones = file.name;
  }

  handleFileInputFormato(event: any): void {
    const file = event?.target?.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo inválido',
        detail: 'El formato de evaluación debe estar en PDF.'
      });
      return;
    }

    this.selectedFileFormato = file;
    this.archivoSeleccionadoFormato = file.name;
  }

  quitarArchivoCorrecciones(): void {
    this.selectedFileCorreciones = null;
    this.archivoSeleccionadoCorreciones = '';
  }

  quitarArchivoFormato(): void {
    this.selectedFileFormato = null;
    this.archivoSeleccionadoFormato = '';
  }
}