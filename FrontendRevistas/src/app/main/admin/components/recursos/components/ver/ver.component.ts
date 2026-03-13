import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { RecursosService } from 'src/app/core/services/admin/recursos.service';

type ViewType = 'table' | 'cards';
type DialogType = 'create' | 'edit' | 'delete' | '';

interface ResourceItem {
  id: number;
  titulo: string;
  path: string;
  id_padre: number | null;
  method: string;
  icono: string;
  link: string;
  createdAt?: string;
  updateAt?: string;
}

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  resources: ResourceItem[] = [];
  filteredResources: ResourceItem[] = [];

  selectedResource: ResourceItem = this.getEmptyResource();

  currentView: ViewType = 'table';
  dialogVisible = false;
  dialogType: DialogType = '';
  dialogHeader = '';

  searchText = '';
  cargandoVista = true;
  guardandoRecurso = false;
  eliminandoRecurso = false;

  constructor(
    private recursosService: RecursosService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.loadResources();
  }

  get totalResources(): number {
    return this.resources.length;
  }

  get totalRootResources(): number {
    return this.resources.filter(r => !r.id_padre || r.id_padre === 0).length;
  }

  get totalWithLink(): number {
    return this.resources.filter(r => !!r.link?.trim()).length;
  }

  get formularioValido(): boolean {
    return !!this.selectedResource.titulo?.trim();
  }

  getEmptyResource(): ResourceItem {
    return {
      id: 0,
      titulo: '',
      path: '',
      id_padre: null,
      method: '',
      icono: '',
      link: ''
    };
  }

  private normalizarTexto(valor: string | number | null | undefined): string {
    return String(valor ?? '').toLowerCase().trim();
  }

  private ordenarResources(data: ResourceItem[]): ResourceItem[] {
    return [...data].sort((a, b) => {
      const tituloA = (a.titulo || '').toLowerCase();
      const tituloB = (b.titulo || '').toLowerCase();
      return tituloA.localeCompare(tituloB);
    });
  }

  toggleView(view: ViewType): void {
    this.currentView = view;
  }

  loadResources(): void {
    this.cargandoVista = true;

    this.recursosService.getResources().subscribe({
      next: (data: ResourceItem[]) => {
        this.resources = this.ordenarResources(data || []);
        this.filteredResources = [...this.resources];
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar recursos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar los recursos.'
        });
        this.cargandoVista = false;
      }
    });
  }

  buscarRecursos(): void {
    const termino = this.normalizarTexto(this.searchText);

    if (!termino) {
      this.filteredResources = [...this.resources];
      return;
    }

    this.filteredResources = this.resources.filter((resource) => {
      const titulo = this.normalizarTexto(resource.titulo);
      const path = this.normalizarTexto(resource.path);
      const padre = this.normalizarTexto(resource.id_padre);
      const method = this.normalizarTexto(resource.method);
      const icono = this.normalizarTexto(resource.icono);
      const link = this.normalizarTexto(resource.link);

      return (
        titulo.includes(termino) ||
        path.includes(termino) ||
        padre.includes(termino) ||
        method.includes(termino) ||
        icono.includes(termino) ||
        link.includes(termino)
      );
    });
  }

  showCreateDialog(): void {
    this.dialogType = 'create';
    this.dialogHeader = 'Crear recurso';
    this.selectedResource = this.getEmptyResource();
    this.dialogVisible = true;
  }

  showEditDialog(resource: ResourceItem): void {
    this.dialogType = 'edit';
    this.dialogHeader = 'Editar recurso';
    this.selectedResource = { ...resource };
    this.dialogVisible = true;
  }

  showDeleteDialog(resource: ResourceItem): void {
    this.dialogType = 'delete';
    this.dialogHeader = 'Eliminar recurso';
    this.selectedResource = { ...resource };
    this.dialogVisible = true;
  }

  saveResource(): void {
    if (!this.formularioValido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Debes ingresar al menos el título del recurso.'
      });
      return;
    }

    this.guardandoRecurso = true;

    const payload = {
      titulo: this.selectedResource.titulo?.trim() || '',
      path: this.selectedResource.path?.trim() || '',
      id_padre: this.selectedResource.id_padre || 0,
      method: this.selectedResource.method?.trim() || '',
      icono: this.selectedResource.icono?.trim() || '',
      link: this.selectedResource.link?.trim() || ''
    };

    if (this.dialogType === 'create') {
      this.recursosService.createResource(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Recurso creado',
            detail: 'El recurso fue creado exitosamente.'
          });
          this.closeDialog();
          this.loadResources();
          this.guardandoRecurso = false;
        },
        error: (error) => {
          console.error('Error al crear recurso:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible crear el recurso.'
          });
          this.guardandoRecurso = false;
        }
      });
      return;
    }

    if (this.dialogType === 'edit') {
      this.recursosService.updateResource(this.selectedResource.id, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Recurso actualizado',
            detail: 'El recurso fue actualizado exitosamente.'
          });
          this.closeDialog();
          this.loadResources();
          this.guardandoRecurso = false;
        },
        error: (error) => {
          console.error('Error al actualizar recurso:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible actualizar el recurso.'
          });
          this.guardandoRecurso = false;
        }
      });
    }
  }

  deleteResource(id: number): void {
    this.eliminandoRecurso = true;

    this.recursosService.deleteResource(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Recurso eliminado',
          detail: 'El recurso fue eliminado exitosamente.'
        });
        this.closeDialog();
        this.loadResources();
        this.eliminandoRecurso = false;
      },
      error: (error) => {
        console.error('Error al eliminar recurso:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible eliminar el recurso.'
        });
        this.eliminandoRecurso = false;
      }
    });
  }

  getResourceType(resource: ResourceItem): string {
    return !resource.id_padre || resource.id_padre === 0 ? 'Raíz' : 'Hijo';
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.dialogType = '';
    this.dialogHeader = '';
    this.selectedResource = this.getEmptyResource();
  }
}