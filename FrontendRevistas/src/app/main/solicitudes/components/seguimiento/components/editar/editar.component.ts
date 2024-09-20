import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Seguimiento, Solicitud, Pasos, Estado } from 'src/app/models/solicitudes';
import { Person } from 'src/app/models/user/person';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  seguimientoSeleccionado: any;
  solicitudes: Solicitud[] = [];
  pasos: Pasos[] = [];
  seguimientoForm: FormGroup;
  seguimientos: Seguimiento[] = [];
  mostrarDialogo: boolean = false;
  usuarios: Person[] = [];
  estados: Estado[] = [];
  responsables: any[] = [];
  correccionesFile: File | null = null;
  FormatoFile: File | null = null;
  archivoSeleccionadoCorreciones: string = '';
  archivoSeleccionadoFormato: string = '';
  searchText: string = '';
  filteredSeguimientos: Seguimiento[] = [];

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

  ngOnInit() {
    this.obtenerSeguimientos();
    this.obtenerPasos();
    this.obtenerSolicitudes();
    this.obtenerUsuarios();
    this.obtenerEstados();
  }

  obtenerSeguimientos() {
    this.solicitudesService.obtenerSeguimientos().subscribe(data => {
      this.filteredSeguimientos = data;
      this.seguimientos = data;
    });
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
      },
      (error: any) => {
        console.error('Error al obtener las solicitudes', error);
      }
    );
  }

  obtenerUsuarios(): void {
    this.userService.ObtenerUsuarios().subscribe(
      (response: any) => {

        if (response && Array.isArray(response)) {
          this.responsables = response;
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

  getSolicitudNombre(solicitudId: number): string {
    const solicitud = this.solicitudes.find(s => s.id === solicitudId);
    return solicitud ? solicitud.titulo_articulo : '';
  }

  getPasoNombre(pasoId: number): string {
    const paso = this.pasos.find(p => p.id === pasoId);
    return paso ? paso.nombre : '';
  }

  getEstadoNombre(estadoId: number): string {
    const estado = this.estados.find(e => e.id === estadoId);
    return estado ? estado.nombre : '';
  }

  getResponsableNombre(responsableId: number): string {
    const responsable = this.responsables.find(r => r.user === responsableId);
    return responsable ? `${responsable.nombres} ${responsable.apellidos}` : '';
  }

  onCorreccionesFileSelected(event: any) {
    this.correccionesFile = event.target.files[0];
    this.archivoSeleccionadoCorreciones = event.target.files[0].name;
  }

  onFormatoFileSelected(event: any) {
    this.FormatoFile = event.target.files[0];
    this.archivoSeleccionadoFormato = event.target.files[0].name;
  }

  abrirDialogo(seguimiento: Seguimiento) {
    this.seguimientoSeleccionado = seguimiento;
    this.mostrarDialogo = true;
    this.inicializarFormularioSeguimiento(seguimiento);

  }

  cerrarDialogo() {
    this.mostrarDialogo = false;
  }

  inicializarFormularioSeguimiento(seguimiento: Seguimiento) {
    const fechaActual = new Date();
    const fechaActualISO = fechaActual.toISOString().split('T')[0];

    // Asumiendo que tienes un campo 'paso_seleccionado' en tu objeto 'seguimiento' que almacena el ID del paso seleccionado
    const pasoSeleccionadoId = seguimiento.pasos_seguimiento;

    // Busca el paso seleccionado en la lista de pasos
    const pasoSeleccionado = this.pasos.find(paso => paso.id === pasoSeleccionadoId);

    // Si se encuentra el paso seleccionado y tiene la propiedad 'dias_programacion'
    if (pasoSeleccionado && pasoSeleccionado.dias_programacion) {
      const diasProgramacion = parseInt(pasoSeleccionado.dias_programacion, 10); // Convierte a número

      // Calcula la fecha de programación sumando los días de programación a la fecha de asignación
      const fechaProgramacion = new Date(fechaActual);
      fechaProgramacion.setDate(fechaProgramacion.getDate() + diasProgramacion);

      this.seguimientoForm.patchValue({
        fecha_asignacion: fechaActualISO,
        fecha_programacion: fechaProgramacion.toISOString().split('T')[0], // Formatea la fecha de programación
        fecha_evaluacion: seguimiento.fecha_evaluacion,
        solicitudId: seguimiento.solicitudId,
        correciones: seguimiento.correciones,
        formato_evaluacion: seguimiento.formato_evaluacion,
        pasos_seguimiento: seguimiento.pasos_seguimiento,
        estado_seguimiento: seguimiento.estado_seguimiento,
        responsableId: seguimiento.responsableId,
        status: 'true',
      });
    } else {
      // Manejo de error si no se encuentra el paso seleccionado o no tiene 'dias_programacion'
      console.error('El paso seleccionado no tiene días de programación definidos.');
      // Puedes tomar medidas adicionales aquí, como mostrar un mensaje de error al usuario.
    }
  }

  editarSeguimiento() {
    if (this.seguimientoForm.valid) {
      const seguimientoEditado: any = {
        ...this.seguimientoSeleccionado,
        ...this.seguimientoForm.value
      };

      const fechaActual = new Date();
      const fechaActualISO = fechaActual.toISOString().split('T')[0];

      const formData = new FormData();

      // Agregar el archivo adjunto si está presente
      if (this.correccionesFile) {
        formData.append('correciones', this.correccionesFile);
      }

      if (this.FormatoFile) {
        formData.append('formato_evaluacion', this.FormatoFile);
      }

      if (seguimientoEditado.pasos_seguimiento === 2){
      // Agregar los otros campos al formData
      formData.append('id', seguimientoEditado.id.toString());
      formData.append('fecha_asignacion', seguimientoEditado.fecha_asignacion);
      formData.append('fecha_programacion', seguimientoEditado.fecha_programacion);
      formData.append('fecha_evaluacion', fechaActualISO);
      formData.append('solicitudId', seguimientoEditado.solicitudId.toString());
      formData.append('pasos_seguimiento', seguimientoEditado.pasos_seguimiento.toString());
      formData.append('estado_seguimiento', seguimientoEditado.estado_seguimiento.toString());
      formData.append('responsableId', seguimientoEditado.responsableId.toString());
      formData.append('status', 'true');
    }else{
      // Agregar los otros campos al formData
      formData.append('id', seguimientoEditado.id.toString());
      formData.append('fecha_asignacion', seguimientoEditado.fecha_asignacion);
      formData.append('fecha_programacion', seguimientoEditado.fecha_programacion);
      formData.append('solicitudId', seguimientoEditado.solicitudId.toString());
      formData.append('pasos_seguimiento', seguimientoEditado.pasos_seguimiento.toString());
      formData.append('estado_seguimiento', seguimientoEditado.estado_seguimiento.toString());
      formData.append('responsableId', seguimientoEditado.responsableId.toString());
      formData.append('status', 'true');
    }

      // Realizar llamada al servicio para actualizar el seguimiento
      this.solicitudesService.actualizarSeguimientoConArchivo(formData).subscribe(
        (response: any) => {
          this.mostrarDialogo = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Seguimiento actualizado correctamente' });
          // Actualizar la lista de seguimientos si es necesario
          this.obtenerSeguimientos();
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

  abrirCorreciones(correcionesUrl: string) {
    window.open(correcionesUrl, '_blank'); // Abre en una nueva pestaña
  }

  abrirFormato(formatoUrl: string) {
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
  }

}
