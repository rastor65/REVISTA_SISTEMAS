import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Person } from 'src/app/models/user/person';
import { Estado, Pasos, Solicitud, Seguimiento } from 'src/app/models/solicitudes';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-seguimiento',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  seguimiento: Seguimiento = {
    id: 0,
    fecha_asignacion: '',
    fecha_programacion: '',
    fecha_evaluacion: '',
    correciones: '',
    formato_evaluacion: '',
    status: true,
    solicitudId: 0,
    pasos_seguimiento: 0,
    estado_seguimiento: 0,
    responsableId: 0,
  };

  seguimientoForm: FormGroup;

  solicitudes: Solicitud[] = [];
  responsables: Person[] = [];
  pasos: Pasos[] = [];
  estados: Estado[] = [];
  selectedFile: File | null = null;
  selectedFileFormato: File | null = null;
  archivoSeleccionado: string = '';
  archivoSeleccionadoFormato: string = '';

  constructor(
    private solicitudesService: SolicitudesService,
    private userService: UserService,
    private messageService: MessageService, 
    private formBuilder: FormBuilder,
    
  ) {
    this.seguimientoForm = this.formBuilder.group({
      fecha_asignacion: ['', Validators.required],
      fecha_programacion: ['', Validators.required],
      fecha_evaluacion: ['', Validators.required],
      correciones: ['', Validators.required],
      solicitudId: [0, Validators.required], // Puedes establecer un valor inicial (0 en este caso)
      pasos_seguimiento: [0, Validators.required], // Puedes establecer un valor inicial (0 en este caso)
      estado_seguimiento: [0, Validators.required], // Puedes establecer un valor inicial (0 en este caso)
      responsableId: [0, Validators.required] // Puedes establecer un valor inicial (0 en este caso)
    });
  }

  ngOnInit(): void {
    this.obtenerSolicitudes();
    this.obtenerResponsables();
    this.obtenerPasos();
    this.obtenerEstados();
  }

  obtenerSolicitudes() {
    this.solicitudesService.obtenerSolicitudes().subscribe(
      (solicitudes: Solicitud[]) => {
        this.solicitudes = solicitudes;
      },
      (error: any) => {
        console.error('Error al obtener las solicitudes', error);
      }
    );
  }

  obtenerResponsables(): void {
    this.userService.ObtenerUsuarios().subscribe(
      response => {
        this.responsables = response;
      },
      error => {
        console.error('Error al obtener los responsables:', error);
      }
    );
  }

  obtenerEstados() {
    this.solicitudesService.obtenerEstados().subscribe(
      (estados: Estado[]) => {
        this.estados = estados;
      },
      (error: any) => {
        console.error('Error al obtener los estados de seguimiento', error);
      }
    );
  }

  obtenerPasos() {
    this.solicitudesService.obtenerPasos().subscribe(
      (pasos: Pasos[]) => {
        this.pasos = pasos;
      },
      (error: any) => {
        console.error('Error al obtener los pasos de seguimiento', error);
      }
    );
  }

  guardarSeguimiento() {
    if (this.selectedFile) {
      // Obtén los valores del formulario utilizando this.seguimientoForm.value
      const formData = new FormData();
      formData.append('fecha_asignacion', this.seguimientoForm.value.fecha_asignacion);
      formData.append('fecha_programacion', this.seguimientoForm.value.fecha_programacion);
      formData.append('fecha_evaluacion', this.seguimientoForm.value.fecha_evaluacion);
      formData.append('status', 'true');
      formData.append('solicitudId', this.seguimientoForm.value.solicitudId.toString());
      formData.append('pasos_seguimiento', this.seguimientoForm.value.pasos_seguimiento.toString());
      formData.append('estado_seguimiento', this.seguimientoForm.value.estado_seguimiento.toString());
      formData.append('responsableId', this.seguimientoForm.value.responsableId.toString());
      formData.append('correciones', this.selectedFile);

      this.solicitudesService.crearSeguimiento(formData).subscribe(
        (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Seguimiento creado correctamente' });
          this.limpiarFormulario();
        },
        (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el seguimiento' });
          console.error('Error al crear el seguimiento', error);
        }
      );
    }
  }
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.archivoSeleccionado = event.target.files[0].name;
  }

  onFileSelectedFormato(event: any) {
    this.selectedFileFormato = event.target.files[0];
    this.archivoSeleccionadoFormato = event.target.files[0].name;
  }

  limpiarFormulario() {
    this.seguimiento = {
      id: 0,
      fecha_asignacion: '',
      formato_evaluacion: '',
      fecha_programacion: '',
      fecha_evaluacion: '',
      correciones: '',
      status: true,
      solicitudId: 0,
      pasos_seguimiento: 0,
      estado_seguimiento: 0,
      responsableId: 0,
    };
    this.seguimientoForm.reset({});
    this.selectedFile = null;
  }
}
