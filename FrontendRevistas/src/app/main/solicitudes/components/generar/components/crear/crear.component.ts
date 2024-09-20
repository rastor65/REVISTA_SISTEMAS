import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Solicitud, Contenido, Revistas } from 'src/app/models/solicitudes';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { Person } from 'src/app/models/user/person';
import { RolesService } from 'src/app/core/services/admin/roles.service';

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
    'Estudiante externo Internacional',
    'Docente externo Internacional',
    'Otro...'];
  mostrarDialogoAgregarSolicitud = false;
  mostrarDialogoAgregarContenido = false;
  mostrarDialogoEditarSolicitud = false;
  mostrarDialogoEditarContenido = false;
  minDate = new Date();
  selectedFile: File | null = null;
  selectedFileOri: File | null = null;
  autores: Person[] = [];
  selectedAutores: Person[] = [];
  archivoSeleccionado: string = '';
  originalidadSeleccionada: string = '';
  editarContenido: boolean = false;
  solicitudEnProceso = false;

  solicitud: Solicitud = {
    id: 0,
    titulo_articulo: '',
    autores: [],
    fecha_creacion: '',
    afiliacion: '',
    contenidoSolicitud: 0,
    revista: 0,
    status: true,
  };
  contenido: Contenido = {
    id: 0,
    declaracion_originalidad: '',
    archivo_adjunto: '',
    status: true,
  };

  solicitudes: Solicitud[] = [];
  revistas: Revistas[] = [];
  textoBoton = 'Agregar Contenido';

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
    private rolesService: RolesService,
  ) { }

  ngOnInit(): void {
    this.minDate = new Date();
    this.obtenerAutores();
    this.obtenerRevistas();

    // Obtener la fecha local actual
    const fechaActual = new Date();
    const offset = fechaActual.getTimezoneOffset(); // Obtener el desfase horario en minutos
    fechaActual.setMinutes(fechaActual.getMinutes() - offset); // Ajustar la fecha según el desfase

    const fechaActualISO = fechaActual.toISOString().split('T')[0];
    this.solicitud.fecha_creacion = fechaActualISO;

    const userId = this.authService.getUserId();
  }

  obtenerAutores(): void {
    this.userService.ObtenerUsuarios().subscribe(
      response => {
        this.autores = response;
      },
      error => {
        console.error('Error al obtener los responsables:', error);
      }
    );
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

  abrirContenido(): void {
    if (this.solicitud.contenidoSolicitud) {
      // Si ya hay una ID de contenido, significa que estás editando un contenido existente.
      // Obtén los detalles del contenido utilizando la ID.
      this.solicitudesService.obtenerContenidoPorId(this.solicitud.contenidoSolicitud)
        .subscribe(
          (contenidoResponse: any) => {

            // Actualiza this.contenido con los datos del contenido existente.
            this.contenido = contenidoResponse;

            this.mostrarDialogoAgregarContenido = true;
            this.editarContenido = true; // Estás editando contenido existente.
            this.textoBoton = 'Editar Contenido';
          },
          (error) => {
            console.error('Error al cargar contenido:', error);
          }
        );
    } else {
      // Si no hay contenido cargado, establece la bandera de edición en falso y crea un nuevo objeto de contenido.
      this.editarContenido = false;
      this.contenido = {
        id: 0,
        declaracion_originalidad: '',
        archivo_adjunto: '',
        status: true,
      };
    }
    this.mostrarDialogoAgregarContenido = true;
  }


  cerrarContenido(): void {
    this.mostrarDialogoAgregarContenido = false;
  }

  async guardarSolicitud() {
    if (!this.solicitud.contenidoSolicitud) {
      this.solicitud.contenidoSolicitud = 0; // Asignar un valor por defecto si es null o undefined
    }

    if (this.solicitud.fecha_creacion) {
      const date = new Date(this.solicitud.fecha_creacion);
      const formattedDate = date.toISOString().split('T')[0];
    }

    try {
      this.solicitudEnProceso = true;
      // Obtener los datos de roles
      const roles = await this.rolesService.getRoles().toPromise();

      // Obtener la ID del "editor jefe"
      const editorJefeId = this.rolesService.obtenerEditorJefeId(roles);

      const authorIds = this.selectedAutores
        .filter(author => typeof author.user === 'number')
        .map(author => author.user as number);

      this.solicitud.autores = authorIds; // Asignar autores aquí

      const response = await this.solicitudesService.guardarSolicitud(this.solicitud).toPromise();

      const userId = this.authService.getUserId();
      if (typeof userId === 'number') {

        const pasosSeguimiento = await this.solicitudesService.obtenerPasos().toPromise();
        if (pasosSeguimiento != null) {
          // Ordena los pasos por nivel antes de procesarlos
          pasosSeguimiento.sort((a, b) => a.nivel - b.nivel);
        }

        const estadosSeguimiento = await this.solicitudesService.obtenerEstados().toPromise();

        if (pasosSeguimiento && estadosSeguimiento) {
          // Utiliza un bucle for para crear seguimientos en el orden correcto
          for (const paso of pasosSeguimiento) {
            const seguimientoData = new FormData();
            seguimientoData.append('solicitudId', response.id.toString());
            seguimientoData.append('pasos_seguimiento', paso.id.toString());
            seguimientoData.append('status', 'true');

            // Agrega la fecha de asignación solo al primer seguimiento
            if (paso.nivel === 1) {
              const fechaAsignacion = new Date().toISOString().split('T')[0];
              const fecha_evaluacion = new Date().toISOString().split('T')[0];
              seguimientoData.append('fecha_asignacion', fechaAsignacion);
              seguimientoData.append('fecha_evaluacion', fecha_evaluacion);
            }

            // Calcula la fecha de programación sumando los días del paso a la fecha de asignación
            if (paso.dias_programacion && paso.nivel === 1) {
              // Agrega el estado "pendiente"
              const estadoAceptado = estadosSeguimiento.find(estado => estado.nombre === "aceptado sin cambios" || "Aceptado sin cambios");

              if (estadoAceptado) {
                seguimientoData.append('estado_seguimiento', estadoAceptado.id.toString());
              } else {
              }
              const diasProgramacion = parseInt(paso.dias_programacion);
              const fechaProgramacion = new Date(new Date().getTime() + (diasProgramacion * 24 * 60 * 60 * 1000));
              const formattedFechaProgramacion = fechaProgramacion.toISOString().split('T')[0];
              seguimientoData.append('fecha_programacion', formattedFechaProgramacion);
              // Agrega el ID del usuario logueado como responsable
              seguimientoData.append('responsableId', userId.toString());
            }

            if (paso.nivel === 2 && editorJefeId) {
              // Agrega el estado "pendiente" al seguimiento con paso de nivel 2
              const estadoPendiente = estadosSeguimiento.find(estado => estado.nombre === "Pendiente" || "pendiente");
              if (estadoPendiente) {
                seguimientoData.append('estado_seguimiento', estadoPendiente.id.toString());
              }

              // Calcula la fecha de programación solo para el paso de nivel 2
              if (paso.dias_programacion) {
                const diasProgramacion = parseInt(paso.dias_programacion);
                const fechaAsignacion = new Date().toISOString().split('T')[0];
                const fechaProgramacion = new Date(new Date(fechaAsignacion).getTime() + (diasProgramacion * 24 * 60 * 60 * 1000));
                const formattedFechaProgramacion = fechaProgramacion.toISOString().split('T')[0];
                seguimientoData.append('fecha_asignacion', fechaAsignacion);
                seguimientoData.append('fecha_programacion', formattedFechaProgramacion);
              }

              // Asigna al "editor jefe" como responsable en el paso de nivel 2
              seguimientoData.append('responsableId', editorJefeId.toString());
            }
            // ... aquí puedes agregar otras propiedades necesarias ...

            await this.solicitudesService.crearSeguimiento(seguimientoData).toPromise();
          }
        } else {
          console.error('No se pudieron obtener los pasos de seguimiento o los estados de seguimiento.');
        }
      }
      this.messageService.add({ severity: 'success', summary: 'Solicitud guardada', detail: 'La solicitud se generó exitosamente' });
      this.resetearFormulario();
      this.solicitudEnProceso = false;
    } catch (error) {
      this.solicitudEnProceso = false;
      console.error('Error al guardar la solicitud:', error);
      this.messageService.add({ severity: 'error', summary: 'Error al generar la solicitud', detail: 'Todos los campos son requeridos' });
    }
    this.solicitudEnProceso = false;
  }

  guardarContenido(): void {
    if (!this.validarContenido()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Completa todos los campos del contenido' });
      return;
    }

    if (this.selectedFile && this.selectedFileOri) {
      // Validar si ambos archivos son PDF antes de enviar
      if (this.selectedFile.type !== 'application/pdf') {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El archivo adjunto debe ser un PDF.' });
        return;
      }

      if (this.selectedFileOri.type !== 'application/pdf') {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La declaración de originalidad debe ser un PDF.' });
        return;
      }

      const formData = new FormData();
      formData.append('archivo_adjunto', this.selectedFile);
      formData.append('declaracion_originalidad', this.selectedFileOri);
      formData.append('status', 'true');

      if (this.editarContenido) {
        formData.append('id', this.contenido.id.toString()); // Asegúrate de enviar el ID del contenido a actualizar.
        this.solicitudesService.editarContenido2(formData).subscribe(
          (contenidoResponse: any) => {
            this.messageService.add({ severity: 'success', summary: 'Contenido actualizado', detail: 'El contenido se ha actualizado exitosamente' });
            this.mostrarDialogoAgregarContenido = false;
            this.textoBoton = 'Editar Contenido';
          },
          (error) => {
            console.error('Error al actualizar contenido:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el contenido' });
          }
        );
      } else {
        this.solicitudesService.guardarContenido(formData).subscribe(
          (contenidoResponse: any) => {
            this.solicitud.contenidoSolicitud = contenidoResponse.id;
            this.messageService.add({ severity: 'success', summary: 'Contenido guardado', detail: 'El contenido se generó exitosamente' });
            this.contenido = {
              id: 0,
              archivo_adjunto: '',
              declaracion_originalidad: '',
              status: true,
            };
            this.mostrarDialogoAgregarContenido = false;
            this.textoBoton = 'Editar Contenido';
          },
          (error) => {
            console.error('Error al guardar contenido:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el contenido' });
          }
        );
      }
    }
  }


  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
    this.archivoSeleccionado = event.target.files[0].name;
  }

  handleFileInputOriginalidad(event: any) {
    this.selectedFileOri = event.target.files[0];
    this.originalidadSeleccionada = event.target.files[0].name;
  }

  resetearFormulario(): void {
    this.solicitud = {
      id: 0,
      titulo_articulo: '',
      autores: [],
      fecha_creacion: '',
      afiliacion: '',
      contenidoSolicitud: 0,
      revista: 0,
      status: true,
    };
    this.contenido = {
      id: 0,
      archivo_adjunto: '',
      declaracion_originalidad: '',
      status: true,
    };
  }

  validarCampos(): boolean {
    return (
      this.solicitud.autores !== null &&
      this.solicitud.fecha_creacion !== null
    );
  }

  validarContenido(): boolean {
    return (
      this.contenido.archivo_adjunto !== null &&
      this.contenido.declaracion_originalidad !== null
    );
  }

}
