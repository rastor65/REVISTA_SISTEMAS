import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Seguimiento, Pasos, Solicitud, Estado } from 'src/app/models/solicitudes';
import { Person } from 'src/app/models/user/person';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

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
  mostrarDialogo: boolean = false;
  estados: Estado[] = [];
  responsables: any[] = [];
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
  isEditorJefe = false;
  isAsistenteEditorial = false;

  ngOnInit() {
    this.obtenerResponsables();
    this.obtenerSeguimientos();
    this.obtenerPasos();
    this.obtenerSolicitudes();
    this.obtenerEstados();

    this.userService.getMyRoleFlagsFast().subscribe({
      next: ({ isEditorJefe, isAsistenteEditorial, roleNamesUser, user }) => {
        this.isEditorJefe = isEditorJefe;
        this.isAsistenteEditorial = isAsistenteEditorial;
        console.log('Usuario:', user?.username, 'Roles:', roleNamesUser);
        this.groupSeguimientos();
      },
      error: (err) => {
        console.error('No se pudieron obtener roles del usuario (fast):', err);
        this.isEditorJefe = false;
        this.isAsistenteEditorial = false;
      }
    });
  }

  getAccordionHeaderClass(solicitudId: number): string {
    return 'custom-accordion-header';
  }

  obtenerSeguimientos() {
    this.solicitudesService.obtenerSeguimientos().subscribe(data => {
      this.seguimientos = data;
      this.filteredSeguimientos = data;
      this.groupSeguimientos();
    });
    this.buscarSeguimientos();
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
      (solicitudes: any[]) => {
        this.solicitudes = solicitudes;
        console.log("solicitudes: ", this.solicitudes);
      },
      (error: any) => {
        console.error('Error al obtener las solicitudes', error);
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

  obtenerResponsables(): void {
    this.userService.ObtenerUsuarios().subscribe(
      response => {
        this.responsables = response;
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
    return solicitud ? solicitud.visto_bueno : false;
  }

  getPasoNombre(pasoId?: number): string {
    if (pasoId === undefined) {
      return 'No disponible'; // Valor por defecto si no hay pasoId
    }
    const paso = this.pasos.find(p => p.id === pasoId);
    return paso ? paso.nombre : 'No disponible';
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

  getEstadoNombre(estadoId: number): string {
    const estado = this.estados.find(e => e.id === estadoId);
    return estado ? estado.nombre : '';
  }

  getResponsableNombre(responsableId: number): string {
    const responsable = this.responsables.find(r => r.user === responsableId);
    return responsable ? `${responsable.nombres} ${responsable.apellidos}` : '';
  }

  obtenerNombreArchivo(rutaArchivo: string | null): string {
    if (rutaArchivo) {
      const partes = rutaArchivo.split('/');
      return partes[partes.length - 1]; // Devuelve el nombre del archivo
    } else {
      return ''; // O un valor por defecto que consideres apropiado
    }
  }


  abrirDescarga(seguimientoId: string) {
    const correcionesUrl = `${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/descargar/correciones/`;
    window.open(correcionesUrl, '_blank'); // Abre en una nueva pestaña
  }

  abrirFormato(seguimientoId: string) {
    const formatoUrl = `${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/descargar/formato_evaluacion/`;
    window.open(formatoUrl, '_blank'); // Abre en una nueva pestaña
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
    this.groupSeguimientos();
  }

  groupSeguimientos() {
    // Agrupa los seguimientos por solicitud
    this.groupedSeguimientos = this.filteredSeguimientos
      .sort((a, b) => new Date(a.fecha_programacion).getTime() - new Date(b.fecha_programacion).getTime()) // Ordenar por fecha de programación
      .reduce((acc: GroupedSeguimientos, seguimiento) => {
        (acc[seguimiento.solicitudId] = acc[seguimiento.solicitudId] || []).push(seguimiento);
        return acc;
      }, {});

    // Obtiene el seguimiento más reciente por solicitud
    this.recentSeguimientos = Object.keys(this.groupedSeguimientos).reduce((acc: RecentSeguimiento, solicitudId: string) => {
      const sortedSeguimientos = this.groupedSeguimientos[+solicitudId].sort((a, b) => {
        return new Date(b.fecha_programacion).getTime() - new Date(a.fecha_programacion).getTime();
      });
      acc[+solicitudId] = sortedSeguimientos[0]; // El seguimiento más reciente
      return acc;
    }, {});
  }

  getSortedGroupedKeys(): number[] {
    return Object.keys(this.groupedSeguimientos).map(key => +key)
      .sort((a, b) => {
        const fechaA = this.groupedSeguimientos[a][0]?.fecha_programacion;
        const fechaB = this.groupedSeguimientos[b][0]?.fecha_programacion;
        return new Date(fechaA).getTime() - new Date(fechaB).getTime();
      });
  }


  getGroupedKeys(): number[] {
    return Object.keys(this.groupedSeguimientos).map(key => +key);
  }

  getEncabezado(solicitudId: number): string {
    const seguimiento = this.recentSeguimientos[solicitudId];
    const nombreSolicitud = this.getSolicitudNombre(solicitudId);
    if (!seguimiento) {
      return `Solicitud ${nombreSolicitud}`; // O cualquier texto por defecto
    }
    return `${nombreSolicitud} - ${this.getPasoNombre(seguimiento.pasos_seguimiento)} - ${seguimiento.fecha_programacion}`;
  }

  getFecha(solicitudId: number): string {
    const seguimiento = this.recentSeguimientos[solicitudId];
    if (!seguimiento) {
      return 'Fecha no disponible';
    }
    const fecha = new Date(seguimiento.fecha_programacion);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }


  getRowClass(seguimiento: Seguimiento, solicitudId: number): string {

    const fechaProgramacion = new Date(seguimiento.fecha_programacion);
    const hoy = new Date();
    const diferenciaDias = Math.ceil((fechaProgramacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    const diasTotal = Math.ceil((fechaProgramacion.getTime() - new Date(seguimiento.fecha_asignacion).getTime()) / (1000 * 60 * 60 * 24));
    const porcentajeDiasRestantes = (diferenciaDias / diasTotal) * 100;

    // Solo se resalta el seguimiento más reciente y el que corresponde al paso actual
    const esReciente = seguimiento.id === this.recentSeguimientos[solicitudId]?.id;

    let className = '';

    if (esReciente) {
      if (diferenciaDias < 0) {
        className = 'overdue recent-follow-up'; // Vencido
      } else if (diferenciaDias <= 3) {
        className = 'near-due recent-follow-up'; // Cercano a la fecha
      } else if (porcentajeDiasRestantes >= 60) {
        className = 'plenty-of-time recent-follow-up'; // Más del 60% de días restantes
      }
    }

    return className;
  }

  toggleExpand(solicitudId: number): void {
    this.expandedCard = this.expandedCard === solicitudId ? null : solicitudId;
  }

  ShowEditarSeguimiento(seguimiento: Seguimiento): void {
    this.displayEditar = true;
    this.seguimientoSeleccionado = seguimiento;

    // Actualiza el formulario con los datos del seguimiento
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

    // Manejar archivos seleccionados si es necesario
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
    if (this.seguimientoForm.valid) {
      const seguimientoEditado: any = {
        ...this.seguimientoSeleccionado,
        ...this.seguimientoForm.value
      };

      const pasoId = seguimientoEditado.pasos_seguimiento;
      const pasoContenido = this.obtenerContenidoPaso(pasoId); // Función que obtiene el contenido del paso

      if (pasoContenido) {

        const diasProgramacion = parseInt(pasoContenido.dias_programacion);
        console.log("dias: ", diasProgramacion)
        const fechaActual = new Date();

        // Sumar los días de programación a la fecha actual

        const fechaProgramacion = new Date(new Date().getTime() + (diasProgramacion * 24 * 60 * 60 * 1000));
        console.log("dias progra: ", fechaProgramacion)

        const fechaProgramacionISO = fechaProgramacion.toISOString().split('T')[0];
        console.log("dias programacion: ", fechaProgramacionISO)

        const fechaActualISO = fechaActual.toISOString().split('T')[0];

        const formData = new FormData();

        // Agregar el archivo adjunto si está presente
        if (this.correccionesFile) {
          formData.append('correciones', this.correccionesFile);
        }

        if (this.FormatoFile) {
          formData.append('formato_evaluacion', this.FormatoFile);
        }

        // Agregar los otros campos al formData
        formData.append('id', seguimientoEditado.id.toString());
        formData.append('fecha_asignacion', fechaActualISO);
        formData.append('fecha_programacion', fechaProgramacionISO);
        formData.append('solicitudId', seguimientoEditado.solicitudId.toString());
        formData.append('pasos_seguimiento', seguimientoEditado.pasos_seguimiento.toString());
        formData.append('estado_seguimiento', seguimientoEditado.estado_seguimiento.toString());
        formData.append('responsableId', seguimientoEditado.responsableId.toString());
        formData.append('status', 'true');

        if (seguimientoEditado.pasos_seguimiento === 2) {
          formData.append('fecha_evaluacion', fechaActualISO);
        }

        // Realizar llamada al servicio para actualizar el seguimiento
        this.solicitudesService.actualizarSeguimientoConArchivo(formData).subscribe(
          (response: any) => {
            this.mostrarDialogo = false;
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Seguimiento actualizado correctamente' });
            this.obtenerSeguimientos();
            this.OcultarEditarSeguimiento();
          },
          (error: any) => {
            console.error('Error al actualizar el seguimiento:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al actualizar el seguimiento' });
          }
        );
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el contenido del paso' });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa los campos requeridos correctamente' });
    }
  }

  obtenerContenidoPaso(pasoId: number): any {
    return this.pasos.find(paso => paso.id === pasoId);
  }

  onCorreccionesFileSelected(event: any) {
    this.correccionesFile = event.target.files[0];
    this.archivoSeleccionadoCorreciones = event.target.files[0].name;
  }

  onFormatoFileSelected(event: any) {
    this.FormatoFile = event.target.files[0];
    this.archivoSeleccionadoFormato = event.target.files[0].name;
  }

  EliminarSeguimiento() {
    if (this.seguimientoSeleccionado) {
      this.solicitudesService.eliminarSeguimiento(this.seguimientoSeleccionado.id)
        .subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Seguimiento eliminado' });
            this.OcultarEliminarSeguimiento();
            this.obtenerSeguimientos(); // Recargar la lista de seguimientos
          },
          (error) => {
            console.error('Error al eliminar el seguimiento', error);
          }
        );
    }
  }

  toggleVistoBueno(solicitudId: number, checked: boolean) {
    const s = this.solicitudes.find(x => x.id === solicitudId);
    if (!s) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Solicitud no encontrada en memoria' });
      return;
    }

    // IMPORTANTE: arma el objeto con todos los campos que tu API espera en PUT
    const payload = {
      ...s,
      visto_bueno: checked,
      // Si tu API permite nulls, respétalos; si no, ajusta.
      // Puedes omitir campos no-required si tu serializer lo permite.
    };

    this.solicitudesService.reemplazarSolicitud(solicitudId, payload).subscribe({
      next: (data: any) => {
        s.visto_bueno = !!data?.visto_bueno; // sincroniza por si el backend devuelve el recurso
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