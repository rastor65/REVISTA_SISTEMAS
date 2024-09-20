import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Solicitud, Seguimiento, Contenido } from 'src/app/models/solicitudes';
import { Person } from 'src/app/models/user/person';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { MessageService } from 'primeng/api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent implements OnInit {
  minDate = new Date();
  solicitudes: Solicitud[] = [];
  usuarioId: number | undefined;
  displayDialog = false;
  solicitudSeleccionada: Solicitud | undefined = undefined;
  usuarios: Person[] = [];
  seguimientos: Seguimiento[] = [];
  EditarDialog: boolean = false;
  contenidos: Contenido[] = [];
  fileURL: SafeResourceUrl | null = null;
  originalidadURL: SafeResourceUrl | null = null;
  contenidoSeleccionado: Contenido = {
    id: 0,
    declaracion_originalidad: '',
    archivo_adjunto: '',
    status: true,
  };

  
  archivoAdjunto: File | null = null;
  declaracionOriginalidad: File | null = null;
  selectedFile: File | null = null;
  selectedFile2: File | null = null;
  archivoSeleccionado: string = '';
  archivoSeleccionado2: string = '';

  constructor(
    private dialogService: DialogService,
    private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerSeguimientos();
    this.cargarContenidos();
    this.usuarioId = this.authService.getUserId();
    if (this.usuarioId !== undefined) {
      this.cargarSolicitudesUsuario(this.usuarioId);
    } else {
      console.error('El usuario no tiene un ID válido.');
    }
  }

  cargarSolicitudesUsuario(usuarioId: number): void {
    this.solicitudesService.obtenerSolicitudesPorUsuario(usuarioId).subscribe(
      (solicitudes: Solicitud[]) => {
        this.solicitudes = solicitudes;
      },
      (error) => {
        console.error('Error al cargar las solicitudes del usuario:', error);
      }
    );
  }

  cargarContenidos(): void {
    this.solicitudesService.obtenerContenidos().subscribe(
      (contenidos: Contenido[]) => {
        this.contenidos = contenidos;
      },
      (error) => {
        console.error('Error al cargar los contenidos:', error);
      }
    );
  }

  obtenerSeguimientos(): void {
    this.solicitudesService.obtenerSeguimientos().subscribe(
      (data: any) => {
        if (data) {
          this.seguimientos = data;
        } else {
          console.error("Error al obtener los seguimientos");
        }
      }
    )
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

  getUsuarioNombre(usuarioIds: number[] | undefined): string {
    if (usuarioIds && usuarioIds.length > 0) {
      const nombresUnicos = new Set<string>();
      for (const usuarioId of usuarioIds) {
        const usuario = this.usuarios.find(u => u.user === usuarioId);
        if (usuario) {
          nombresUnicos.add(`${usuario.nombres} ${usuario.apellidos}`);
        }
      }
      if (nombresUnicos.size > 0) {
        return Array.from(nombresUnicos).join(', '); // Concatenar nombres únicos separados por comas
      }
    }
    return 'Autores desconocidos';
  }

  MostrarEditarContenido(id: number): void {

    const contenido = this.contenidos.find((c) => c.id === id);

    if (contenido) {
      this.contenidoSeleccionado = { ...contenido };
      this.EditarDialog = true;
    }
  }

  guardarContenido(): void {

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('archivo_adjunto', this.selectedFile);
    }
    if (this.selectedFile2) {
      formData.append('declaracion_originalidad', this.selectedFile2);
    }
    formData.append('id', this.contenidoSeleccionado.id.toString());
    formData.append('status', this.contenidoSeleccionado.status.toString());

    // Realizar llamada al servicio para actualizar el contenido
    this.solicitudesService.editarContenido2(formData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Contenido editado', detail: 'El contenido se editó exitosamente' });
        this.EditarDialog = false;
        if (this.usuarioId !== undefined) {
          this.cargarSolicitudesUsuario(this.usuarioId);
        } else {
          console.error('El usuario no tiene un ID válido.');
        }
      },
      (error) => {
        console.error('Error al editar contenido:', error);
        this.messageService.add({ severity: 'error', summary: 'Error al editar contenido', detail: 'Ocurrió un error al editar el contenido' });
      }
    );
  }

  OcultarEditarContenido() {
    this.EditarDialog = false;
  }

  debeMostrarEditar(solicitud: Solicitud): boolean {
    const seguimientosSolicitud = this.seguimientos.filter(seguimiento => seguimiento.solicitudId === solicitud.id);
    const resultado = seguimientosSolicitud.some(seguimiento => ![1, 2, null].includes(seguimiento.estado_seguimiento));
    return resultado;
  }

  mostrarDialogo(solicitud: Solicitud): void {
    this.solicitudSeleccionada = solicitud;
    this.displayDialog = true;
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

  cerrarDialogo() {
    this.displayDialog = false;
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

  onFileChangeArticulo(event: any): void {
    const files: File[] = event?.target?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    } else {
      this.selectedFile = null;
    }
    this.archivoSeleccionado = event.target.files[0].name;
  }

  onFileChangeDeclaracion(event: any): void {
    const files: File[] = event?.target?.files;
    if (files && files.length > 0) {
      this.selectedFile2 = files[0];
    } else {
      this.selectedFile2 = null;
    }
    this.archivoSeleccionado2 = event.target.files[0].name;
  }


}
