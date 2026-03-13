import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Pasos } from 'src/app/models/solicitudes';

type ViewType = 'table' | 'cards';
type FormMode = 'create' | 'edit';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  pasos: Pasos[] = [];
  filteredPasos: Pasos[] = [];

  currentView: ViewType = 'table';
  formMode: FormMode = 'create';

  cargandoVista = true;
  guardandoPaso = false;
  eliminandoPaso = false;

  formDialogVisible = false;
  deleteDialogVisible = false;

  searchText = '';

  pasoFormulario: Pasos = this.getEmptyPaso();
  pasoSeleccionado: Pasos | null = null;

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerPasos();
  }

  get totalPasos(): number {
    return this.pasos.length;
  }

  get totalActivos(): number {
    return this.pasos.filter(p => p.status !== false).length;
  }

  get totalInactivos(): number {
    return this.pasos.filter(p => p.status === false).length;
  }

  toggleView(view: ViewType): void {
    this.currentView = view;
  }

  getEmptyPaso(): Pasos {
    return {
      id: 0,
      nivel: 0,
      nombre: '',
      dias_programacion: '',
      status: true
    };
  }

  private normalizarTexto(valor: string | number | null | undefined): string {
    return String(valor ?? '').toLowerCase().trim();
  }

  private ordenarPasos(data: Pasos[]): Pasos[] {
    return [...data].sort((a, b) => Number(a.nivel) - Number(b.nivel));
  }

  obtenerPasos(): void {
    this.cargandoVista = true;

    this.solicitudesService.obtenerPasos().subscribe({
      next: (response) => {
        this.pasos = this.ordenarPasos(response || []);
        this.filteredPasos = [...this.pasos];
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al obtener pasos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar los pasos.'
        });
        this.cargandoVista = false;
      }
    });
  }

  buscarPasos(): void {
    const termino = this.normalizarTexto(this.searchText);

    if (!termino) {
      this.filteredPasos = [...this.pasos];
      return;
    }

    this.filteredPasos = this.pasos.filter((paso) => {
      const nivel = this.normalizarTexto(paso.nivel);
      const nombre = this.normalizarTexto(paso.nombre);
      const dias = this.normalizarTexto(paso.dias_programacion);
      const estado = paso.status === false ? 'inactivo' : 'activo';

      return (
        nivel.includes(termino) ||
        nombre.includes(termino) ||
        dias.includes(termino) ||
        estado.includes(termino)
      );
    });
  }

  abrirCrearPaso(): void {
    this.formMode = 'create';
    this.pasoFormulario = this.getEmptyPaso();
    this.formDialogVisible = true;
  }

  abrirEditarPaso(paso: Pasos): void {
    this.formMode = 'edit';
    this.pasoFormulario = { ...paso };
    this.formDialogVisible = true;
  }

  cerrarFormulario(): void {
    this.formDialogVisible = false;
    this.pasoFormulario = this.getEmptyPaso();
  }

  get formularioValido(): boolean {
    return (
      Number(this.pasoFormulario.nivel) > 0 &&
      !!this.pasoFormulario.nombre?.trim() &&
      String(this.pasoFormulario.dias_programacion).trim() !== ''
    );
  }

  guardarPaso(): void {
    if (!this.formularioValido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Completa nivel, nombre y días de programación.'
      });
      return;
    }

    this.guardandoPaso = true;

    const payload: Pasos = {
      ...this.pasoFormulario,
      nivel: Number(this.pasoFormulario.nivel),
      dias_programacion: String(this.pasoFormulario.dias_programacion).trim(),
      nombre: this.pasoFormulario.nombre.trim(),
      status: this.pasoFormulario.status !== false
    };

    const request$ = this.formMode === 'create'
      ? this.solicitudesService.guardarPasos(payload)
      : this.solicitudesService.actualizarPaso(payload);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.formMode === 'create' ? 'Paso creado' : 'Paso actualizado',
          detail: this.formMode === 'create'
            ? 'El paso fue creado exitosamente.'
            : 'El paso fue actualizado exitosamente.'
        });

        this.formDialogVisible = false;
        this.guardandoPaso = false;
        this.pasoFormulario = this.getEmptyPaso();
        this.obtenerPasos();
      },
      error: (error) => {
        console.error('Error al guardar paso:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible guardar el paso.'
        });
        this.guardandoPaso = false;
      }
    });
  }

  abrirEliminarPaso(paso: Pasos): void {
    this.pasoSeleccionado = { ...paso };
    this.deleteDialogVisible = true;
  }

  cerrarEliminarPaso(): void {
    this.deleteDialogVisible = false;
    this.pasoSeleccionado = null;
  }

  confirmarEliminarPaso(): void {
    if (!this.pasoSeleccionado) {
      return;
    }

    this.eliminandoPaso = true;

    const payload: Pasos = {
      ...this.pasoSeleccionado,
      status: false
    };

    this.solicitudesService.actualizarPaso(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Paso desactivado',
          detail: 'El paso fue desactivado exitosamente.'
        });

        this.deleteDialogVisible = false;
        this.eliminandoPaso = false;
        this.pasoSeleccionado = null;
        this.obtenerPasos();
      },
      error: (error) => {
        console.error('Error al desactivar paso:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible desactivar el paso.'
        });
        this.eliminandoPaso = false;
      }
    });
  }

  getEstadoClase(paso: Pasos): string {
    return paso.status === false ? 'status-inactive' : 'status-active';
  }

  getEstadoTexto(paso: Pasos): string {
    return paso.status === false ? 'Inactivo' : 'Activo';
  }
}