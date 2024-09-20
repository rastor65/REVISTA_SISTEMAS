import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Solicitud, Contenido, Revistas } from 'src/app/models/solicitudes';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { Person } from 'src/app/models/user/person';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css'],
  providers: [DialogService]
})
export class VerComponent implements OnInit {
  DisplayContenido: boolean = false;
  solicitudSeleccionada: Solicitud | undefined = undefined;
  contenidoSeleccionado: Contenido | null = null;
  usuarios: Person[] = [];
  revistas: Revistas[] = [];
  solicitudes: Solicitud[] = [];
  searchText: string = '';
  filteredSolicitudes: Solicitud[] = [];
  fileURL: SafeResourceUrl | null = null;
  originalidadURL: SafeResourceUrl | null = null;
  currentView: 'table' | 'cards' = 'table';

  constructor(
    private dialogService: DialogService,
    private solicitudesService: SolicitudesService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.obtenerRevistas();
    this.cargarAutores();
  }

  toggleView(view: 'table' | 'cards'): void {
    this.currentView = view;
  }

  obtenerRevistas(): void {
    this.solicitudesService.obtenerRevistas().subscribe(
      response => {
        this.revistas = response;
      },
      error => {
        console.error('Error al obtener las revistas:', error);
      }
    );
  }

  getRevistaNombre(revistaId: number): string {
    const revista = this.revistas.find(r => r.id === revistaId);
    return revista ? `${revista.nombre}` : '';
  }

  cargarAutores(): void {
    this.userService.ObtenerUsuarios().subscribe(
      (data: Person[]) => {
        this.usuarios = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getAutoresNombres(AutoresIds: number[] | undefined): string {
    if (AutoresIds && AutoresIds.length > 0) {
      const nombresUnicos = new Set<string>();
      for (const usuarioId of AutoresIds) {
        const usuario = this.usuarios.find(u => u.user === usuarioId);
        if (usuario) {
          nombresUnicos.add(`${usuario.nombres} ${usuario.apellidos}`);
        }
      }
      return Array.from(nombresUnicos).join(', ');
    }
    return 'Autores desconocidos';
  }

  cargarSolicitudes(): void {
    this.solicitudesService.obtenerSolicitudes().subscribe(
      (data: Solicitud[]) => {
        this.solicitudes = data;
        this.buscarSolicitudes();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  buscarSolicitudes(): void {
    if (this.searchText.trim() === '') {
      this.filteredSolicitudes = this.solicitudes;
    } else {
      this.filteredSolicitudes = this.solicitudes.filter((solicitud) => {
        const tituloArticuloMatch = solicitud.titulo_articulo.toLowerCase().includes(this.searchText.toLowerCase());
        const afiliacionMatch = solicitud.afiliacion.toLowerCase().includes(this.searchText.toLowerCase());
        const autoresMatch = this.getAutoresNombres(solicitud.autores).toLowerCase().includes(this.searchText.toLowerCase());
        return tituloArticuloMatch || afiliacionMatch || autoresMatch;
      });
    }
  }

  mostrarContenido(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.DisplayContenido = true;
    if (solicitud.contenidoSolicitud > 0) {
      this.solicitudesService.obtenerContenidoPorId(solicitud.contenidoSolicitud).subscribe(
        (contenidoResponse: Contenido) => {
          if (contenidoResponse) {
            this.contenidoSeleccionado = contenidoResponse;
            this.previsualizarArchivo(contenidoResponse.id, 'archivo_adjunto');
            this.previsualizarArchivo(contenidoResponse.id, 'originalidad');
          } else {
            console.error("El contenido no está en el formato esperado.");
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("El ID de contenido es nulo.");
    }
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

  ocultarContenido() {
    this.DisplayContenido = false;
    this.contenidoSeleccionado = null;
    this.fileURL = null;
    this.originalidadURL = null;
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
}
