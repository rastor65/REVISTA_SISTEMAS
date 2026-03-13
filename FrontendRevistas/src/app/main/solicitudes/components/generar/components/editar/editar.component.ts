import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';

import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';

import { Solicitud, Contenido, Revistas } from 'src/app/models/solicitudes';
import { Person } from 'src/app/models/user/person';

type ViewType = 'table' | 'cards';
type ModoContenido = 'create' | 'edit';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  afiliacionOptions: string[] = [
    'Estudiante',
    'Docente',
    'Estudiante externo nacional',
    'Docente externo nacional',
    'Estudiante externo internacional',
    'Docente externo internacional',
    'Otro...'
  ];

  mostrarDialogoEditarSolicitud = false;
  mostrarDialogoEditarContenido = false;

  minDate = new Date();
  viewType: ViewType = 'table';
  modoContenido: ModoContenido = 'edit';

  usuarios: Person[] = [];
  selectedAutores: Person[] = [];

  solicitudes: Solicitud[] = [];
  filteredSolicitudes: Solicitud[] = [];
  contenidos: Contenido[] = [];
  revistas: Revistas[] = [];

  searchText = '';
  cargandoVista = true;
  guardandoSolicitud = false;
  guardandoContenido = false;

  archivoSeleccionado = '';
  archivoSeleccionado2 = '';

  selectedFile: File | null = null;
  selectedFile2: File | null = null;

  solicitudEdicion: Solicitud = {
    id: 0,
    titulo_articulo: '',
    autores: [],
    fecha_creacion: '',
    afiliacion: '',
    contenidoSolicitud: 0,
    revista: 0,
    status: true,
    visto_bueno: false
  };

  contenidoEdicion: Contenido = {
    id: 0,
    status: true,
    archivo_adjunto: '',
    declaracion_originalidad: ''
  };

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.minDate = new Date();
    this.cargarDatosIniciales();
  }

  get totalSolicitudes(): number {
    return this.solicitudes.length;
  }

  get totalConContenido(): number {
    return this.solicitudes.filter(s => this.hasContenido(s)).length;
  }

  get totalRevistas(): number {
    const ids = new Set(this.solicitudes.map(s => s.revista).filter(Boolean));
    return ids.size;
  }

  get solicitudEdicionValida(): boolean {
    return !!this.solicitudEdicion.titulo_articulo?.trim()
      && this.selectedAutores.length > 0
      && !!this.solicitudEdicion.afiliacion
      && !!this.solicitudEdicion.revista;
  }

  get contenidoAsociado(): boolean {
    return !!this.solicitudEdicion?.contenidoSolicitud && this.solicitudEdicion.contenidoSolicitud > 0;
  }

  get nombreRevistaEdicion(): string {
    return this.getRevistaNombre(this.solicitudEdicion.revista);
  }

  toggleView(view: ViewType): void {
    this.viewType = view;
  }

  private getFechaLocalISO(): string {
    const fechaActual = new Date();
    const offset = fechaActual.getTimezoneOffset();
    fechaActual.setMinutes(fechaActual.getMinutes() - offset);
    return fechaActual.toISOString().split('T')[0];
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

  cargarDatosIniciales(): void {
    this.cargandoVista = true;

    forkJoin({
      solicitudes: this.solicitudesService.obtenerSolicitudes(),
      contenidos: this.solicitudesService.obtenerContenidos(),
      usuarios: this.userService.ObtenerUsuarios(),
      revistas: this.solicitudesService.obtenerRevistas()
    }).subscribe({
      next: ({ solicitudes, contenidos, usuarios, revistas }) => {
        this.solicitudes = this.ordenarSolicitudesPorFecha(solicitudes || []);
        this.filteredSolicitudes = [...this.solicitudes];
        this.contenidos = contenidos || [];
        this.usuarios = usuarios || [];
        this.revistas = revistas || [];
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar información de edición:', error);
        this.cargandoVista = false;
      }
    });
  }

  getRevistaNombre(revistaId: number): string {
    const revista = this.revistas.find(r => r.id === revistaId);
    return revista ? revista.nombre : 'Sin revista';
  }

  getAutoresNombres(autoresIds: number[] | undefined): string {
    if (!autoresIds || autoresIds.length === 0) {
      return 'Autores desconocidos';
    }

    const nombresUnicos = new Set<string>();

    for (const usuarioId of autoresIds) {
      const usuario = this.usuarios.find(u => u.user === usuarioId);
      if (usuario) {
        nombresUnicos.add(`${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim());
      }
    }

    return nombresUnicos.size > 0
      ? Array.from(nombresUnicos).join(', ')
      : 'Autores desconocidos';
  }

  obtenerNombreAutor(usuario: Person): string {
    return `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim();
  }

  hasContenido(solicitud: Solicitud): boolean {
    return !!solicitud?.contenidoSolicitud && solicitud.contenidoSolicitud > 0;
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
      const autores = this.normalizarTexto(this.getAutoresNombres(solicitud.autores));
      const revista = this.normalizarTexto(this.getRevistaNombre(solicitud.revista));

      return (
        titulo.includes(termino) ||
        afiliacion.includes(termino) ||
        autores.includes(termino) ||
        revista.includes(termino)
      );
    });
  }

  abrirEditarSolicitud(id: number): void {
    const solicitud = this.solicitudes.find((s) => s.id === id);
    if (!solicitud) {
      return;
    }

    this.resetArchivosContenido();

    this.solicitudEdicion = {
      ...solicitud,
      fecha_creacion: solicitud.fecha_creacion || this.getFechaLocalISO()
    };

    this.selectedAutores = this.usuarios.filter((usuario) => {
      return usuario.user !== undefined && this.solicitudEdicion.autores?.includes(usuario.user);
    });

    const contenidoCorrespondiente = this.contenidos.find(
      (c) => c.id === this.solicitudEdicion.contenidoSolicitud
    );

    if (contenidoCorrespondiente) {
      this.contenidoEdicion = { ...contenidoCorrespondiente };
      this.modoContenido = 'edit';
    } else {
      this.contenidoEdicion = {
        id: 0,
        status: true,
        archivo_adjunto: '',
        declaracion_originalidad: ''
      };
      this.modoContenido = 'create';
    }

    this.mostrarDialogoEditarSolicitud = true;
  }

  cerrarEditarSolicitud(): void {
    this.mostrarDialogoEditarSolicitud = false;
  }

  abrirDialogoContenido(): void {
    this.resetArchivosContenido();

    const contenido = this.contenidos.find((c) => c.id === this.solicitudEdicion.contenidoSolicitud);

    if (contenido) {
      this.contenidoEdicion = { ...contenido };
      this.modoContenido = 'edit';
    } else {
      this.contenidoEdicion = {
        id: 0,
        status: true,
        archivo_adjunto: '',
        declaracion_originalidad: ''
      };
      this.modoContenido = 'create';
    }

    this.mostrarDialogoEditarContenido = true;
  }

  cerrarEditarContenido(): void {
    this.mostrarDialogoEditarContenido = false;
    this.resetArchivosContenido();
  }

  guardarContenidoEdicion(): void {
    const tieneArticulo = !!this.selectedFile;
    const tieneOriginalidad = !!this.selectedFile2;

    if (this.modoContenido === 'create' && (!tieneArticulo || !tieneOriginalidad)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivos requeridos',
        detail: 'Debes seleccionar el artículo y la declaración de originalidad en formato PDF.'
      });
      return;
    }

    if (this.modoContenido === 'edit' && !tieneArticulo && !tieneOriginalidad) {
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
    formData.append('status', 'true');

    if (this.selectedFile) {
      formData.append('archivo_adjunto', this.selectedFile);
    }

    if (this.selectedFile2) {
      formData.append('declaracion_originalidad', this.selectedFile2);
    }

    if (this.modoContenido === 'create') {
      this.solicitudesService.guardarContenido(formData).subscribe({
        next: (response: any) => {
          this.solicitudEdicion.contenidoSolicitud = response.id;
          this.contenidoEdicion = {
            id: response.id,
            status: true,
            archivo_adjunto: '',
            declaracion_originalidad: ''
          };

          this.messageService.add({
            severity: 'success',
            summary: 'Contenido agregado',
            detail: 'El contenido se vinculó correctamente a la solicitud.'
          });

          this.mostrarDialogoEditarContenido = false;
          this.resetArchivosContenido();
          this.cargarDatosIniciales();
          this.guardandoContenido = false;
        },
        error: (error) => {
          console.error('Error al crear contenido:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el contenido.'
          });
          this.guardandoContenido = false;
        }
      });
      return;
    }

    formData.append('id', this.contenidoEdicion.id.toString());

    this.solicitudesService.editarContenido2(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Contenido actualizado',
          detail: 'El contenido se editó exitosamente.'
        });

        this.mostrarDialogoEditarContenido = false;
        this.resetArchivosContenido();
        this.cargarDatosIniciales();
        this.guardandoContenido = false;
      },
      error: (error) => {
        console.error('Error al editar contenido:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar el contenido.'
        });
        this.guardandoContenido = false;
      }
    });
  }

  guardarSolicitudEdicion(): void {
    if (!this.solicitudEdicionValida) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Completa título, autores, afiliación y revista antes de guardar.'
      });
      return;
    }

    this.guardandoSolicitud = true;

    const authorIds = this.selectedAutores
      .filter(author => typeof author.user === 'number')
      .map(author => author.user as number);

    const fecha = this.solicitudEdicion.fecha_creacion
      ? new Date(this.solicitudEdicion.fecha_creacion)
      : new Date();

    const solicitudActualizada: Solicitud = {
      ...this.solicitudEdicion,
      fecha_creacion: fecha.toISOString().split('T')[0],
      autores: authorIds,
      contenidoSolicitud: this.solicitudEdicion.contenidoSolicitud || 0
    };

    this.solicitudesService.editarSolicitud(solicitudActualizada).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Solicitud actualizada',
          detail: 'La solicitud se editó exitosamente.'
        });

        this.mostrarDialogoEditarSolicitud = false;
        this.cargarDatosIniciales();
        this.guardandoSolicitud = false;
      },
      error: (error) => {
        console.error('Error al editar la solicitud:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo editar la solicitud.'
        });
        this.guardandoSolicitud = false;
      }
    });
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