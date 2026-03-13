import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TablasTipoService } from 'src/app/core/services/auth/tablas-tipo.service';
import { DocumentType } from 'src/app/models/user/person';

type FilterState = 'all' | 'active' | 'inactive';
type DialogMode = 'create' | 'edit';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  documents: DocumentType[] = [];

  searchText = '';
  filterState: FilterState = 'all';

  cargando = true;
  guardando = false;
  eliminando = false;

  dialogVisible = false;
  deleteDialogVisible = false;
  dialogMode: DialogMode = 'create';

  documentoForm: DocumentType = this.createEmptyDocument();
  documentoSeleccionado: DocumentType | null = null;

  constructor(
    private documentsService: TablasTipoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  createEmptyDocument(): DocumentType {
    return {
      id: 0,
      createdAt: '',
      updateAt: '',
      name: '',
      status: true
    };
  }

  get dialogTitle(): string {
    return this.dialogMode === 'create'
      ? 'Crear tipo de documento'
      : 'Editar tipo de documento';
  }

  get totalDocuments(): number {
    return this.documents.length;
  }

  get totalActive(): number {
    return this.documents.filter(doc => !!doc.status).length;
  }

  get totalInactive(): number {
    return this.documents.filter(doc => !doc.status).length;
  }

  get filteredDocuments(): DocumentType[] {
    let data = [...this.documents];

    const term = this.searchText.trim().toLowerCase();
    if (term) {
      data = data.filter(doc =>
        (doc.name || '').toLowerCase().includes(term)
      );
    }

    if (this.filterState === 'active') {
      data = data.filter(doc => !!doc.status);
    }

    if (this.filterState === 'inactive') {
      data = data.filter(doc => !doc.status);
    }

    return data;
  }

  loadDocuments(): void {
    this.cargando = true;

    this.documentsService.getDocuments().subscribe({
      next: (data) => {
        this.documents = data || [];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar tipos de documento:', error);
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar los tipos de documento.'
        });
      }
    });
  }

  setFilter(state: FilterState): void {
    this.filterState = state;
  }

  clearSearch(): void {
    this.searchText = '';
  }

  openCreateDialog(): void {
    this.dialogMode = 'create';
    this.documentoForm = this.createEmptyDocument();
    this.dialogVisible = true;
  }

  openEditDialog(documento: DocumentType): void {
    this.dialogMode = 'edit';
    this.documentoForm = {
      ...documento
    };
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.documentoForm = this.createEmptyDocument();
  }

  saveDocument(): void {
    const nombre = (this.documentoForm.name || '').trim();

    if (!nombre) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Debes ingresar el nombre del tipo de documento.'
      });
      return;
    }

    this.guardando = true;

    const payload: DocumentType = {
      ...this.documentoForm,
      name: nombre
    };

    if (this.dialogMode === 'create') {
      this.documentsService.createDocument(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.closeDialog();
          this.loadDocuments();
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'El tipo de documento fue creado correctamente.'
          });
        },
        error: (error) => {
          console.error('Error al crear tipo de documento:', error);
          this.guardando = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible crear el tipo de documento.'
          });
        }
      });

      return;
    }

    this.documentsService.editarDocumento(payload).subscribe({
      next: () => {
        this.guardando = false;
        this.closeDialog();
        this.loadDocuments();
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'El tipo de documento fue actualizado correctamente.'
        });
      },
      error: (error) => {
        console.error('Error al editar tipo de documento:', error);
        this.guardando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible actualizar el tipo de documento.'
        });
      }
    });
  }

  openDeleteDialog(documento: DocumentType): void {
    this.documentoSeleccionado = documento;
    this.deleteDialogVisible = true;
  }

  closeDeleteDialog(): void {
    this.deleteDialogVisible = false;
    this.documentoSeleccionado = null;
  }

  deleteDocument(): void {
    if (!this.documentoSeleccionado?.id) {
      return;
    }

    this.eliminando = true;

    this.documentsService.eliminarDocumento(this.documentoSeleccionado.id).subscribe({
      next: () => {
        this.eliminando = false;
        this.closeDeleteDialog();
        this.loadDocuments();
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'El tipo de documento fue eliminado correctamente.'
        });
      },
      error: (error) => {
        console.error('Error al eliminar tipo de documento:', error);
        this.eliminando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible eliminar el tipo de documento.'
        });
      }
    });
  }

  trackByDocument(index: number, item: DocumentType): number {
    return item.id;
  }
}