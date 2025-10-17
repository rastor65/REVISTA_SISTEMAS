import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Solicitud, Contenido } from 'src/app/models/solicitudes';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { Person } from 'src/app/models/user/person';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent {

  afiliacionOptions: string[] = ['Estudiante', 'Docente', 'Estudiante externo', 'Docente externo', 'otro...'];
  mostrarDialogoAgregarSolicitud = false;
  mostrarDialogoAgregarContenido = false;
  mostrarDialogoEditarSolicitud = false;
  mostrarDialogoEditarContenido = false;
  minDate = new Date();
  archivoAdjunto: File | null = null;
  declaracionOriginalidad: File | null = null;
  selectedFile: File | null = null;
  selectedFile2: File | null = null;
  usuarios: Person[] = [];
  selectedAutores: Person[] = [];
  archivoSeleccionado: string = '';
  archivoSeleccionado2: string = '';
  viewType: string = 'table'; 

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

  searchText: string = '';
  filteredSolicitudes: Solicitud[] = [];
  solicitudes: Solicitud[] = [];
  contenidos: Contenido[] = [];
  textoBoton = 'Agregar Contenido';

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {

    this.cargarAutores();
    this.minDate = new Date();
    this.cargarSolicitudes();
    // Obtener la fecha local actual
    const fechaActual = new Date();
    const offset = fechaActual.getTimezoneOffset(); // Obtener el desfase horario en minutos
    fechaActual.setMinutes(fechaActual.getMinutes() - offset); // Ajustar la fecha según el desfase

    const fechaActualISO = fechaActual.toISOString().split('T')[0];
    this.solicitudEdicion.fecha_creacion = fechaActualISO;
  }
  
  toggleView(view: string) {
    this.viewType = view;
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
      if (nombresUnicos.size > 0) {
        return Array.from(nombresUnicos).join(', '); // Concatenar nombres únicos separados por comas
      }
    }
    return 'Autores desconocidos';
  }


  abrirEditarSolicitud(id: number): void {
    const solicitud = this.solicitudes.find((s) => s.id === id);
    if (solicitud) {
      this.solicitudEdicion = { ...solicitud }; // Usar solicitudEdicion para editar
      this.textoBoton = this.solicitudEdicion.contenidoSolicitud ? 'Editar Contenido' : 'Agregar Contenido';
      this.mostrarDialogoEditarSolicitud = true;

      this.selectedAutores = this.usuarios.filter((usuario) => {
        return usuario.user !== undefined && this.solicitudEdicion.autores?.includes(usuario.user);
      });

      // Buscar el contenido correspondiente a la solicitud y abrir el diálogo de edición
      const contenidoCorrespondiente = this.contenidos.find((c) => c.id === this.solicitudEdicion.contenidoSolicitud);
      if (contenidoCorrespondiente) {
        this.contenidoEdicion = { ...contenidoCorrespondiente };
      }
    }
  }

  cerrarEditarSolicitud() {
    this.mostrarDialogoEditarSolicitud = false;
  }

  abrirEditarContenido(id: number): void {

    const contenido = this.contenidos.find((c) => c.id === id);

    if (contenido) {
      this.contenidoEdicion = { ...contenido };
      this.mostrarDialogoEditarContenido = true;
    }
  }

  cerrarEditarContenido() {
    this.mostrarDialogoEditarContenido = false;
  }

  cargarSolicitudes(): void {
    this.solicitudesService.obtenerSolicitudes().subscribe(
      (data: Solicitud[]) => {
        this.solicitudes = data;
        this.filteredSolicitudes = this.solicitudes;
      },
      (error) => {
        console.error(error);
      }
    );
    this.solicitudesService.obtenerContenidos().subscribe(
      (data: Contenido[]) => {
        this.contenidos = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  convertFileToBase64(file: File): string {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // The result will be a base64-encoded string
      const base64String = reader.result as string;
      return base64String;
    };
    return '';
  }

  guardarContenidoEdicion(): void {

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('archivo_adjunto', this.selectedFile);
    }
    if (this.selectedFile2) {
      formData.append('declaracion_originalidad', this.selectedFile2);
    }
    formData.append('id', this.contenidoEdicion.id.toString());
    formData.append('status', this.contenidoEdicion.status.toString());

    // Realizar llamada al servicio para actualizar el contenido
    this.solicitudesService.editarContenido2(formData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Contenido editado', detail: 'El contenido se editó exitosamente' });
        this.mostrarDialogoEditarContenido = false;
        this.cargarSolicitudes();
      },
      (error) => {
        console.error('Error al editar contenido:', error);
        this.messageService.add({ severity: 'error', summary: 'Error al editar contenido', detail: 'Ocurrió un error al editar el contenido' });
      }
    );
  }

  guardarSolicitudEdicion(): void {
    if (!this.solicitudEdicion.contenidoSolicitud) {
      this.solicitudEdicion.contenidoSolicitud = 0; // Asignar un valor por defecto si es null o undefined
    }
    if (this.solicitudEdicion.fecha_creacion) {
      const date = new Date(this.solicitudEdicion.fecha_creacion);
      const formattedDate = date.toISOString().split('T')[0];
      this.solicitudEdicion.fecha_creacion = formattedDate;
    }

    const authorIds = this.selectedAutores
      .filter(author => typeof author.user === 'number')
      .map(author => author.user as number);

    this.solicitudEdicion.autores = authorIds; // Asignar autores aquí
    this.solicitudesService.editarSolicitud(this.solicitudEdicion).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'solicitud editada', detail: 'La solicitud se edito exitosamente' });
        this.mostrarDialogoEditarSolicitud = false;
        this.cargarSolicitudes();
      },
      (error) => {
        console.error('Error al editar la solicitud:', error);
        this.messageService.add({ severity: 'error', summary: 'Error al editar la solicitud', detail: 'Todos los campos son requeridos' });
      }
    );
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


}