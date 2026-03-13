import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';

import { Solicitud, Contenido, Revistas } from 'src/app/models/solicitudes';
import { Person } from 'src/app/models/user/person';

type PreviewTipo = 'archivo_adjunto' | 'originalidad';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  DisplayContenido = false;
  solicitudSeleccionada: Solicitud | undefined = undefined;
  contenidoSeleccionado: Contenido | null = null;

  usuarios: Person[] = [];
  revistas: Revistas[] = [];
  solicitudes: Solicitud[] = [];
  filteredSolicitudes: Solicitud[] = [];

  searchText = '';
  currentView: 'table' | 'cards' = 'table';

  cargandoVista = true;
  cargandoContenido = false;

  fileURL: SafeResourceUrl | null = null;
  originalidadURL: SafeResourceUrl | null = null;

  private fileObjectUrl: string | null = null;
  private originalidadObjectUrl: string | null = null;

  cargandoArchivoAdjunto = false;
  cargandoOriginalidad = false;

  errorArchivoAdjunto = false;
  errorOriginalidad = false;

  constructor(
    private solicitudesService: SolicitudesService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  get totalSolicitudes(): number {
    return this.solicitudes.length;
  }

  get totalConContenido(): number {
    return this.solicitudes.filter(s => !!s.contenidoSolicitud && s.contenidoSolicitud > 0).length;
  }

  get totalRevistas(): number {
    const ids = new Set(this.solicitudes.map(s => s.revista).filter(Boolean));
    return ids.size;
  }

  toggleView(view: 'table' | 'cards'): void {
    this.currentView = view;
  }

  cargarDatosIniciales(): void {
    this.cargandoVista = true;

    forkJoin({
      solicitudes: this.solicitudesService.obtenerSolicitudes(),
      revistas: this.solicitudesService.obtenerRevistas(),
      usuarios: this.userService.ObtenerUsuarios()
    }).subscribe({
      next: ({ solicitudes, revistas, usuarios }) => {
        this.revistas = revistas || [];
        this.usuarios = usuarios || [];
        this.solicitudes = this.ordenarSolicitudesPorFecha(solicitudes || []);
        this.buscarSolicitudes();
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar la información de solicitudes:', error);
        this.cargandoVista = false;
      }
    });
  }

  ordenarSolicitudesPorFecha(data: Solicitud[]): Solicitud[] {
    return [...data].sort((a, b) => {
      const fechaA = new Date(a.fecha_creacion || '').getTime();
      const fechaB = new Date(b.fecha_creacion || '').getTime();
      return fechaB - fechaA;
    });
  }

  normalizarTexto(valor: string | null | undefined): string {
    return (valor || '').toLowerCase().trim();
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
      const fecha = this.normalizarTexto(
        solicitud.fecha_creacion
          ? new Date(solicitud.fecha_creacion).toLocaleDateString()
          : ''
      );

      return (
        titulo.includes(termino) ||
        afiliacion.includes(termino) ||
        autores.includes(termino) ||
        revista.includes(termino) ||
        fecha.includes(termino)
      );
    });
  }

  mostrarContenido(solicitud: Solicitud): void {
    this.limpiarPreviews();

    this.solicitudSeleccionada = solicitud;
    this.DisplayContenido = true;
    this.cargandoContenido = true;
    this.contenidoSeleccionado = null;

    if (!solicitud.contenidoSolicitud || solicitud.contenidoSolicitud <= 0) {
      this.cargandoContenido = false;
      return;
    }

    this.solicitudesService.obtenerContenidoPorId(solicitud.contenidoSolicitud).subscribe({
      next: (contenidoResponse: Contenido) => {
        this.contenidoSeleccionado = contenidoResponse;
        this.cargandoContenido = false;
      },
      error: (error) => {
        console.error('Error al obtener el contenido:', error);
        this.cargandoContenido = false;
      }
    });
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

  ocultarContenido(): void {
    this.DisplayContenido = false;
    this.solicitudSeleccionada = undefined;
    this.contenidoSeleccionado = null;
    this.cargandoContenido = false;
    this.limpiarPreviews();
  }

  limpiarPreviews(): void {
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
}