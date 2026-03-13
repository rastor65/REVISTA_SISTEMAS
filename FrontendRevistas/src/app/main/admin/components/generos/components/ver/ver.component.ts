import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TablasTipoService } from 'src/app/core/services/auth/tablas-tipo.service';
import { GenderType } from 'src/app/models/user/person';

type FilterState = 'all' | 'active' | 'inactive';
type DialogMode = 'create' | 'edit';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  generos: GenderType[] = [];

  searchText = '';
  filterState: FilterState = 'all';

  cargando = true;
  guardando = false;
  eliminando = false;

  dialogVisible = false;
  deleteDialogVisible = false;
  dialogMode: DialogMode = 'create';

  generoForm: GenderType = this.createEmptyGenero();
  generoSeleccionado: GenderType | null = null;

  constructor(
    private generosService: TablasTipoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarGeneros();
  }

  createEmptyGenero(): GenderType {
    return {
      id: 0,
      name: '',
      status: true
    };
  }

  get dialogTitle(): string {
    return this.dialogMode === 'create'
      ? 'Crear género'
      : 'Editar género';
  }

  get totalGeneros(): number {
    return this.generos.length;
  }

  get totalActivos(): number {
    return this.generos.filter(g => !!g.status).length;
  }

  get totalInactivos(): number {
    return this.generos.filter(g => !g.status).length;
  }

  get filteredGeneros(): GenderType[] {
    let data = [...this.generos];

    const term = this.searchText.trim().toLowerCase();
    if (term) {
      data = data.filter(g =>
        (g.name || '').toLowerCase().includes(term)
      );
    }

    if (this.filterState === 'active') {
      data = data.filter(g => !!g.status);
    }

    if (this.filterState === 'inactive') {
      data = data.filter(g => !g.status);
    }

    return data;
  }

  cargarGeneros(): void {
    this.cargando = true;

    this.generosService.obtenerGeneros().subscribe({
      next: (data) => {
        this.generos = data || [];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar los géneros.'
        });
      }
    });
  }

  setFilter(state: FilterState): void {
    this.filterState = state;
  }

  clearSearch(): void {
    this.searchText = '';
    this.filterState = 'all';
  }

  openCreateDialog(): void {
    this.dialogMode = 'create';
    this.generoForm = this.createEmptyGenero();
    this.dialogVisible = true;
  }

  openEditDialog(genero: GenderType): void {
    this.dialogMode = 'edit';
    this.generoForm = { ...genero };
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.generoForm = this.createEmptyGenero();
  }

  saveGenero(): void {
    const nombre = (this.generoForm.name || '').trim();

    if (!nombre) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Debes ingresar el nombre del género.'
      });
      return;
    }

    this.guardando = true;

    const payload: GenderType = {
      ...this.generoForm,
      name: nombre
    };

    if (this.dialogMode === 'create') {
      this.generosService.createGeneros(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.closeDialog();
          this.cargarGeneros();
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'El género fue creado correctamente.'
          });
        },
        error: (error) => {
          console.error('Error al crear género:', error);
          this.guardando = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible crear el género.'
          });
        }
      });

      return;
    }

    this.generosService.editarGeneros(payload).subscribe({
      next: () => {
        this.guardando = false;
        this.closeDialog();
        this.cargarGeneros();
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'El género fue actualizado correctamente.'
        });
      },
      error: (error) => {
        console.error('Error al editar género:', error);
        this.guardando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible actualizar el género.'
        });
      }
    });
  }

  openDeleteDialog(genero: GenderType): void {
    this.generoSeleccionado = genero;
    this.deleteDialogVisible = true;
  }

  closeDeleteDialog(): void {
    this.deleteDialogVisible = false;
    this.generoSeleccionado = null;
  }

  deleteGenero(): void {
    if (!this.generoSeleccionado?.id) {
      return;
    }

    this.eliminando = true;

    this.generosService.eliminarGeneros(this.generoSeleccionado.id).subscribe({
      next: () => {
        this.eliminando = false;
        this.closeDeleteDialog();
        this.cargarGeneros();
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'El género fue eliminado correctamente.'
        });
      },
      error: (error) => {
        console.error('Error al eliminar género:', error);
        this.eliminando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible eliminar el género.'
        });
      }
    });
  }
}