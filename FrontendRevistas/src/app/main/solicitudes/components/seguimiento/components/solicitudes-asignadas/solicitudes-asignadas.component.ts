import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { Seguimiento, Solicitud, Pasos } from 'src/app/models/solicitudes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Person } from 'src/app/models/user/person';
import { MessageService } from 'primeng/api';
import { Estado } from 'src/app/models/solicitudes';
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
  displayVerContenido: boolean = false;
  displayEditarSeguimiento: boolean = false;
  displayVerEvaluaciones: boolean = false;
  displayAcciones: boolean = false;
  displayEvaluador: boolean = false;
  pasosSolicitud: any[] = [];
  evaluaciones: any[] = [];
  correccionesFile: File | null = null;
  formatoFile: File | null = null;
  archivoSeleccionadoCorreciones: string = '';
  archivoSeleccionadoFormato: string = '';
  fileURL: SafeResourceUrl | null = null;
  originalidadURL: SafeResourceUrl | null = null;

  estados: Estado[] = [];
  responsables: any[] = [];
  revisionEvaluador1Seguimientos: any[] = [];
  revisionEvaluador2Seguimientos: any[] = [];

  selectedSeguimiento: any = {};
  selectedContenido: any;
  selectedResultado: string = '';
  descripcionEvaluacion: string = '';
  selectedResultadoEvaluacion: string = '';
  selectedSeguimientoParaEditar: any;
  selectedSeguimientoId: number | null = null;

  public readonly camposDeshabilitados: boolean = true;

  seguimientoSeleccionado: any;
  seguimientoaccion: any;
  solicitudes: Solicitud[] = [];
  solicitud: any[] = [];
  pasos: Pasos[] = [];
  seguimientoForm: FormGroup;
  seguimientos: Seguimiento[] = [];
  allSeguimientos: Seguimiento[] = [];
  usuarios: Person[] = [];

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
          console.error("Error al obtener los seguimientos");
        }
      }
    )
  }

  loadSeguimientos(): void {
    const editorId = this.authService.getUserId();
    if (editorId !== undefined) {
      this.solicitudesService.getSeguimientosPorEditor(editorId).subscribe(
        (data: any) => {
          if (data) {
            this.seguimientos = data.filter((seguimiento: any) => seguimiento.responsableId === editorId && seguimiento.pasos_seguimiento === 4);
            // Llama a la función para obtener los seguimientos únicos por solicitud
            this.seguimientos = this.obtenerSeguimientosUnicos(this.seguimientos);
          } else {
            console.error("El seguimiento no está en el formato esperado.");
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

    seguimientos.forEach(seguimiento => {
      const indiceExistente = seguimientosUnicos.findIndex(s => s.solicitudId === seguimiento.solicitudId);

      if (indiceExistente === -1) {
        // Si no se encuentra un seguimiento para esta solicitud, se agrega directamente.
        seguimientosUnicos.push(seguimiento);
      } else {
        // Si ya existe un seguimiento para esta solicitud, se compara el nivel del paso y se actualiza si es más alto.
        if (seguimiento.pasos_seguimiento > seguimientosUnicos[indiceExistente].pasos_seguimiento) {
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

  public getEstadoNombre(estadoId: number): string {
    const estado = this.estados.find(s => s.id === estadoId);
    return estado ? estado.nombre : 'Estado desconocida';
  }

  getSolicitudNombre(solicitudId: number): string {
    const solicitud = this.solicitudes.find(s => s.id === solicitudId);
    return solicitud ? solicitud.titulo_articulo : 'Solicitud desconocida';
  }

  getUsuarioNombre(usuarioId: number): string {
    const usuario = this.usuarios.find(u => u.user === usuarioId);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Evaluador desconocido';
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

  getPasoNombre(pasoId: number): string {
    const paso = this.pasos.find(u => u.id === pasoId);
    return paso ? `${paso.nombre}` : 'paso desconocido';
  }

  async mostrarDialogVerContenido(seguimiento: Seguimiento): Promise<void> {
    this.selectedSeguimiento = seguimiento;

    try {
      // Obtener la solicitud asociada al seguimiento
      const solicitudResponse = await this.solicitudesService.getSolicitud(seguimiento.solicitudId).toPromise();
      const solicitud = solicitudResponse.solicitud; // Asegúrate de que el campo sea el correcto

      // Obtener el contenido asociado a la solicitud
      this.selectedContenido = await this.solicitudesService.getContenido(solicitud.contenidoSolicitud).toPromise();
      
      this.previsualizarArchivo(this.selectedContenido.id, 'archivo_adjunto');
      this.previsualizarArchivo(this.selectedContenido.id, 'originalidad');

      this.displayVerContenido = true;

      // Forzar la detección de cambios
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error fetching data:', error);
      this.selectedContenido = null;
      this.displayVerContenido = true;
      this.cdRef.detectChanges();
    }
  }

  DescargarContenido() {
    if (this.selectedContenido && this.selectedContenido.id) {
      const contenidoId = this.selectedContenido.id;
      const url = `http://127.0.0.1:8000/solicitud/contenido/contenido/${contenidoId}/descargar/`;

      // Abre la URL en una nueva ventana o pestaña
      window.open(url, '_blank');
    }
  }

  buscarSeguimientoPorSolicitudYTipoPaso(solicitudId: number, tipoPaso: string): Seguimiento | undefined {

    const seguimientoEncontrado = this.allSeguimientos.find((seguimiento) => {
      const pasoId = seguimiento.pasos_seguimiento; // Obtener el ID del paso
      const paso = this.pasos.find((p) => p.id === pasoId); // Buscar el paso por ID

      return seguimiento.solicitudId === solicitudId && paso?.nombre === tipoPaso; // Comparar el tipo de paso
    });


    return seguimientoEncontrado;
  }

  ocultarDialogVerContenido(): void {
    this.displayVerContenido = false;
  }

  mostrarDialogAcciones(seguimiento: Seguimiento) {
    this.seguimientoaccion = seguimiento;
    this.displayAcciones = true;
  }

  ocultarDialogoAcciones() {
    this.displayAcciones = false;
  }

  mostrarDialogoEvaluador1() {
    const solicitudId = this.seguimientoaccion.solicitudId;
    const tipoPaso = 'Revisión de evaluador #1';

    const seguimiento = this.buscarSeguimientoPorSolicitudYTipoPaso(solicitudId, tipoPaso);

    if (seguimiento) {
      this.mostrarDialogEvaluador(seguimiento);
    } else {
      // Manejar el caso en el que no se encuentra el seguimiento
      console.error('No se encontró el seguimiento correspondiente al paso "Revisión de evaluadores #1".');
    }
  }

  ocultarDialogoEvaluador() {
    this.displayEvaluador = false;
  }

  mostrarDialogoEvaluador2() {
    const solicitudId = this.seguimientoaccion.solicitudId;
    const tipoPaso = 'Revisión de evaluador #2';

    const seguimiento = this.buscarSeguimientoPorSolicitudYTipoPaso(solicitudId, tipoPaso);

    if (seguimiento) {
      this.mostrarDialogEvaluador(seguimiento);
    } else {
      // Manejar el caso en el que no se encuentra el seguimiento
      console.error('No se encontró el seguimiento correspondiente al paso "Revisión de evaluadores #2".');
    }
  }

  mostrarDialogEditarSeguimiento(seguimiento: any): void {
    this.seguimientoSeleccionado = this.seguimientoaccion;
    this.displayEditarSeguimiento = true;
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
  }


  onCorreccionesFileSelected(event: any) {
    this.correccionesFile = event.target.files[0];
    this.archivoSeleccionadoCorreciones = event.target.files[0].name;
  }

  onFormatoFileSelected(event: any) {
    this.formatoFile = event.target.files[0];
    this.archivoSeleccionadoFormato = event.target.files[0].name;
  }

  editarSeguimiento() {
    if (this.seguimientoForm.valid) {
      const seguimientoEditado: any = {
        ...this.seguimientoSeleccionado,
        ...this.seguimientoForm.value
      };

      const formData = new FormData();

      // Agregar el archivo adjunto si está presente
      if (this.correccionesFile) {
        formData.append('correciones', this.correccionesFile);
      }

      if (this.formatoFile) {
        formData.append('formato_evaluacion', this.formatoFile);
      }

      const fechaActual = new Date();
      const fechaActualISO = fechaActual.toISOString().split('T')[0];

      formData.append('id', seguimientoEditado.id.toString());
      formData.append('fecha_asignacion', seguimientoEditado.fecha_asignacion);
      formData.append('fecha_programacion', seguimientoEditado.fecha_programacion);
      formData.append('fecha_evaluacion', seguimientoEditado.fecha_evaluacion);
      formData.append('solicitudId', seguimientoEditado.solicitudId.toString());
      formData.append('pasos_seguimiento', seguimientoEditado.pasos_seguimiento.toString());
      formData.append('estado_seguimiento', seguimientoEditado.estado_seguimiento.toString());
      formData.append('responsableId', seguimientoEditado.responsableId.toString());
      formData.append('status', 'true');

      // Realizar llamada al servicio para actualizar el seguimiento
      this.solicitudesService.actualizarSeguimientoConArchivo(formData).subscribe(
        (response: any) => {
          this.displayEditarSeguimiento = false;
          this.displayEvaluador = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Seguimiento actualizado correctamente' });
          // Actualizar la lista de seguimientos si es necesario
          this.loadSeguimientos();
        },
        (error: any) => {
          console.error('Error al actualizar el seguimiento:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al actualizar el seguimiento' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa los campos requeridos correctamente' });
    }
  }

  editarSeguimientoevaluador() {
    if (this.seguimientoForm.valid) {
      const seguimientoEditado: any = {
        ...this.seguimientoSeleccionado,
        ...this.seguimientoForm.value
      };

      const formData = new FormData();

      // Agregar el archivo adjunto si está presente
      if (this.correccionesFile) {
        formData.append('correciones', this.correccionesFile);
      }

      if (this.formatoFile) {
        formData.append('formato_evaluacion', this.formatoFile);
      }

      const fechaActual = new Date();
      const fechaActualISO = fechaActual.toISOString().split('T')[0];

      formData.append('id', seguimientoEditado.id.toString());
      formData.append('fecha_asignacion', seguimientoEditado.fecha_asignacion);
      formData.append('fecha_programacion', seguimientoEditado.fecha_programacion);
      formData.append('fecha_evaluacion', "");
      formData.append('solicitudId', seguimientoEditado.solicitudId.toString());
      formData.append('pasos_seguimiento', seguimientoEditado.pasos_seguimiento.toString());
      formData.append('estado_seguimiento', seguimientoEditado.estado_seguimiento.toString());
      formData.append('responsableId', seguimientoEditado.responsableId.toString());
      formData.append('status', 'true');

      // Realizar llamada al servicio para actualizar el seguimiento
      this.solicitudesService.actualizarSeguimientoConArchivo(formData).subscribe(
        (response: any) => {
          this.displayEditarSeguimiento = false;
          this.displayEvaluador = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Seguimiento actualizado correctamente' });
          // Actualizar la lista de seguimientos si es necesario
          this.loadSeguimientos();
        },
        (error: any) => {
          console.error('Error al actualizar el seguimiento:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al actualizar el seguimiento' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor completa los campos requeridos correctamente' });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  mostrarDialogVerEvaluaciones(seguimiento: Seguimiento): void {
    this.cargarResultados(seguimiento)
    this.displayVerEvaluaciones = true;
    this.selectedSeguimiento = seguimiento;
  }

  ocultarDialogVerEvaluaciones(): void {
    this.displayVerEvaluaciones = false;
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
    const formatoUrl = `${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/descargar/formato_evaluacion/`;
    // Redirige al usuario a la URL de descarga
    window.open(formatoUrl, '_blank');
  }

  esPendiente(estadoId: number): boolean {
    const estado = this.estados.find(p => p.id === estadoId);
    return estado ? estado.nombre.toLowerCase() === 'pendiente' : false;
  }


  getAutoresNombres(solicitudId: number): string {
    const solicitud = this.solicitudes.find(s => s.id === solicitudId);

    if (solicitud) {
      const autoresIds = solicitud.autores;

      if (autoresIds && autoresIds.length > 0) {
        const nombresUnicos = new Set<string>();
        for (const usuarioId of autoresIds) {
          const usuario = this.usuarios.find(u => u.user === usuarioId);
          if (usuario) {
            nombresUnicos.add(`${usuario.nombres} ${usuario.apellidos}`);
          }
        }
        return Array.from(nombresUnicos).join(', ');
      }
    }

    return 'Autores desconocidos';
  }


  descargarArchivo(id: number, tipo: 'archivo_adjunto' | 'originalidad'): void {
    this.solicitudesService.descargarArchivo(id, tipo).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tipo}_${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }

  previsualizarArchivo(id: number, tipo: 'archivo_adjunto' | 'originalidad'): void {
    this.solicitudesService.descargarArchivo(id, tipo).subscribe(blob => {
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
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }

}