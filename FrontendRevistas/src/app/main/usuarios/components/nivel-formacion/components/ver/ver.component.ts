import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { NivelFormacion } from 'src/app/models/user/person';

type DialogMode = 'create' | 'edit';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  niveles: NivelFormacion[] = [];

  searchText = '';
  cargando = true;
  guardando = false;
  eliminando = false;

  dialogVisible = false;
  deleteDialogVisible = false;
  dialogMode: DialogMode = 'create';

  nivelForm: NivelFormacion = this.createEmptyNivel();
  nivelSeleccionado: NivelFormacion | null = null;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarNivelesFormacion();
  }

  createEmptyNivel(): NivelFormacion {
    return {
      id: 0,
      nombre: ''
    };
  }

  get dialogTitle(): string {
    return this.dialogMode === 'create'
      ? 'Crear nivel de formación'
      : 'Editar nivel de formación';
  }

  get totalNiveles(): number {
    return this.niveles.length;
  }

  get totalFiltrados(): number {
    return this.filteredNiveles.length;
  }

  get ultimoId(): number {
    if (!this.niveles.length) return 0;
    return Math.max(...this.niveles.map(n => n.id || 0));
  }

  get filteredNiveles(): NivelFormacion[] {
    const term = this.searchText.trim().toLowerCase();

    if (!term) {
      return [...this.niveles];
    }

    return this.niveles.filter(nivel =>
      (nivel.nombre || '').toLowerCase().includes(term)
    );
  }

  cargarNivelesFormacion(): void {
    this.cargando = true;

    this.userService.obtenerNivelesFormacion().subscribe({
      next: (data) => {
        this.niveles = data || [];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar los niveles de formación', error);
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los niveles de formación.'
        });
      }
    });
  }

  clearSearch(): void {
    this.searchText = '';
  }

  openCreateDialog(): void {
    this.dialogMode = 'create';
    this.nivelForm = this.createEmptyNivel();
    this.dialogVisible = true;
  }

  openEditDialog(nivel: NivelFormacion): void {
    this.dialogMode = 'edit';
    this.nivelForm = { ...nivel };
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.nivelForm = this.createEmptyNivel();
  }

  saveNivel(): void {
    const nombre = (this.nivelForm.nombre || '').trim();

    if (!nombre) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Debes ingresar el nombre del nivel de formación.'
      });
      return;
    }

    this.guardando = true;
    const payload: NivelFormacion = {
      ...this.nivelForm,
      nombre
    };

    if (this.dialogMode === 'create') {
      this.userService.crearNivelFormacion(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.closeDialog();
          this.cargarNivelesFormacion();
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'El nivel de formación fue creado correctamente.'
          });
        },
        error: (error) => {
          console.error('Error al crear nivel de formación', error);
          this.guardando = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible crear el nivel de formación.'
          });
        }
      });

      return;
    }

    this.userService.editarNivelFormacion(payload).subscribe({
      next: () => {
        this.guardando = false;
        this.closeDialog();
        this.cargarNivelesFormacion();
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'El nivel de formación fue actualizado correctamente.'
        });
      },
      error: (error) => {
        console.error('Error al editar nivel de formación', error);
        this.guardando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible actualizar el nivel de formación.'
        });
      }
    });
  }

  openDeleteDialog(nivel: NivelFormacion): void {
    this.nivelSeleccionado = nivel;
    this.deleteDialogVisible = true;
  }

  closeDeleteDialog(): void {
    this.deleteDialogVisible = false;
    this.nivelSeleccionado = null;
  }

  deleteNivel(): void {
    if (!this.nivelSeleccionado?.id) {
      return;
    }

    this.eliminando = true;

    this.userService.eliminarNivelFormacion(this.nivelSeleccionado.id).subscribe({
      next: () => {
        this.eliminando = false;
        this.closeDeleteDialog();
        this.cargarNivelesFormacion();
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'El nivel de formación fue eliminado correctamente.'
        });
      },
      error: (error) => {
        console.error('Error al eliminar nivel de formación', error);
        this.eliminando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible eliminar el nivel de formación.'
        });
      }
    });
  }
}