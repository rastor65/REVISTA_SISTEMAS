import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Seguimiento, Pasos, Solicitud, Estado } from 'src/app/models/solicitudes';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { environment } from 'src/environments/environment';

interface GroupedSeguimientos {
  [key: number]: Seguimiento[];
}

interface RecentSeguimiento {
  [key: number]: Seguimiento;
}

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  API_URI = environment.API_URI;

  seguimientoSeleccionado: any;

  solicitudes: Solicitud[] = [];
  pasos: Pasos[] = [];
  seguimientos: Seguimiento[] = [];
  estados: Estado[] = [];
  responsables: any[] = [];

  mostrarDialogo: boolean = false;
  searchText: string = '';
  expandedCard: number | null = null;

  totalPasos: number = 7;

  filteredSeguimientos: Seguimiento[] = [];
  groupedSeguimientos: GroupedSeguimientos = {};
  recentSeguimientos: RecentSeguimiento = {};

  displayEditar: boolean = false;
  displayEliminar: boolean = false;
  seguimientoForm: FormGroup;

  correccionesFile: File | null = null;
  FormatoFile: File | null = null;
  archivoSeleccionadoCorreciones: string = '';
  archivoSeleccionadoFormato: string = '';

  // Flags de rol (calculados con TODOS los roles)
  isEditorJefe = false;
  isAsistenteEditorial = false;

  // opcional: para debug
  roleNamesUser: string[] = [];

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {
    this.seguimientoForm = this.formBuilder.group({
      fecha_asignacion: [''],
      fecha_programacion: [''],
      fecha_evaluacion: [''],
      correciones: [''],
      formato_evaluacion: [''],
      solicitudId: [''],
      pasos_seguimiento: [''],
      estado_seguimiento: [''],
      responsableId: [''],
    });
  }

  ngOnInit() {
    // Carga datos
    this.obtenerResponsables();
    this.obtenerPasos();
    this.obtenerSolicitudes();
    this.obtenerEstados();
    this.obtenerSeguimientos();

    this.userService.getMyRoleFlagsFast().subscribe({
      next: ({ roleNamesUser, user, isEditorJefe, isAsistenteEditorial }) => {
        this.roleNamesUser = roleNamesUser || [];
        this.isEditorJefe = !!isEditorJefe;
        this.isAsistenteEditorial = !!isAsistenteEditorial;

        console.log('[FLAGS]', {
          username: user?.username,
          roleNamesUser: this.roleNamesUser,
          isEditorJefe: this.isEditorJefe,
          isAsistenteEditorial: this.isAsistenteEditorial
        });

        this.groupSeguimientos();
      },
      error: (err) => {
        console.error('No se pudieron obtener roles del usuario (fast):', err);
        this.isEditorJefe = false;
        this.isAsistenteEditorial = false;
      }
    });

  }

  // ✅ Regla de visibilidad: si es asistente, VE TODO (aunque también sea editor jefe).
  // El filtro "solo visto bueno" aplica únicamente al editor jefe que NO es asistente.
  canSeeSolicitud(solicitudId: number): boolean {
    if (this.isAsistenteEditorial) return true;
    if (!this.isEditorJefe) return true;
    return this.getSolicitudVistoBueno(solicitudId);
  }

  private toTime(val: any): number {
    const t = Date.parse(val);
    return Number.isNaN(t) ? 0 : t;
  }

  getAccordionHeaderClass(solicitudId: number): string {
    return 'custom-accordion-header';
  }

  obtenerSeguimientos() {
    this.solicitudesService.obtenerSeguimientos().subscribe({
      next: (data) => {
        this.seguimientos = data || [];
        this.buscarSeguimientos(); // ✅ filtra + agrupa con data real
      },
      error: (err) => {
        console.error('Error al obtener seguimientos:', err);
        this.seguimientos = [];
        this.filteredSeguimientos = [];
        this.groupedSeguimientos = {};
        this.recentSeguimientos = {};
      }
    });
  }

  obtenerPasos(): void {
    this.solicitudesService.obtenerPasos().subscribe(
      (pasos: any[]) => {
        this.pasos = pasos || [];
      },
      (error: any) => {
        console.error('Error al obtener los pasos de solicitud', error);
      }
    );
  }

  obtenerSolicitudes(): void {
    this.solicitudesService.obtenerSolicitudes().subscribe(
      (solicitudes: any[]) => {
        this.solicitudes = solicitudes || [];
        // ✅ por si el usuario escribe búsqueda por título antes de que lleguen solicitudes
        this.buscarSeguimientos();
      },
      (error: any) => {
        console.error('Error al obtener las solicitudes', error);
      }
    );
  }

  obtenerEstados(): void {
    this.solicitudesService.obtenerEstados().subscribe(
      (estados: any[]) => {
        this.estados = estados || [];
      },
      (error: any) => {
        console.error('Error al obtener los estados', error);
      }
    );
  }

  obtenerResponsables(): void {
    this.userService.ObtenerUsuarios().subscribe(
      response => {
        this.responsables = response || [];
        this.buscarSeguimientos();
      },
      error => {
        console.error('Error al obtener los responsables:', error);
      }
    );
  }

  getSolicitudNombre(solicitudId: number): string {
    const solicitud = this.solicitudes.find(s => s.id === solicitudId);
    return solicitud ? solicitud.titulo_articulo : '';
  }

  getSolicitudVistoBueno(solicitudId: number): boolean {
    const solicitud = this.solicitudes.find(s => s.id === solicitudId);
    return solicitud ? !!solicitud.visto_bueno : false;
  }

  getPasoNombre(pasoId?: number): string {
    if (pasoId === undefined || pasoId === null) return 'No disponible';
    const paso = this.pasos.find(p => p.id === pasoId);
    return paso ? paso.nombre : 'No disponible';
  }

  getPorcentaje(pasoId: number): number {
    const pasoEncontrado = this.pasos.find(p => p.id === pasoId);
    if (pasoEncontrado) {
      const nivelNumerico = Number(pasoEncontrado.nivel) || 0;
      const porcentaje = (nivelNumerico / this.totalPasos) * 100;
      return parseFloat(porcentaje.toFixed(2));
    }
    return 0;
  }

  getNivelActual(pasoId: number): number {
    const pasoEncontrado = this.pasos.find(p => p.id === pasoId);
    if (pasoEncontrado) return Number(pasoEncontrado.nivel) || 0;
    return 0;
  }

  getEstadoNombre(estadoId: number): string {
    const estado = this.estados.find(e => e.id === estadoId);
    return estado ? estado.nombre : '';
  }

  getResponsableNombre(responsableId: number): string {
    // Tu HTML usa optionValue="user", así que aquí asumes que responsableId == responsable.user
    const responsable = this.responsables.find(r => r.user === responsableId);
    return responsable ? `${responsable.nombres} ${responsable.apellidos}` : '';
  }

  obtenerNombreArchivo(rutaArchivo: string | null): string {
    if (!rutaArchivo) return '';
    const partes = rutaArchivo.split('/');
    return partes[partes.length - 1];
  }

  abrirDescarga(seguimientoId: string) {
    const correcionesUrl = `${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/descargar/correciones/`;
    window.open(correcionesUrl, '_blank');
  }

  abrirFormato(seguimientoId: string) {
    const formatoUrl = `${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/descargar/formato_evaluacion/`;
    window.open(formatoUrl, '_blank');
  }

  buscarSeguimientos(): void {
    const txt = (this.searchText || '').trim().toLowerCase();

    if (!txt) {
      this.filteredSeguimientos = [...this.seguimientos];
      this.groupSeguimientos();
      return;
    }

    this.filteredSeguimientos = (this.seguimientos || []).filter((seguimiento) => {
      const titulo = (this.getSolicitudNombre(seguimiento.solicitudId) || '').toLowerCase();
      const responsable = (this.getResponsableNombre(seguimiento.responsableId) || '').toLowerCase();
      return titulo.includes(txt) || responsable.includes(txt);
    });

    this.groupSeguimientos();
  }

  groupSeguimientos() {
    const list = [...(this.filteredSeguimientos || [])];

    // Agrupar por solicitudId
    this.groupedSeguimientos = list
      .sort((a, b) => this.toTime(a.fecha_programacion) - this.toTime(b.fecha_programacion))
      .reduce((acc: GroupedSeguimientos, seguimiento) => {
        (acc[seguimiento.solicitudId] = acc[seguimiento.solicitudId] || []).push(seguimiento);
        return acc;
      }, {});

    // Seguimiento más reciente por solicitud
    this.recentSeguimientos = Object.keys(this.groupedSeguimientos).reduce((acc: RecentSeguimiento, solicitudId: string) => {
      const arr = this.groupedSeguimientos[+solicitudId] || [];
      const sorted = [...arr].sort((a, b) => this.toTime(b.fecha_programacion) - this.toTime(a.fecha_programacion));
      if (sorted.length) acc[+solicitudId] = sorted[0];
      return acc;
    }, {});
  }

  getSortedGroupedKeys(): number[] {
    return Object.keys(this.groupedSeguimientos)
      .map(key => +key)
      .sort((a, b) => {
        const fechaA = this.groupedSeguimientos[a]?.[0]?.fecha_programacion;
        const fechaB = this.groupedSeguimientos[b]?.[0]?.fecha_programacion;
        return this.toTime(fechaA) - this.toTime(fechaB);
      });
  }

  getRowClass(seguimiento: Seguimiento, solicitudId: number): string {
    const fechaProgramacion = new Date(seguimiento.fecha_programacion);
    const hoy = new Date();

    const diferenciaDias = Math.ceil((fechaProgramacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    const diasTotal = Math.ceil((fechaProgramacion.getTime() - new Date(seguimiento.fecha_asignacion).getTime()) / (1000 * 60 * 60 * 24));
    const porcentajeDiasRestantes = diasTotal > 0 ? (diferenciaDias / diasTotal) * 100 : 0;

    const esReciente = seguimiento.id === this.recentSeguimientos[solicitudId]?.id;

    let className = '';
    if (esReciente) {
      if (diferenciaDias < 0) className = 'overdue recent-follow-up';
      else if (diferenciaDias <= 3) className = 'near-due recent-follow-up';
      else if (porcentajeDiasRestantes >= 60) className = 'plenty-of-time recent-follow-up';
    }
    return className;
  }

  toggleExpand(solicitudId: number): void {
    this.expandedCard = this.expandedCard === solicitudId ? null : solicitudId;
  }

  ShowEditarSeguimiento(seguimiento: Seguimiento): void {
    this.displayEditar = true;
    this.seguimientoSeleccionado = seguimiento;

    this.seguimientoForm.patchValue({
      fecha_asignacion: seguimiento.fecha_asignacion,
      fecha_programacion: seguimiento.fecha_programacion,
      fecha_evaluacion: seguimiento.fecha_evaluacion,
      correciones: seguimiento.correciones,
      formato_evaluacion: seguimiento.formato_evaluacion,
      solicitudId: seguimiento.solicitudId,
      pasos_seguimiento: seguimiento.pasos_seguimiento,
      estado_seguimiento: seguimiento.estado_seguimiento,
      responsableId: seguimiento.responsableId,
    });

    this.archivoSeleccionadoCorreciones = this.obtenerNombreArchivo(seguimiento.correciones);
    this.archivoSeleccionadoFormato = this.obtenerNombreArchivo(seguimiento.formato_evaluacion);
  }

  ShowEliminarSeguimiento(seguimiento: Seguimiento): void {
    this.displayEliminar = true;
    this.seguimientoSeleccionado = seguimiento;
  }

  OcultarEditarSeguimiento() {
    this.displayEditar = false;
  }

  OcultarEliminarSeguimiento() {
    this.displayEliminar = false;
  }

  EditarSeguimiento() {
    if (!this.seguimientoForm.valid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa los campos requeridos correctamente' });
      return;
    }

    const seguimientoEditado: any = {
      ...this.seguimientoSeleccionado,
      ...this.seguimientoForm.value
    };

    const pasoId = seguimientoEditado.pasos_seguimiento;
    const pasoContenido = this.obtenerContenidoPaso(pasoId);

    if (!pasoContenido) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el contenido del paso' });
      return;
    }

    const diasProgramacion = parseInt(pasoContenido.dias_programacion, 10) || 0;
    const fechaActual = new Date();
    const fechaProgramacion = new Date(fechaActual.getTime() + (diasProgramacion * 24 * 60 * 60 * 1000));

    const fechaProgramacionISO = fechaProgramacion.toISOString().split('T')[0];
    const fechaActualISO = fechaActual.toISOString().split('T')[0];

    const formData = new FormData();

    if (this.correccionesFile) formData.append('correciones', this.correccionesFile);
    if (this.FormatoFile) formData.append('formato_evaluacion', this.FormatoFile);

    formData.append('id', String(seguimientoEditado.id));
    formData.append('fecha_asignacion', fechaActualISO);
    formData.append('fecha_programacion', fechaProgramacionISO);
    formData.append('solicitudId', String(seguimientoEditado.solicitudId));
    formData.append('pasos_seguimiento', String(seguimientoEditado.pasos_seguimiento));
    formData.append('estado_seguimiento', String(seguimientoEditado.estado_seguimiento));
    formData.append('responsableId', String(seguimientoEditado.responsableId));
    formData.append('status', 'true');

    if (Number(seguimientoEditado.pasos_seguimiento) === 2) {
      formData.append('fecha_evaluacion', fechaActualISO);
    }

    this.solicitudesService.actualizarSeguimientoConArchivo(formData).subscribe({
      next: () => {
        this.mostrarDialogo = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Seguimiento actualizado correctamente' });
        this.obtenerSeguimientos();
        this.OcultarEditarSeguimiento();
      },
      error: (error: any) => {
        console.error('Error al actualizar el seguimiento:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al actualizar el seguimiento' });
      }
    });
  }

  obtenerContenidoPaso(pasoId: number): any {
    return this.pasos.find(paso => paso.id === pasoId);
  }

  onCorreccionesFileSelected(event: any) {
    this.correccionesFile = event.target.files?.[0] || null;
    this.archivoSeleccionadoCorreciones = this.correccionesFile?.name || '';
  }

  onFormatoFileSelected(event: any) {
    this.FormatoFile = event.target.files?.[0] || null;
    this.archivoSeleccionadoFormato = this.FormatoFile?.name || '';
  }

  EliminarSeguimiento() {
    if (!this.seguimientoSeleccionado) return;

    this.solicitudesService.eliminarSeguimiento(this.seguimientoSeleccionado.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Seguimiento eliminado' });
        this.OcultarEliminarSeguimiento();
        this.obtenerSeguimientos();
      },
      error: (error) => {
        console.error('Error al eliminar el seguimiento', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el seguimiento' });
      }
    });
  }

  toggleVistoBueno(solicitudId: number, checked: boolean) {
    const s = this.solicitudes.find(x => x.id === solicitudId);
    if (!s) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Solicitud no encontrada en memoria' });
      return;
    }

    const payload = { ...s, visto_bueno: checked };

    this.solicitudesService.reemplazarSolicitud(solicitudId, payload).subscribe({
      next: (data: any) => {
        s.visto_bueno = !!data?.visto_bueno;
        this.groupSeguimientos();
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: checked ? 'Visto bueno concedido' : 'Visto bueno retirado'
        });
      },
      error: (err) => {
        console.error('Error PUT visto_bueno:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el visto bueno' });
      }
    });
  }
}
