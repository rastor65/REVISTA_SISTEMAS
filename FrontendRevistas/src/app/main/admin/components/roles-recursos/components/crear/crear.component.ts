import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { MessageService } from 'primeng/api';

import { RecursosService } from 'src/app/core/services/admin/recursos.service';
import { RolesService } from 'src/app/core/services/admin/roles.service';
import { RecursosRolesService } from 'src/app/core/services/admin/recursos-roles.service';

interface RoleItem {
  id: number;
  name: string;
}

interface ResourceItem {
  id: number;
  titulo: string;
  path?: string;
  link?: string;
  icono?: string;
  id_padre: number;
  children?: ResourceItem[];
}

interface FlatResourceItem extends ResourceItem {
  level: number;
}

interface ResourceRoleAssignment {
  id: number;
  resource: number;
  role: number;
}

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  roles: RoleItem[] = [];
  resources: ResourceItem[] = [];
  flatResources: FlatResourceItem[] = [];
  assignments: ResourceRoleAssignment[] = [];

  selectedRole = 0;
  searchText = '';

  cargandoVista = true;
  actualizandoAcceso = false;

  assignedRolesToResources: { [resourceId: number]: number[] } = {};
  assignmentIdMap: { [key: string]: number } = {};
  savingMap: { [key: string]: boolean } = {};

  constructor(
    private recursosService: RecursosService,
    private rolesService: RolesService,
    private recursosRolesService: RecursosRolesService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  get totalRoles(): number {
    return this.roles.length;
  }

  get totalResources(): number {
    return this.flatResources.length;
  }

  get totalAssignments(): number {
    return this.assignments.length;
  }

  get selectedRoleObject(): RoleItem | undefined {
    return this.roles.find(role => role.id === this.selectedRole);
  }

  get selectedRoleName(): string {
    return this.selectedRoleObject?.name || 'Sin rol seleccionado';
  }

  get assignedCountForSelectedRole(): number {
    if (!this.selectedRole) {
      return 0;
    }

    return this.flatResources.filter(resource =>
      this.hasAccess(this.selectedRole, resource.id)
    ).length;
  }

  get totalVisibleResources(): number {
    return this.filteredFlatResources.length;
  }

  get totalVisibleAssignedResources(): number {
    if (!this.selectedRole) {
      return 0;
    }

    return this.filteredFlatResources.filter(resource =>
      this.hasAccess(this.selectedRole, resource.id)
    ).length;
  }

  get totalRootResources(): number {
    return this.flatResources.filter(resource => resource.level === 0).length;
  }

  get totalChildResources(): number {
    return this.flatResources.filter(resource => resource.level === 1).length;
  }

  get totalNestedResources(): number {
    return this.flatResources.filter(resource => resource.level >= 2).length;
  }

  get filteredFlatResources(): FlatResourceItem[] {
    const term = (this.searchText || '').toLowerCase().trim();

    if (!term) {
      return this.flatResources;
    }

    return this.flatResources.filter((resource) => {
      const titulo = (resource.titulo || '').toLowerCase();
      const path = (resource.path || '').toLowerCase();
      const link = (resource.link || '').toLowerCase();

      return (
        titulo.includes(term) ||
        path.includes(term) ||
        link.includes(term)
      );
    });
  }

  cargarDatos(): void {
    this.cargandoVista = true;

    forkJoin({
      roles: this.rolesService.getRoles(),
      resources: this.recursosService.getResources(),
      assignments: this.recursosRolesService.getAssignedRolesToResources()
    }).subscribe({
      next: ({ roles, resources, assignments }) => {
        this.roles = roles || [];

        const jerarquia = this.buildResourceHierarchy(resources || []);
        this.resources = jerarquia;
        this.flatResources = this.flattenResources(jerarquia);

        this.assignments = assignments || [];
        this.refreshAssignmentMaps();

        if (!this.selectedRole && this.roles.length > 0) {
          this.selectedRole = this.roles[0].id;
        }

        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar roles, recursos o asignaciones:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar la información de roles y recursos.'
        });
        this.cargandoVista = false;
      }
    });
  }

  refreshAssignmentsOnly(): void {
    this.recursosRolesService.getAssignedRolesToResources().subscribe({
      next: (data) => {
        this.assignments = data || [];
        this.refreshAssignmentMaps();
      },
      error: (error) => {
        console.error('Error al actualizar asignaciones:', error);
      }
    });
  }

  refreshAssignmentMaps(): void {
    this.assignedRolesToResources = {};
    this.assignmentIdMap = {};

    for (const entry of this.assignments) {
      const resourceId = entry.resource;
      const roleId = entry.role;

      if (!this.assignedRolesToResources[resourceId]) {
        this.assignedRolesToResources[resourceId] = [];
      }

      this.assignedRolesToResources[resourceId].push(roleId);
      this.assignmentIdMap[this.getAssignmentKey(roleId, resourceId)] = entry.id;
    }
  }

  buildResourceHierarchy(resources: ResourceItem[]): ResourceItem[] {
    const resourceMap: { [id: number]: ResourceItem } = {};
    const hierarchy: ResourceItem[] = [];

    resources.forEach((resource) => {
      resourceMap[resource.id] = { ...resource, children: [] };
    });

    Object.values(resourceMap).forEach((resource) => {
      if (!resource.id_padre || resource.id_padre === 0) {
        hierarchy.push(resource);
      } else {
        const parent = resourceMap[resource.id_padre];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(resource);
        } else {
          hierarchy.push(resource);
        }
      }
    });

    return hierarchy;
  }

  flattenResources(resources: ResourceItem[], level: number = 0): FlatResourceItem[] {
    let flattened: FlatResourceItem[] = [];

    for (const resource of resources) {
      flattened.push({
        ...resource,
        level
      });

      if (resource.children && resource.children.length > 0) {
        flattened = flattened.concat(this.flattenResources(resource.children, level + 1));
      }
    }

    return flattened;
  }

  getAssignmentKey(roleId: number, resourceId: number): string {
    return `${roleId}_${resourceId}`;
  }

  hasAccess(roleId: number, resourceId: number): boolean {
    const assignedRoles = this.assignedRolesToResources?.[resourceId] || [];
    return assignedRoles.includes(roleId);
  }

  isSavingAccess(roleId: number, resourceId: number): boolean {
    return !!this.savingMap[this.getAssignmentKey(roleId, resourceId)];
  }

  selectRole(roleId: number): void {
    this.selectedRole = roleId;
  }

  clearSearch(): void {
    this.searchText = '';
  }

  getAssignedCountByRole(roleId: number): number {
    return this.flatResources.filter(resource => this.hasAccess(roleId, resource.id)).length;
  }

  onAccessChange(resource: FlatResourceItem, event: Event): void {
    if (!this.selectedRole) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Selecciona un rol',
        detail: 'Debes seleccionar un rol antes de asignar recursos.'
      });
      return;
    }

    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    this.toggleResourceAccess(resource, checked);
  }

  toggleResourceAccess(resource: FlatResourceItem, checked: boolean): void {
    const roleId = this.selectedRole;
    const resourceId = resource.id;
    const key = this.getAssignmentKey(roleId, resourceId);

    if (!roleId || !resourceId) {
      return;
    }

    this.savingMap[key] = true;

    if (checked) {
      if (this.hasAccess(roleId, resourceId)) {
        this.savingMap[key] = false;
        return;
      }

      this.recursosRolesService.assignResourceToRole(resourceId, roleId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Acceso asignado',
            detail: `El recurso "${resource.titulo}" fue asignado al rol.`
          });
          this.refreshAssignmentsOnly();
          this.savingMap[key] = false;
        },
        error: (error) => {
          console.error('Error al asignar recurso al rol:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible asignar el recurso al rol.'
          });
          this.savingMap[key] = false;
        }
      });

      return;
    }

    const relationId = this.assignmentIdMap[key];

    if (!relationId) {
      this.savingMap[key] = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Asignación no encontrada',
        detail: 'No se encontró la relación entre el rol y el recurso.'
      });
      return;
    }

    this.recursosRolesService.deleteResourceFromRole(relationId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Acceso retirado',
          detail: `El recurso "${resource.titulo}" fue retirado del rol.`
        });
        this.refreshAssignmentsOnly();
        this.savingMap[key] = false;
      },
      error: (error) => {
        console.error('Error al eliminar la relación rol-recurso:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible retirar el recurso del rol.'
        });
        this.savingMap[key] = false;
      }
    });
  }

  toggleVisibleResources(checked: boolean): void {
    if (!this.selectedRole) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Selecciona un rol',
        detail: 'Debes seleccionar un rol antes de hacer cambios masivos.'
      });
      return;
    }

    const visibles = this.filteredFlatResources.filter(resource =>
      this.hasAccess(this.selectedRole, resource.id) !== checked
    );

    if (!visibles.length) {
      this.messageService.add({
        severity: 'info',
        summary: 'Sin cambios',
        detail: checked
          ? 'Todos los recursos visibles ya están asignados.'
          : 'Todos los recursos visibles ya están desasignados.'
      });
      return;
    }

    this.actualizandoAcceso = true;

    const operaciones = visibles.map((resource) => {
      if (checked) {
        return this.recursosRolesService.assignResourceToRole(resource.id, this.selectedRole);
      }

      const relationId = this.assignmentIdMap[this.getAssignmentKey(this.selectedRole, resource.id)];
      return relationId ? this.recursosRolesService.deleteResourceFromRole(relationId) : of(null);
    });

    forkJoin(operaciones).subscribe({
      next: () => {
        this.refreshAssignmentsOnly();
        this.actualizandoAcceso = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Actualización masiva',
          detail: checked
            ? 'Se asignaron los recursos visibles al rol.'
            : 'Se retiraron los recursos visibles del rol.'
        });
      },
      error: (error) => {
        console.error('Error en actualización masiva:', error);
        this.actualizandoAcceso = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible completar la actualización masiva.'
        });
      }
    });
  }

  getLevelLabel(level: number): string {
    if (level === 0) return 'Raíz';
    if (level === 1) return 'Hijo';
    if (level === 2) return 'Nieto';
    return `Nivel ${level + 1}`;
  }

  getFallbackIcon(resource: FlatResourceItem): string {
    return resource.icono || 'pi pi-folder';
  }
}