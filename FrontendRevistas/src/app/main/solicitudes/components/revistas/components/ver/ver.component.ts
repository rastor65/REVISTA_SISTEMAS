import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { Revistas } from 'src/app/models/solicitudes';

type ViewType = 'table' | 'cards';
type DialogType = 'create' | 'edit' | 'delete' | '';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  revistas: Revistas[] = [];
  filteredRevistas: Revistas[] = [];

  revistaSeleccionada: Revistas = this.getEmptyRevista();

  dialogVisible = false;
  dialogType: DialogType = '';
  dialogHeader = '';

  currentView: ViewType = 'table';
  searchText = '';

  cargandoVista = true;
  guardandoRevista = false;
  eliminandoRevista = false;

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerRevistas();
  }

  get totalRevistas(): number {
    return this.revistas.length;
  }

  get totalActivas(): number {
    return this.revistas.filter((revista) => revista.status !== false).length;
  }

  get totalInactivas(): number {
    return this.revistas.filter((revista) => revista.status === false).length;
  }

  get formularioValido(): boolean {
    return !!this.revistaSeleccionada.nombre?.trim();
  }

  getEmptyRevista(): Revistas {
    return {
      id: 0,
      nombre: '',
      status: true
    };
  }

  toggleView(view: ViewType): void {
    this.currentView = view;
  }

  obtenerRevistas(): void {
    this.cargandoVista = true;

    this.solicitudesService.obtenerRevistas().subscribe({
      next: (response) => {
        this.revistas = [...response].sort((a, b) =>
          (a.nombre || '').localeCompare(b.nombre || '')
        );
        this.filteredRevistas = [...this.revistas];
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al obtener las revistas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar las revistas.'
        });
        this.cargandoVista = false;
      }
    });
  }

  buscarRevistas(): void {
    const term = this.searchText.trim().toLowerCase();

    if (!term) {
      this.filteredRevistas = [...this.revistas];
      return;
    }

    this.filteredRevistas = this.revistas.filter((revista) => {
      const nombre = (revista.nombre || '').toLowerCase();
      const estado = revista.status === false ? 'inactiva' : 'activa';
      const id = String(revista.id || '');
      return (
        nombre.includes(term) ||
        estado.includes(term) ||
        id.includes(term)
      );
    });
  }

  showCreateDialog(): void {
    this.dialogType = 'create';
    this.dialogHeader = 'Crear revista';
    this.revistaSeleccionada = this.getEmptyRevista();
    this.dialogVisible = true;
  }

  showEditDialog(revista: Revistas): void {
    this.dialogType = 'edit';
    this.dialogHeader = 'Editar revista';
    this.revistaSeleccionada = { ...revista };
    this.dialogVisible = true;
  }

  showDeleteDialog(revista: Revistas): void {
    this.dialogType = 'delete';
    this.dialogHeader = 'Desactivar revista';
    this.revistaSeleccionada = { ...revista };
    this.dialogVisible = true;
  }

  saveRevista(): void {
    if (!this.formularioValido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Debes ingresar el nombre de la revista.'
      });
      return;
    }

    this.guardandoRevista = true;

    const payload: Revistas = {
      ...this.revistaSeleccionada,
      nombre: this.revistaSeleccionada.nombre.trim(),
      status: this.revistaSeleccionada.status !== false
    };

    if (this.dialogType === 'create') {
      this.solicitudesService.guardarRevistas(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Revista creada',
            detail: 'La revista se creó exitosamente.'
          });
          this.closeDialog();
          this.obtenerRevistas();
          this.guardandoRevista = false;
        },
        error: (error) => {
          console.error('Error al crear revista:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible crear la revista.'
          });
          this.guardandoRevista = false;
        }
      });
      return;
    }

    if (this.dialogType === 'edit') {
      this.solicitudesService.actualizarRevista(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Revista actualizada',
            detail: 'La revista se actualizó correctamente.'
          });
          this.closeDialog();
          this.obtenerRevistas();
          this.guardandoRevista = false;
        },
        error: (error) => {
          console.error('Error al actualizar revista:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible actualizar la revista.'
          });
          this.guardandoRevista = false;
        }
      });
    }
  }

  desactivarRevista(): void {
    this.eliminandoRevista = true;

    const payload: Revistas = {
      ...this.revistaSeleccionada,
      status: false
    };

    this.solicitudesService.actualizarRevista(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Revista desactivada',
          detail: 'La revista fue desactivada correctamente.'
        });
        this.closeDialog();
        this.obtenerRevistas();
        this.eliminandoRevista = false;
      },
      error: (error) => {
        console.error('Error al desactivar revista:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible desactivar la revista.'
        });
        this.eliminandoRevista = false;
      }
    });
  }

  getEstadoTexto(revista: Revistas): string {
    return revista.status === false ? 'Inactiva' : 'Activa';
  }

  getEstadoClase(revista: Revistas): string {
    return revista.status === false ? 'status-inactive' : 'status-active';
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.dialogType = '';
    this.dialogHeader = '';
    this.revistaSeleccionada = this.getEmptyRevista();
  }
}