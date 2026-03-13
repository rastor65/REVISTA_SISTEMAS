import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { Seguimiento, Solicitud, Pasos, Estado } from 'src/app/models/solicitudes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Person } from 'src/app/models/user/person';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-solicitudes-asignadas',
  templateUrl: './solicitudes-asignadas.component.html',
  styleUrls: ['./solicitudes-asignadas.component.css']
})
export class SolicitudesAsignadasComponent implements OnInit {
  API_URI = environment.API_URI;

  editores: any[] = [];
  evaluadores: any[] = [];
  responsables: any[] = [];
  usuarios: Person[] = [];
  solicitudes: Solicitud[] = [];
  pasos: Pasos[] = [];
  estados: Estado[] = [];
  seguimientos: Seguimiento[] = [];
  allSeguimientos: Seguimiento[] = [];

  displayVerContenido = false;
  displayEditarSeguimiento = false;
  displayVerEvaluaciones = false;
  displayAcciones = false;
  displayEvaluador = false;

  selectedSeguimiento: any = null;
  seguimientoSeleccionado: any = null;
  seguimientoaccion: any = null;
  selectedContenido: any = null;

  revisionEvaluador1Seguimientos: any[] = [];
  revisionEvaluador2Seguimientos: any[] = [];

  correccionesFile: File | null = null;
  formatoFile: File | null = null;
  archivoSeleccionadoCorreciones = '';
  archivoSeleccionadoFormato = '';

  fileURL: SafeResourceUrl | null = null;
  originalidadURL: SafeResourceUrl | null = null;

  seguimientoForm: FormGroup;

  constructor(
    private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {
    this.seguimientoForm = this.formBuilder.group({
      fecha_asignacion: [''],
      fecha_programacion: [''],
      fecha_evaluacion: [''],
      correciones: [''],
      solicitudId: [''],
      pasos_seguimiento: [''],
      estado_seguimiento: [''],
      responsableId: [''],
    });
  }

  ngOnInit(): void {
    this.loadSeguimientos();
    this.obtenerSolicitudes();
    this.obtenerEditores();
    this.obtenerPasos();
    this.obtenerUsuarios();
    this.obtenerEstados();
    this.loadAllSeguimientos();
  }

  get totalAsignadas(): number {
    return this.seguimientos.length;
  }

  get totalEvaluadores(): number {
    return this.usuarios.length;
  }

  get totalPasos(): number {
    return this.pasos.length;
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

  loadAllSeguimientos(): void {
    this.solicitudesService.obtenerSeguimientos().subscribe(
      (data: any) => {
        if (data) {
          this.allSeguimientos = data;
        } else {
          console.error('Error al obtener los seguimientos');
        }
      }
    );
  }

  loadSeguimientos(): void {
    const editorId = this.authService.getUserId();

    if (editorId !== undefined) {
      this.solicitudesService.getSeguimientosPorEditor(editorId).subscribe(
        (data: any) => {
          if (data) {
            this.seguimientos = data.filter(
              (seguimiento: any) =>
                seguimiento.responsableId === editorId &&
                seguimiento.pasos_seguimiento === 4
            );

            this.seguimientos = this.obtenerSeguimientosUnicos(this.seguimientos).sort((a, b) => {
              const fechaA = a.fecha_asignacion ? new Date(a.fecha_asignacion).getTime() : 0;
              const fechaB = b.fecha_asignacion ? new Date(b.fecha_asignacion).getTime() : 0;
              return fechaB - fechaA;
            });
          } else {
            console.error('El seguimiento no está en el formato esperado.');
          }
        },
        (error) => {
          console.error('Error al cargar los seguimientos:', error);
        }
      );
    } else {
      console.error('El ID del editor es indefinido.');
    }
  }

  obtenerSeguimientosUnicos(seguimientos: Seguimiento[]): Seguimiento[] {
    const seguimientosUnicos: Seguimiento[] = [];

    seguimientos.forEach((seguimiento) => {
      const indiceExistente = seguimientosUnicos.findIndex(
        (s) => s.solicitudId === seguimiento.solicitudId
      );

      if (indiceExistente === -1) {
        seguimientosUnicos.push(seguimiento);
      } else {
        if (
          seguimiento.pasos_seguimiento >
          seguimientosUnicos[indiceExistente].pasos_seguimiento
        ) {
          seguimientosUnicos[indiceExistente] = seguimiento;
        }
      }
    });

    return seguimientosUnicos;
  }

  obtenerEditores(): void {
    this.userService.obtenerEditores().subscribe(
      (usuarios: any[]) => {
        this.editores = usuarios;
        this.evaluadores = usuarios;
      },
      (error: any) => {
        console.error('Error al obtener los editores', error);
      }
    );
  }

  obtenerUsuarios(): void {
    this.userService.ObtenerUsuarios().subscribe(
      (response: any) => {
        if (response && Array.isArray(response)) {
          this.usuarios = response;
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

  public getEstadoNombre(estadoId: number): string {
    const estado = this.estados.find((s) => s.id === estadoId);
    return estado ? estado.nombre : 'Estado desconocido';
  }

  getEstadoClase(estadoId: number): string {
    const nombre = this.getEstadoNombre(estadoId).toLowerCase();

    if (nombre.includes('pendiente')) return 'status-pending';
    if (nombre.includes('acept') || nombre.includes('aprob')) return 'status-success';
    if (nombre.includes('rechaz')) return 'status-danger';
    if (nombre.includes('corre') || nombre.includes('ajuste')) return 'status-warning';

    return 'status-neutral';
  }

  getSolicitudNombre(solicitudId: number): string {
    const solicitud = this.solicitudes.find((s) => s.id === solicitudId);
    return solicitud ? solicitud.titulo_articulo : 'Solicitud desconocida';
  }

  getUsuarioNombre(usuarioId: number): string {
    const usuario = this.usuarios.find((u) => u.user === usuarioId);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Usuario desconocido';
  }

  getPasoNombre(pasoId: number): string {
    const paso = this.pasos.find((u) => u.id === pasoId);
    return paso ? `${paso.nombre}` : 'Paso desconocido';
  }

  getAutoresNombres(solicitudId: number): string {
    const solicitud = this.solicitudes.find((s) => s.id === solicitudId);

    if (solicitud) {
      const autoresIds = solicitud.autores;

      if (autoresIds && autoresIds.length > 0) {
        const nombresUnicos = new Set<string>();

        for (const usuarioId of autoresIds) {
          const usuario = this.usuarios.find((u) => u.user === usuarioId);
          if (usuario) {
            nombresUnicos.add(`${usuario.nombres} ${usuario.apellidos}`);
          }
        }

        return Array.from(nombresUnicos).join(', ');
      }
    }

    return 'Autores desconocidos';
  }

  limpiarArchivos(): void {
    this.correccionesFile = null;
    this.formatoFile = null;
    this.archivoSeleccionadoCorreciones = '';
    this.archivoSeleccionadoFormato = '';
  }

  async mostrarDialogVerContenido(seguimiento: Seguimiento): Promise<void> {
    this.selectedSeguimiento = seguimiento;
    this.selectedContenido = null;
    this.fileURL = null;
    this.originalidadURL = null;

    try {
      const solicitudResponse = await this.solicitudesService.getSolicitud(seguimiento.solicitudId).toPromise();
      const solicitud = (solicitudResponse as any).solicitud;

      this.selectedContenido = await this.solicitudesService.getContenido(solicitud.contenidoSolicitud).toPromise();

      this.previsualizarArchivo(this.selectedContenido.id, 'archivo_adjunto');
      this.previsualizarArchivo(this.selectedContenido.id, 'originalidad');

      this.displayVerContenido = true;
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error fetching data:', error);
      this.selectedContenido = null;
      this.displayVerContenido = true;
      this.cdRef.detectChanges();
    }
  }

  ocultarDialogVerContenido(): void {
    this.displayVerContenido = false;
    this.selectedContenido = null;
    this.fileURL = null;
    this.originalidadURL = null;
  }

  mostrarDialogAcciones(seguimiento: Seguimiento): void {
    this.seguimientoaccion = seguimiento;
    this.selectedSeguimiento = seguimiento;
    this.displayAcciones = true;
  }

  ocultarDialogoAcciones(): void {
    this.displayAcciones = false;
  }

  buscarSeguimientoPorSolicitudYTipoPaso(solicitudId: number, tipoPaso: string): Seguimiento | undefined {
    const seguimientoEncontrado = this.allSeguimientos.find((seguimiento) => {
      const pasoId = seguimiento.pasos_seguimiento;
      const paso = this.pasos.find((p) => p.id === pasoId);

      return seguimiento.solicitudId === solicitudId && paso?.nombre === tipoPaso;
    });

    return seguimientoEncontrado;
  }

  mostrarDialogoEvaluador1(): void {
    const solicitudId = this.seguimientoaccion.solicitudId;
    const tipoPaso = 'Revisión de evaluador #1';

    const seguimiento = this.buscarSeguimientoPorSolicitudYTipoPaso(solicitudId, tipoPaso);

    if (seguimiento) {
      this.mostrarDialogEvaluador(seguimiento);
    } else {
      console.error('No se encontró el seguimiento correspondiente al paso "Revisión de evaluador #1".');
    }
  }

  mostrarDialogoEvaluador2(): void {
    const solicitudId = this.seguimientoaccion.solicitudId;
    const tipoPaso = 'Revisión de evaluador #2';

    const seguimiento = this.buscarSeguimientoPorSolicitudYTipoPaso(solicitudId, tipoPaso);

    if (seguimiento) {
      this.mostrarDialogEvaluador(seguimiento);
    } else {
      console.error('No se encontró el seguimiento correspondiente al paso "Revisión de evaluador #2".');
    }
  }

  mostrarDialogEditarSeguimiento(): void {
    this.seguimientoSeleccionado = this.seguimientoaccion;
    this.displayEditarSeguimiento = true;
    this.displayAcciones = false;
    this.limpiarArchivos();

    const fechaHoy = new Date().toISOString().split('T')[0];

    this.seguimientoForm.patchValue({
      fecha_asignacion: this.seguimientoSeleccionado.fecha_asignacion,
      fecha_programacion: this.seguimientoSeleccionado.fecha_programacion,
      fecha_evaluacion: fechaHoy,
      correciones: this.seguimientoSeleccionado.correciones,
      solicitudId: this.seguimientoSeleccionado.solicitudId,
      pasos_seguimiento: this.seguimientoSeleccionado.pasos_seguimiento,
      estado_seguimiento: this.seguimientoSeleccionado.estado_seguimiento,
      responsableId: this.seguimientoSeleccionado.responsableId,
    });
  }

  mostrarDialogEvaluador(seguimiento: any): void {
    this.seguimientoSeleccionado = seguimiento;
    this.displayEvaluador = true;
    this.displayAcciones = false;

    const fechaHoy = new Date().toISOString().split('T')[0];
    const diasProgramacion = this.obtenerDiasProgramacion(this.seguimientoSeleccionado.pasos_seguimiento);
    const fechaProgramacion = new Date();
    fechaProgramacion.setDate(fechaProgramacion.getDate() + diasProgramacion);
    const fechaProgramacionFormateada = fechaProgramacion.toISOString().split('T')[0];

    this.seguimientoForm.patchValue({
      fecha_asignacion: fechaHoy,
      fecha_programacion: fechaProgramacionFormateada,
      correciones: this.seguimientoSeleccionado.correciones,
      solicitudId: this.seguimientoSeleccionado.solicitudId,
      pasos_seguimiento: this.seguimientoSeleccionado.pasos_seguimiento,
      estado_seguimiento: this.seguimientoSeleccionado.estado_seguimiento,
      responsableId: this.seguimientoSeleccionado.responsableId,
    });
  }

  obtenerDiasProgramacion(pasoId: number): number {
    const paso = this.pasos.find((p) => p.id === pasoId);
    if (paso && paso.dias_programacion) {
      return parseInt(paso.dias_programacion, 10);
    }
    return 0;
  }

  ocultarDialogEditarSeguimiento(): void {
    this.displayEditarSeguimiento = false;
    this.limpiarArchivos();
  }

  ocultarDialogoEvaluador(): void {
    this.displayEvaluador = false;
  }

  onCorreccionesFileSelected(event: any): void {
    const file = event?.target?.files?.[0];
    if (file) {
      this.correccionesFile = file;
      this.archivoSeleccionadoCorreciones = file.name;
    }
  }

  onFormatoFileSelected(event: any): void {
    const file = event?.target?.files?.[0];
    if (file) {
      this.formatoFile = file;
      this.archivoSeleccionadoFormato = file.name;
    }
  }

  editarSeguimiento(): void {
    if (this.seguimientoForm.valid) {
      const seguimientoEditado: any = {
        ...this.seguimientoSeleccionado,
        ...this.seguimientoForm.value
      };

      const formData = new FormData();

      if (this.correccionesFile) {
        formData.append('correciones', this.correccionesFile);
      }

      if (this.formatoFile) {
        formData.append('formato_evaluacion', this.formatoFile);
      }

      formData.append('id', seguimientoEditado.id.toString());
      formData.append('fecha_asignacion', seguimientoEditado.fecha_asignacion);
      formData.append('fecha_programacion', seguimientoEditado.fecha_programacion);
      formData.append('fecha_evaluacion', seguimientoEditado.fecha_evaluacion);
      formData.append('solicitudId', seguimientoEditado.solicitudId.toString());
      formData.append('pasos_seguimiento', seguimientoEditado.pasos_seguimiento.toString());
      formData.append('estado_seguimiento', seguimientoEditado.estado_seguimiento.toString());
      formData.append('responsableId', seguimientoEditado.responsableId.toString());
      formData.append('status', 'true');

      this.solicitudesService.actualizarSeguimientoConArchivo(formData).subscribe(
        () => {
          this.displayEditarSeguimiento = false;
          this.displayEvaluador = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Seguimiento actualizado correctamente'
          });
          this.loadSeguimientos();
        },
        (error: any) => {
          console.error('Error al actualizar el seguimiento:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al actualizar el seguimiento'
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa los campos requeridos correctamente'
      });
    }
  }

  editarSeguimientoevaluador(): void {
    if (this.seguimientoForm.valid) {
      const seguimientoEditado: any = {
        ...this.seguimientoSeleccionado,
        ...this.seguimientoForm.value
      };

      const formData = new FormData();

      if (this.correccionesFile) {
        formData.append('correciones', this.correccionesFile);
      }

      if (this.formatoFile) {
        formData.append('formato_evaluacion', this.formatoFile);
      }

      formData.append('id', seguimientoEditado.id.toString());
      formData.append('fecha_asignacion', seguimientoEditado.fecha_asignacion);
      formData.append('fecha_programacion', seguimientoEditado.fecha_programacion);
      formData.append('fecha_evaluacion', '');
      formData.append('solicitudId', seguimientoEditado.solicitudId.toString());
      formData.append('pasos_seguimiento', seguimientoEditado.pasos_seguimiento.toString());
      formData.append('estado_seguimiento', seguimientoEditado.estado_seguimiento.toString());
      formData.append('responsableId', seguimientoEditado.responsableId.toString());
      formData.append('status', 'true');

      this.solicitudesService.actualizarSeguimientoConArchivo(formData).subscribe(
        () => {
          this.displayEditarSeguimiento = false;
          this.displayEvaluador = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Seguimiento actualizado correctamente'
          });
          this.loadSeguimientos();
        },
        (error: any) => {
          console.error('Error al actualizar el seguimiento:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al actualizar el seguimiento'
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa los campos requeridos correctamente'
      });
    }
  }

  mostrarDialogVerEvaluaciones(seguimiento: Seguimiento): void {
    this.selectedSeguimiento = seguimiento;
    this.cargarResultados(seguimiento);
    this.displayVerEvaluaciones = true;
  }

  ocultarDialogVerEvaluaciones(): void {
    this.displayVerEvaluaciones = false;
  }

  cargarResultados(seguimiento: Seguimiento): void {
    this.solicitudesService.getSeguimientosBySolicitud(seguimiento.solicitudId)
      .subscribe((data: any[]) => {
        this.revisionEvaluador1Seguimientos = data.filter(
          (seg) => seg.solicitudId === seguimiento.solicitudId && seg.pasos_seguimiento === 5
        );

        this.revisionEvaluador2Seguimientos = data.filter(
          (seg) => seg.solicitudId === seguimiento.solicitudId && seg.pasos_seguimiento === 6
        );
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
    const estado = this.estados.find((p) => p.id === estadoId);
    return estado ? estado.nombre.toLowerCase() === 'pendiente' : false;
  }

  tieneCorrecciones(seguimiento: any): boolean {
    return !!seguimiento?.correciones;
  }

  tieneFormato(seguimiento: any): boolean {
    return !!seguimiento?.formato_evaluacion;
  }

  descargarArchivo(id: number, tipo: 'archivo_adjunto' | 'originalidad'): void {
    this.solicitudesService.descargarArchivo(id, tipo).subscribe(
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
      }
    );
  }

  previsualizarArchivo(id: number, tipo: 'archivo_adjunto' | 'originalidad'): void {
    this.solicitudesService.descargarArchivo(id, tipo).subscribe(
      (blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
          if (tipo === 'archivo_adjunto') {
            this.fileURL = safeUrl;
          } else if (tipo === 'originalidad') {
            this.originalidadURL = safeUrl;
          }
        };
        reader.readAsDataURL(blob);
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }
}