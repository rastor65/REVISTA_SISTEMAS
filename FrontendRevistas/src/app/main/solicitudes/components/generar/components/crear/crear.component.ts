import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { RolesService } from 'src/app/core/services/admin/roles.service';

import { Solicitud, Contenido, Revistas } from 'src/app/models/solicitudes';
import { Person } from 'src/app/models/user/person';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  afiliacionOptions: string[] = [
    'Estudiante',
    'Docente',
    'Estudiante externo nacional',
    'Docente externo nacional',
    'Estudiante externo internacional',
    'Docente externo internacional',
    'Otro...'
  ];

  mostrarDialogoAgregarSolicitud = false;
  mostrarDialogoAgregarContenido = false;
  mostrarDialogoEditarSolicitud = false;
  mostrarDialogoEditarContenido = false;

  minDate = new Date();
  selectedFile: File | null = null;
  selectedFileOri: File | null = null;

  autores: Person[] = [];
  selectedAutores: Person[] = [];

  archivoSeleccionado = '';
  originalidadSeleccionada = '';

  editarContenido = false;
  solicitudEnProceso = false;
  mostrarCampoRevista = false;

  textoBoton = 'Agregar contenido';

  solicitud: Solicitud = {
    id: 0,
    titulo_articulo: '',
    autores: [],
    fecha_creacion: '',
    afiliacion: '',
    contenidoSolicitud: 0,
    revista: 0,
    status: true,
    visto_bueno: false,
  };

  contenido: Contenido = {
    id: 0,
    declaracion_originalidad: '',
    archivo_adjunto: '',
    status: true,
  };

  solicitudes: Solicitud[] = [];
  revistas: Revistas[] = [];

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
    private rolesService: RolesService,
  ) {}

  ngOnInit(): void {
    this.minDate = new Date();
    this.obtenerAutores();
    this.obtenerRevistas();
    this.solicitud.fecha_creacion = this.getFechaLocalISO();
  }

  get contenidoCargado(): boolean {
    return !!this.solicitud.contenidoSolicitud;
  }

  get formularioValido(): boolean {
    return !!this.solicitud.titulo_articulo?.trim()
      && this.selectedAutores.length > 0
      && !!this.solicitud.afiliacion
      && !!this.solicitud.revista
      && this.contenidoCargado;
  }

  get nombreRevistaSeleccionada(): string {
    const revista = this.revistas.find(r => r.id === this.solicitud.revista);
    return revista?.nombre || 'No seleccionada';
  }

  private getFechaLocalISO(): string {
    const fechaActual = new Date();
    const offset = fechaActual.getTimezoneOffset();
    fechaActual.setMinutes(fechaActual.getMinutes() - offset);
    return fechaActual.toISOString().split('T')[0];
  }

  private normalizarTexto(valor: string = ''): string {
    return valor.trim().toLowerCase();
  }

  private buscarEstado(estados: any[], posiblesNombres: string[]): any | undefined {
    const nombresNormalizados = posiblesNombres.map(nombre => this.normalizarTexto(nombre));
    return estados.find(estado => nombresNormalizados.includes(this.normalizarTexto(estado?.nombre || '')));
  }

  private resetearArchivos(): void {
    this.selectedFile = null;
    this.selectedFileOri = null;
    this.archivoSeleccionado = '';
    this.originalidadSeleccionada = '';
  }

  obtenerAutores(): void {
    this.userService.ObtenerUsuarios().subscribe(
      response => {
        this.autores = response || [];
      },
      error => {
        console.error('Error al obtener los autores:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los autores.'
        });
      }
    );
  }

  obtenerRevistas(): void {
    this.solicitudesService.obtenerRevistas().subscribe(
      response => {
        this.revistas = response || [];
      },
      error => {
        console.error('Error al obtener las revistas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las revistas.'
        });
      }
    );
  }

  abrirContenido(): void {
    this.resetearArchivos();

    if (this.solicitud.contenidoSolicitud) {
      this.solicitudesService.obtenerContenidoPorId(this.solicitud.contenidoSolicitud).subscribe(
        (contenidoResponse: any) => {
          this.contenido = contenidoResponse;
          this.editarContenido = true;
          this.textoBoton = 'Editar contenido';
          this.mostrarDialogoAgregarContenido = true;
        },
        (error) => {
          console.error('Error al cargar contenido:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el contenido actual.'
          });
        }
      );
      return;
    }

    this.editarContenido = false;
    this.textoBoton = 'Agregar contenido';
    this.contenido = {
      id: 0,
      declaracion_originalidad: '',
      archivo_adjunto: '',
      status: true,
    };
    this.mostrarDialogoAgregarContenido = true;
  }

  cerrarContenido(): void {
    this.mostrarDialogoAgregarContenido = false;
    this.resetearArchivos();
  }

  async guardarSolicitud(): Promise<void> {
    if (!this.formularioValido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Completa el título, autores, afiliación, revista y carga el contenido antes de continuar.'
      });
      return;
    }

    this.solicitudEnProceso = true;

    try {
      const roles = await firstValueFrom(this.rolesService.getRoles());
      const editorJefeId = this.rolesService.obtenerEditorJefeId(roles);

      const authorIds = this.selectedAutores
        .filter(author => typeof author.user === 'number')
        .map(author => author.user as number);

      this.solicitud.autores = authorIds;
      this.solicitud.fecha_creacion = this.solicitud.fecha_creacion || this.getFechaLocalISO();

      const response: any = await firstValueFrom(this.solicitudesService.guardarSolicitud(this.solicitud));

      const userId = this.authService.getUserId();

      if (typeof userId === 'number') {
        const pasosSeguimiento: any[] = await firstValueFrom(this.solicitudesService.obtenerPasos()) || [];
        const estadosSeguimiento: any[] = await firstValueFrom(this.solicitudesService.obtenerEstados()) || [];

        const pasosOrdenados = [...pasosSeguimiento].sort((a, b) => a.nivel - b.nivel);

        for (const paso of pasosOrdenados) {
          const seguimientoData = new FormData();
          seguimientoData.append('solicitudId', response.id.toString());
          seguimientoData.append('pasos_seguimiento', paso.id.toString());
          seguimientoData.append('status', 'true');

          if (paso.nivel === 1) {
            const fechaAsignacion = this.getFechaLocalISO();
            seguimientoData.append('fecha_asignacion', fechaAsignacion);
            seguimientoData.append('fecha_evaluacion', fechaAsignacion);

            const estadoInicial = this.buscarEstado(estadosSeguimiento, ['aceptado sin cambios', 'Aceptado sin cambios']);
            if (estadoInicial) {
              seguimientoData.append('estado_seguimiento', estadoInicial.id.toString());
            }

            if (paso.dias_programacion) {
              const diasProgramacion = parseInt(paso.dias_programacion, 10);
              const fechaProgramacion = new Date(new Date().getTime() + (diasProgramacion * 24 * 60 * 60 * 1000));
              seguimientoData.append('fecha_programacion', fechaProgramacion.toISOString().split('T')[0]);
            }

            seguimientoData.append('responsableId', userId.toString());
          }

          if (paso.nivel === 2) {
            const estadoPendiente = this.buscarEstado(estadosSeguimiento, ['pendiente', 'Pendiente']);
            if (estadoPendiente) {
              seguimientoData.append('estado_seguimiento', estadoPendiente.id.toString());
            }

            if (paso.dias_programacion) {
              const fechaAsignacion = this.getFechaLocalISO();
              const diasProgramacion = parseInt(paso.dias_programacion, 10);
              const fechaProgramacion = new Date(new Date(fechaAsignacion).getTime() + (diasProgramacion * 24 * 60 * 60 * 1000));

              seguimientoData.append('fecha_asignacion', fechaAsignacion);
              seguimientoData.append('fecha_programacion', fechaProgramacion.toISOString().split('T')[0]);
            }

            if (editorJefeId) {
              seguimientoData.append('responsableId', editorJefeId.toString());
            }
          }

          await firstValueFrom(this.solicitudesService.crearSeguimiento(seguimientoData));
        }
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Solicitud guardada',
        detail: 'La solicitud fue enviada exitosamente.'
      });

      this.resetearFormulario();
    } catch (error) {
      console.error('Error al guardar la solicitud:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error al generar la solicitud',
        detail: 'Ocurrió un problema al guardar la solicitud. Verifica la información e intenta nuevamente.'
      });
    } finally {
      this.solicitudEnProceso = false;
    }
  }

  guardarContenido(): void {
    if (!this.selectedFile || !this.selectedFileOri) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivos requeridos',
        detail: 'Debes seleccionar el artículo y la declaración de originalidad en formato PDF.'
      });
      return;
    }

    if (this.selectedFile.type !== 'application/pdf') {
      this.messageService.add({
        severity: 'error',
        summary: 'Formato inválido',
        detail: 'El artículo debe estar en formato PDF.'
      });
      return;
    }

    if (this.selectedFileOri.type !== 'application/pdf') {
      this.messageService.add({
        severity: 'error',
        summary: 'Formato inválido',
        detail: 'La declaración de originalidad debe estar en formato PDF.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('archivo_adjunto', this.selectedFile);
    formData.append('declaracion_originalidad', this.selectedFileOri);
    formData.append('status', 'true');

    if (this.editarContenido) {
      formData.append('id', this.contenido.id.toString());

      this.solicitudesService.editarContenido2(formData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Contenido actualizado',
            detail: 'Los archivos del contenido fueron actualizados exitosamente.'
          });
          this.mostrarDialogoAgregarContenido = false;
          this.textoBoton = 'Editar contenido';
          this.resetearArchivos();
        },
        (error) => {
          console.error('Error al actualizar contenido:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el contenido.'
          });
        }
      );
      return;
    }

    this.solicitudesService.guardarContenido(formData).subscribe(
      (contenidoResponse: any) => {
        this.solicitud.contenidoSolicitud = contenidoResponse.id;
        this.messageService.add({
          severity: 'success',
          summary: 'Contenido guardado',
          detail: 'El contenido fue cargado exitosamente.'
        });

        this.contenido = {
          id: 0,
          archivo_adjunto: '',
          declaracion_originalidad: '',
          status: true,
        };

        this.textoBoton = 'Editar contenido';
        this.mostrarDialogoAgregarContenido = false;
        this.resetearArchivos();
      },
      (error) => {
        console.error('Error al guardar contenido:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el contenido.'
        });
      }
    );
  }

  handleFileInput(event: any): void {
    const file = event?.target?.files?.[0] || null;
    this.selectedFile = file;
    this.archivoSeleccionado = file ? file.name : '';
  }

  handleFileInputOriginalidad(event: any): void {
    const file = event?.target?.files?.[0] || null;
    this.selectedFileOri = file;
    this.originalidadSeleccionada = file ? file.name : '';
  }

  resetearFormulario(): void {
    this.solicitud = {
      id: 0,
      titulo_articulo: '',
      autores: [],
      fecha_creacion: this.getFechaLocalISO(),
      afiliacion: '',
      contenidoSolicitud: 0,
      revista: 0,
      status: true,
      visto_bueno: false,
    };

    this.contenido = {
      id: 0,
      archivo_adjunto: '',
      declaracion_originalidad: '',
      status: true,
    };

    this.selectedAutores = [];
    this.textoBoton = 'Agregar contenido';
    this.editarContenido = false;
    this.resetearArchivos();
  }

  obtenerNombreAutor(autor: Person): string {
    return `${autor.nombres || ''} ${autor.apellidos || ''}`.trim();
  }
}