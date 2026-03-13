import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Estado } from 'src/app/models/solicitudes';

type ViewType = 'table' | 'cards';
type DialogType = 'create' | 'edit' | 'delete' | '';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  estados: Estado[] = [];
  filteredEstados: Estado[] = [];

  estadoSeleccionado: Estado = this.getEmptyEstado();

  dialogVisible = false;
  dialogType: DialogType = '';
  dialogHeader = '';

  currentView: ViewType = 'table';
  searchText = '';

  cargandoVista = true;
  guardandoEstado = false;
  eliminandoEstado = false;

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarEstados();
  }

  get totalEstados(): number {
    return this.estados.length;
  }

  get totalActivos(): number {
    return this.estados.filter((estado) => estado.status !== false).length;
  }

  get totalInactivos(): number {
    return this.estados.filter((estado) => estado.status === false).length;
  }

  get formularioValido(): boolean {
    return !!this.estadoSeleccionado.nombre?.trim() && !!this.estadoSeleccionado.descripcion?.trim();
  }

  getEmptyEstado(): Estado {
    return {
      id: 0,
      nombre: '',
      descripcion: '',
      status: true
    };
  }

  toggleView(view: ViewType): void {
    this.currentView = view;
  }

  cargarEstados(): void {
    this.cargandoVista = true;

    this.solicitudesService.obtenerEstados().subscribe({
      next: (response) => {
        this.estados = [...response].sort((a, b) =>
          (a.nombre || '').localeCompare(b.nombre || '')
        );
        this.filteredEstados = [...this.estados];
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar estados:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar los estados.'
        });
        this.cargandoVista = false;
      }
    });
  }

  buscarEstados(): void {
    const term = this.searchText.trim().toLowerCase();

    if (!term) {
      this.filteredEstados = [...this.estados];
      return;
    }

    this.filteredEstados = this.estados.filter((estado) => {
      const nombre = (estado.nombre || '').toLowerCase();
      const descripcion = (estado.descripcion || '').toLowerCase();
      const estadoTexto = estado.status === false ? 'inactivo' : 'activo';
      const id = String(estado.id || '');

      return (
        nombre.includes(term) ||
        descripcion.includes(term) ||
        estadoTexto.includes(term) ||
        id.includes(term)
      );
    });
  }

  showCreateDialog(): void {
    this.dialogType = 'create';
    this.dialogHeader = 'Crear estado';
    this.estadoSeleccionado = this.getEmptyEstado();
    this.dialogVisible = true;
  }

  showEditDialog(estado: Estado): void {
    this.dialogType = 'edit';
    this.dialogHeader = 'Editar estado';
    this.estadoSeleccionado = { ...estado };
    this.dialogVisible = true;
  }

  showDeleteDialog(estado: Estado): void {
    this.dialogType = 'delete';
    this.dialogHeader = 'Eliminar estado';
    this.estadoSeleccionado = { ...estado };
    this.dialogVisible = true;
  }

  saveEstado(): void {
    if (!this.formularioValido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Debes completar el nombre y la descripción.'
      });
      return;
    }

    this.guardandoEstado = true;

    const payload: Estado = {
      ...this.estadoSeleccionado,
      nombre: this.estadoSeleccionado.nombre.trim(),
      descripcion: this.estadoSeleccionado.descripcion.trim(),
      status: this.estadoSeleccionado.status !== false
    };

    if (this.dialogType === 'create') {
      this.solicitudesService.crearEstado(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Estado creado',
            detail: 'El estado se creó correctamente.'
          });
          this.closeDialog();
          this.cargarEstados();
          this.guardandoEstado = false;
        },
        error: (error) => {
          console.error('Error al crear estado:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible crear el estado.'
          });
          this.guardandoEstado = false;
        }
      });
      return;
    }

    if (this.dialogType === 'edit') {
      this.solicitudesService.actualizarEstado(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Estado actualizado',
            detail: 'El estado se actualizó correctamente.'
          });
          this.closeDialog();
          this.cargarEstados();
          this.guardandoEstado = false;
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible actualizar el estado.'
          });
          this.guardandoEstado = false;
        }
      });
    }
  }

  eliminarEstado(): void {
    if (!this.estadoSeleccionado?.id) {
      return;
    }

    this.eliminandoEstado = true;

    this.solicitudesService.eliminarEstado(this.estadoSeleccionado.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Estado eliminado',
          detail: 'El estado fue eliminado correctamente.'
        });
        this.closeDialog();
        this.cargarEstados();
        this.eliminandoEstado = false;
      },
      error: (error) => {
        console.error('Error al eliminar estado:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible eliminar el estado.'
        });
        this.eliminandoEstado = false;
      }
    });
  }

  getEstadoTexto(estado: Estado): string {
    return estado.status === false ? 'Inactivo' : 'Activo';
  }

  getEstadoClase(estado: Estado): string {
    return estado.status === false ? 'status-inactive' : 'status-active';
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.dialogType = '';
    this.dialogHeader = '';
    this.estadoSeleccionado = this.getEmptyEstado();
  }
}