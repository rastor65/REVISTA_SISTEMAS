import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';

import { Solicitud, Contenido, Revistas } from 'src/app/models/solicitudes';
import { Person } from 'src/app/models/user/person';

type PreviewTipo = 'archivo_adjunto' | 'originalidad';
type ViewType = 'cards' | 'table';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent implements OnInit {
  minDate = new Date();

  usuarioId: number | undefined;
  viewType: ViewType = 'cards';

  solicitudes: Solicitud[] = [];
  filteredSolicitudes: Solicitud[] = [];
  usuarios: Person[] = [];
  seguimientos: any[] = [];
  contenidos: Contenido[] = [];
  revistas: Revistas[] = [];
  pasosSeguimiento: any[] = [];
  estadosSeguimiento: any[] = [];

  searchText = '';

  displayDialog = false;
  EditarDialog = false;

  cargandoVista = true;
  cargandoDetalle = false;
  guardandoContenido = false;

  solicitudSeleccionada: Solicitud | undefined = undefined;
  contenidoSeleccionado: Contenido = {
    id: 0,
    declaracion_originalidad: '',
    archivo_adjunto: '',
    status: true,
  };

  fileURL: SafeResourceUrl | null = null;
  originalidadURL: SafeResourceUrl | null = null;

  private fileObjectUrl: string | null = null;
  private originalidadObjectUrl: string | null = null;

  cargandoArchivoAdjunto = false;
  cargandoOriginalidad = false;

  errorArchivoAdjunto = false;
  errorOriginalidad = false;

  selectedFile: File | null = null;
  selectedFile2: File | null = null;
  archivoSeleccionado = '';
  archivoSeleccionado2 = '';

  constructor(
    private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.authService.getUserId();

    if (this.usuarioId === undefined) {
      this.cargandoVista = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No fue posible identificar el usuario autenticado.'
      });
      return;
    }

    this.cargarDatosIniciales(this.usuarioId);
  }

  get totalSolicitudes(): number {
    return this.solicitudes.length;
  }

  get totalConContenido(): number {
    return this.solicitudes.filter(s => this.hasContenido(s)).length;
  }

  get totalEditables(): number {
    return this.solicitudes.filter(s => this.debeMostrarEditar(s)).length;
  }

  get seguimientosSolicitudSeleccionada(): any[] {
    if (!this.solicitudSeleccionada?.id) {
      return [];
    }
    return this.getSeguimientosSolicitud(this.solicitudSeleccionada.id);
  }

  get solicitudSeleccionadaPuedeEditar(): boolean {
    return !!this.solicitudSeleccionada && this.debeMostrarEditar(this.solicitudSeleccionada);
  }

  toggleView(view: ViewType): void {
    this.viewType = view;
  }

  private normalizarTexto(valor: string | null | undefined): string {
    return (valor || '').toLowerCase().trim();
  }

  private ordenarSolicitudesPorFecha(data: Solicitud[]): Solicitud[] {
    return [...data].sort((a, b) => {
      const fechaA = new Date(a.fecha_creacion || '').getTime();
      const fechaB = new Date(b.fecha_creacion || '').getTime();
      return fechaB - fechaA;
    });
  }

  private resetArchivosContenido(): void {
    this.selectedFile = null;
    this.selectedFile2 = null;
    this.archivoSeleccionado = '';
    this.archivoSeleccionado2 = '';
  }

  private limpiarPreviews(): void {
    this.fileURL = null;
    this.originalidadURL = null;

    this.cargandoArchivoAdjunto = false;
    this.cargandoOriginalidad = false;

    this.errorArchivoAdjunto = false;
    this.errorOriginalidad = false;

    if (this.fileObjectUrl) {
      URL.revokeObjectURL(this.fileObjectUrl);
      this.fileObjectUrl = null;
    }

    if (this.originalidadObjectUrl) {
      URL.revokeObjectURL(this.originalidadObjectUrl);
      this.originalidadObjectUrl = null;
    }
  }

  cargarDatosIniciales(usuarioId: number): void {
    this.cargandoVista = true;

    forkJoin({
      solicitudes: this.solicitudesService.obtenerSolicitudesPorUsuario(usuarioId),
      usuarios: this.userService.ObtenerUsuarios(),
      seguimientos: this.solicitudesService.obtenerSeguimientos(),
      contenidos: this.solicitudesService.obtenerContenidos(),
      revistas: this.solicitudesService.obtenerRevistas(),
      pasos: this.solicitudesService.obtenerPasos(),
      estados: this.solicitudesService.obtenerEstados()
    }).subscribe({
      next: ({ solicitudes, usuarios, seguimientos, contenidos, revistas, pasos, estados }) => {
        this.solicitudes = this.ordenarSolicitudesPorFecha((solicitudes || []).filter(s => s.status !== false));
        this.filteredSolicitudes = [...this.solicitudes];
        this.usuarios = usuarios || [];
        this.seguimientos = seguimientos || [];
        this.contenidos = contenidos || [];
        this.revistas = revistas || [];
        this.pasosSeguimiento = pasos || [];
        this.estadosSeguimiento = estados || [];
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar mis solicitudes:', error);
        this.cargandoVista = false;
      }
    });
  }

  buscarSolicitudes(): void {
    const termino = this.normalizarTexto(this.searchText);

    if (!termino) {
      this.filteredSolicitudes = [...this.solicitudes];
      return;
    }

    this.filteredSolicitudes = this.solicitudes.filter((solicitud) => {
      const titulo = this.normalizarTexto(solicitud.titulo_articulo);
      const afiliacion = this.normalizarTexto(solicitud.afiliacion);
      const autores = this.normalizarTexto(this.getUsuarioNombre(solicitud.autores));
      const revista = this.normalizarTexto(this.getRevistaNombre(solicitud.revista));
      const estado = this.normalizarTexto(this.getEstadoResumen(solicitud.id));

      return (
        titulo.includes(termino) ||
        afiliacion.includes(termino) ||
        autores.includes(termino) ||
        revista.includes(termino) ||
        estado.includes(termino)
      );
    });
  }

  getUsuarioNombre(usuarioIds: number[] | undefined): string {
    if (!usuarioIds || usuarioIds.length === 0) {
      return 'Autores desconocidos';
    }

    const nombresUnicos = new Set<string>();

    for (const usuarioId of usuarioIds) {
      const usuario = this.usuarios.find(u => u.user === usuarioId);
      if (usuario) {
        nombresUnicos.add(`${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim());
      }
    }

    return nombresUnicos.size > 0
      ? Array.from(nombresUnicos).join(', ')
      : 'Autores desconocidos';
  }

  getRevistaNombre(revistaId: number): string {
    const revista = this.revistas.find(r => r.id === revistaId);
    return revista ? revista.nombre : 'Sin revista';
  }

  hasContenido(solicitud: Solicitud): boolean {
    return !!solicitud?.contenidoSolicitud && solicitud.contenidoSolicitud > 0;
  }

  getPasoNivel(pasoId: number | null | undefined): number {
    const paso = this.pasosSeguimiento.find((p: any) => p.id === pasoId);
    return Number(paso?.nivel || 999);
  }

  getPasoNombre(pasoId: number | null | undefined): string {
    const paso = this.pasosSeguimiento.find((p: any) => p.id === pasoId);
    return paso?.nombre || `Paso ${pasoId ?? '-'}`;
  }

  getEstadoNombre(estadoId: number | null | undefined): string {
    const estado = this.estadosSeguimiento.find((e: any) => e.id === estadoId);
    return estado?.nombre || 'En proceso';
  }

  getResponsableNombre(responsableId: number | null | undefined): string {
    const usuario = this.usuarios.find(u => u.user === responsableId);
    if (!usuario) {
      return 'Sin responsable asignado';
    }
    return `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim();
  }

  getSeguimientosSolicitud(solicitudId: number): any[] {
    return [...this.seguimientos.filter((s: any) => s.solicitudId === solicitudId)]
      .sort((a: any, b: any) => this.getPasoNivel(a.pasos_seguimiento) - this.getPasoNivel(b.pasos_seguimiento));
  }

  getUltimoSeguimiento(solicitudId: number): any | null {
    const lista = this.getSeguimientosSolicitud(solicitudId);
    return lista.length > 0 ? lista[lista.length - 1] : null;
  }

  getEstadoResumen(solicitudId: number): string {
    const ultimo = this.getUltimoSeguimiento(solicitudId);
    return ultimo ? this.getEstadoNombre(ultimo.estado_seguimiento) : 'Solicitud registrada';
  }

  getEstadoResumenClass(solicitudId: number): string {
    const estado = this.normalizarTexto(this.getEstadoResumen(solicitudId));

    if (estado.includes('aprob') || estado.includes('acept')) {
      return 'status-ok';
    }

    if (estado.includes('rechaz') || estado.includes('devuelto') || estado.includes('corre')) {
      return 'status-warning';
    }

    return 'status-pending';
  }

  debeMostrarEditar(solicitud: Solicitud): boolean {
    const seguimientosSolicitud = this.seguimientos.filter((seguimiento: any) => seguimiento.solicitudId === solicitud.id);
    return seguimientosSolicitud.some((seguimiento: any) => ![1, 2, null].includes(seguimiento.estado_seguimiento));
  }

  mostrarDialogo(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.displayDialog = true;
    this.cargandoDetalle = true;
    this.limpiarPreviews();

    if (solicitud.contenidoSolicitud > 0) {
      this.solicitudesService.obtenerContenidoPorId(solicitud.contenidoSolicitud).subscribe({
        next: (contenidoResponse: Contenido) => {
          this.contenidoSeleccionado = contenidoResponse;
          this.cargandoDetalle = false;
        },
        error: (error) => {
          console.error('Error al obtener el contenido:', error);
          this.cargandoDetalle = false;
        }
      });
    } else {
      this.contenidoSeleccionado = {
        id: 0,
        declaracion_originalidad: '',
        archivo_adjunto: '',
        status: true,
      };
      this.cargandoDetalle = false;
    }
  }

  cerrarDialogo(): void {
    this.displayDialog = false;
    this.solicitudSeleccionada = undefined;
    this.cargandoDetalle = false;
    this.limpiarPreviews();
  }

  cargarPreview(tipo: PreviewTipo): void {
    if (!this.contenidoSeleccionado?.id) {
      return;
    }

    if (tipo === 'archivo_adjunto' && (this.fileURL || this.cargandoArchivoAdjunto)) {
      return;
    }

    if (tipo === 'originalidad' && (this.originalidadURL || this.cargandoOriginalidad)) {
      return;
    }

    if (tipo === 'archivo_adjunto') {
      this.cargandoArchivoAdjunto = true;
      this.errorArchivoAdjunto = false;
    } else {
      this.cargandoOriginalidad = true;
      this.errorOriginalidad = false;
    }

    this.solicitudesService.descargarArchivo(this.contenidoSeleccionado.id, tipo).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);

        if (tipo === 'archivo_adjunto') {
          if (this.fileObjectUrl) {
            URL.revokeObjectURL(this.fileObjectUrl);
          }
          this.fileObjectUrl = objectUrl;
          this.fileURL = safeUrl;
          this.cargandoArchivoAdjunto = false;
        } else {
          if (this.originalidadObjectUrl) {
            URL.revokeObjectURL(this.originalidadObjectUrl);
          }
          this.originalidadObjectUrl = objectUrl;
          this.originalidadURL = safeUrl;
          this.cargandoOriginalidad = false;
        }
      },
      error: (error) => {
        console.error(`Error al cargar preview de ${tipo}:`, error);

        if (tipo === 'archivo_adjunto') {
          this.cargandoArchivoAdjunto = false;
          this.errorArchivoAdjunto = true;
        } else {
          this.cargandoOriginalidad = false;
          this.errorOriginalidad = true;
        }
      }
    });
  }

  descargarArchivo(id: number, tipo: PreviewTipo): void {
    this.solicitudesService.descargarArchivo(id, tipo).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tipo}_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    });
  }

  MostrarEditarContenido(id: number): void {
    const contenido = this.contenidos.find((c) => c.id === id);

    if (!contenido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Contenido no disponible',
        detail: 'No se encontró un contenido editable asociado a esta solicitud.'
      });
      return;
    }

    this.resetArchivosContenido();
    this.contenidoSeleccionado = { ...contenido };
    this.EditarDialog = true;
  }

  guardarContenido(): void {
    if (!this.selectedFile && !this.selectedFile2) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin cambios',
        detail: 'Selecciona al menos un archivo para actualizar el contenido.'
      });
      return;
    }

    if (this.selectedFile && this.selectedFile.type !== 'application/pdf') {
      this.messageService.add({
        severity: 'error',
        summary: 'Formato inválido',
        detail: 'El artículo debe estar en formato PDF.'
      });
      return;
    }

    if (this.selectedFile2 && this.selectedFile2.type !== 'application/pdf') {
      this.messageService.add({
        severity: 'error',
        summary: 'Formato inválido',
        detail: 'La declaración de originalidad debe estar en formato PDF.'
      });
      return;
    }

    this.guardandoContenido = true;

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('archivo_adjunto', this.selectedFile);
    }

    if (this.selectedFile2) {
      formData.append('declaracion_originalidad', this.selectedFile2);
    }

    formData.append('id', this.contenidoSeleccionado.id.toString());
    formData.append('status', this.contenidoSeleccionado.status.toString());

    this.solicitudesService.editarContenido2(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Contenido actualizado',
          detail: 'El contenido se editó exitosamente.'
        });

        this.EditarDialog = false;
        this.guardandoContenido = false;
        this.resetArchivosContenido();

        if (this.usuarioId !== undefined) {
          this.cargarDatosIniciales(this.usuarioId);
        }
      },
      error: (error) => {
        console.error('Error al editar contenido:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al editar el contenido.'
        });
        this.guardandoContenido = false;
      }
    });
  }

  OcultarEditarContenido(): void {
    this.EditarDialog = false;
    this.resetArchivosContenido();
  }

  onFileChangeArticulo(event: any): void {
    const file = event?.target?.files?.[0] || null;
    this.selectedFile = file;
    this.archivoSeleccionado = file ? file.name : '';
  }

  onFileChangeDeclaracion(event: any): void {
    const file = event?.target?.files?.[0] || null;
    this.selectedFile2 = file;
    this.archivoSeleccionado2 = file ? file.name : '';
  }
}