import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';

import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { MessageService } from 'primeng/api';

import { Person } from 'src/app/models/user/person';
import { Estado, Pasos, Solicitud } from 'src/app/models/solicitudes';

@Component({
  selector: 'app-crear-seguimiento',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  seguimientoForm: FormGroup;

  solicitudes: Solicitud[] = [];
  responsables: Person[] = [];
  pasos: Pasos[] = [];
  estados: Estado[] = [];

  selectedFile: File | null = null;
  selectedFileFormato: File | null = null;

  archivoSeleccionado = '';
  archivoSeleccionadoFormato = '';

  cargandoCatalogos = true;
  guardandoSeguimiento = false;

  constructor(
    private solicitudesService: SolicitudesService,
    private userService: UserService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.seguimientoForm = this.formBuilder.group({
      solicitudId: [0, [Validators.required, Validators.min(1)]],
      responsableId: [0, [Validators.required, Validators.min(1)]],
      pasos_seguimiento: [0, [Validators.required, Validators.min(1)]],
      estado_seguimiento: [0, [Validators.required, Validators.min(1)]],
      fecha_asignacion: ['', Validators.required],
      fecha_programacion: ['', Validators.required],
      fecha_evaluacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.setDefaultDates();
    this.cargarCatalogos();
  }

  get formularioValido(): boolean {
    return this.seguimientoForm.valid && !!this.selectedFile;
  }

  get solicitudSeleccionada(): Solicitud | undefined {
    const id = Number(this.seguimientoForm.get('solicitudId')?.value || 0);
    return this.solicitudes.find(item => item.id === id);
  }

  get responsableSeleccionado(): Person | undefined {
    const id = Number(this.seguimientoForm.get('responsableId')?.value || 0);
    return this.responsables.find(item => item.user === id);
  }

  get pasoSeleccionado(): Pasos | undefined {
    const id = Number(this.seguimientoForm.get('pasos_seguimiento')?.value || 0);
    return this.pasos.find(item => item.id === id);
  }

  get estadoSeleccionado(): Estado | undefined {
    const id = Number(this.seguimientoForm.get('estado_seguimiento')?.value || 0);
    return this.estados.find(item => item.id === id);
  }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  setDefaultDates(): void {
    const hoy = this.today;
    this.seguimientoForm.patchValue({
      fecha_asignacion: hoy,
      fecha_programacion: hoy,
      fecha_evaluacion: hoy
    });
  }

  cargarCatalogos(): void {
    this.cargandoCatalogos = true;

    forkJoin({
      solicitudes: this.solicitudesService.obtenerSolicitudes(),
      responsables: this.userService.ObtenerUsuarios(),
      pasos: this.solicitudesService.obtenerPasos(),
      estados: this.solicitudesService.obtenerEstados()
    })
      .pipe(finalize(() => (this.cargandoCatalogos = false)))
      .subscribe({
        next: ({ solicitudes, responsables, pasos, estados }) => {
          this.solicitudes = (solicitudes || []).filter(item => item.status !== false);
          this.responsables = responsables || [];
          this.pasos = (pasos || []).sort((a, b) => Number(a.nivel) - Number(b.nivel));
          this.estados = estados || [];
        },
        error: (error) => {
          console.error('Error al cargar catálogos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible cargar la información del formulario.'
          });
        }
      });
  }

  isInvalid(controlName: string): boolean {
    const control = this.seguimientoForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onPasoChange(): void {
    this.sugerirFechasSegunPaso();
  }

  onFechaAsignacionChange(): void {
    this.sugerirFechasSegunPaso();
  }

  sugerirFechasSegunPaso(): void {
    const pasoId = Number(this.seguimientoForm.get('pasos_seguimiento')?.value || 0);
    const fechaAsignacion = this.seguimientoForm.get('fecha_asignacion')?.value;

    if (!pasoId || !fechaAsignacion) {
      return;
    }

    const paso = this.pasos.find(item => item.id === pasoId);
    const diasPaso = Number(paso?.dias_programacion || 0);

    if (Number.isNaN(diasPaso)) {
      return;
    }

    const base = new Date(`${fechaAsignacion}T00:00:00`);
    const programacion = new Date(base);
    programacion.setDate(programacion.getDate() + diasPaso);

    const evaluacion = new Date(programacion);
    evaluacion.setDate(evaluacion.getDate() + 1);

    this.seguimientoForm.patchValue({
      fecha_programacion: programacion.toISOString().split('T')[0],
      fecha_evaluacion: evaluacion.toISOString().split('T')[0]
    });
  }

  onFileSelected(event: any): void {
    const file = event?.target?.files?.[0] || null;

    if (!file) {
      this.selectedFile = null;
      this.archivoSeleccionado = '';
      return;
    }

    if (file.type !== 'application/pdf') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo inválido',
        detail: 'El archivo de correcciones debe estar en formato PDF.'
      });
      event.target.value = '';
      return;
    }

    this.selectedFile = file;
    this.archivoSeleccionado = file.name;
  }

  onFileSelectedFormato(event: any): void {
    const file = event?.target?.files?.[0] || null;

    if (!file) {
      this.selectedFileFormato = null;
      this.archivoSeleccionadoFormato = '';
      return;
    }

    if (file.type !== 'application/pdf') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo inválido',
        detail: 'El formato de evaluación debe estar en PDF.'
      });
      event.target.value = '';
      return;
    }

    this.selectedFileFormato = file;
    this.archivoSeleccionadoFormato = file.name;
  }

  quitarArchivoCorrecciones(): void {
    this.selectedFile = null;
    this.archivoSeleccionado = '';
  }

  quitarArchivoFormato(): void {
    this.selectedFileFormato = null;
    this.archivoSeleccionadoFormato = '';
  }

  guardarSeguimiento(): void {
    if (this.seguimientoForm.invalid) {
      this.seguimientoForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Completa todos los campos obligatorios.'
      });
      return;
    }

    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo requerido',
        detail: 'Debes adjuntar el archivo de correcciones.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('fecha_asignacion', this.seguimientoForm.value.fecha_asignacion);
    formData.append('fecha_programacion', this.seguimientoForm.value.fecha_programacion);
    formData.append('fecha_evaluacion', this.seguimientoForm.value.fecha_evaluacion);
    formData.append('status', 'true');
    formData.append('solicitudId', String(this.seguimientoForm.value.solicitudId));
    formData.append('pasos_seguimiento', String(this.seguimientoForm.value.pasos_seguimiento));
    formData.append('estado_seguimiento', String(this.seguimientoForm.value.estado_seguimiento));
    formData.append('responsableId', String(this.seguimientoForm.value.responsableId));
    formData.append('correciones', this.selectedFile);

    if (this.selectedFileFormato) {
      formData.append('formato_evaluacion', this.selectedFileFormato);
    }

    this.guardandoSeguimiento = true;

    this.solicitudesService.crearSeguimiento(formData)
      .pipe(finalize(() => (this.guardandoSeguimiento = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Seguimiento creado',
            detail: 'El seguimiento adicional se registró correctamente.'
          });
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al crear seguimiento:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible crear el seguimiento.'
          });
        }
      });
  }

  limpiarFormulario(): void {
    this.seguimientoForm.reset({
      solicitudId: 0,
      responsableId: 0,
      pasos_seguimiento: 0,
      estado_seguimiento: 0,
      fecha_asignacion: this.today,
      fecha_programacion: this.today,
      fecha_evaluacion: this.today
    });

    this.selectedFile = null;
    this.selectedFileFormato = null;
    this.archivoSeleccionado = '';
    this.archivoSeleccionadoFormato = '';
  }
}