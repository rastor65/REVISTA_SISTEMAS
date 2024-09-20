import { Component, OnInit } from '@angular/core';
import { RecursosService } from 'src/app/core/services/admin/recursos.service';
import { RolesService } from 'src/app/core/services/admin/roles.service';
import { RecursosRolesService } from 'src/app/core/services/admin/recursos-roles.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})

export class CrearComponent implements OnInit {
  roles: any[] = [];
  resources: any[] = [];
  selectedRole: number = 0;
  selectedResource: number = 0;
  assignedRolesToResources: { [resourceId: number]: number[] } = {};

  constructor(
    private recursosService: RecursosService,
    private rolesService: RolesService,
    private recursosRolesService: RecursosRolesService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.cargarRolesRecursos();
  }

  cargarRolesRecursos() {
    this.rolesService.getRoles().subscribe(data => {
      this.roles = data;
    });

    this.recursosService.getResources().subscribe(data => {
      this.resources = this.buildResourceHierarchy(data);
      this.loadAssignedRolesToResources();
    });
  }

  agregarRecursoRol() {
    if (this.selectedRole && this.selectedResource) {

      // Envía una solicitud HTTP al servidor para agregar la relación
      this.recursosRolesService.assignResourceToRole(this.selectedResource, this.selectedRole).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Recurso agregado al rol.' });
          this.cargarRolesRecursos();
        },
        (error) => {
          console.error('Error del servidor:', error); // Mostrar el error del servidor en la consola
          // Manejar errores, por ejemplo, mostrar un mensaje de error
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el recurso al rol.' });
        }
      );
    }
  }

  eliminarRecursoRol(resourcesRoleId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta relación?')) {
      this.recursosRolesService.deleteResourceFromRole(resourcesRoleId).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Relación eliminada.' });
          // Actualizar la lista de relaciones o realizar alguna otra acción necesaria
        },
        (error) => {
          console.error('Error del servidor:', error); // Mostrar el error del servidor en la consola
          // Manejar errores, por ejemplo, mostrar un mensaje de error
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la relación.' });
        }
      );
    }
  }

  buildResourceHierarchy(resources: any[]): any[] {
    const resourceMap: { [id: number]: any } = {};
    const hierarchy: any[] = [];

    // Construye un mapa de recursos por su ID
    resources.forEach(resource => {
      resourceMap[resource.id] = resource;
      resource.children = [];
    });

    // Organiza los recursos en una estructura jerárquica
    resources.forEach(resource => {
      if (resource.id_padre === 0) {
        hierarchy.push(resource);
      } else {
        const parent = resourceMap[resource.id_padre];
        if (parent) {
          parent.children.push(resource);
        }
      }
    });

    return hierarchy;
  }

  flattenResources(resources: any[]): any[] {
    let flattened: any[] = [];

    for (const resource of resources) {
      flattened.push(resource);

      if (resource.children && resource.children.length > 0) {
        flattened = flattened.concat(this.flattenResources(resource.children));
      }
    }

    return flattened; // Corrección: retorna 'flattened' en lugar de llamar recursivamente a la función
  }

  get flattenedResources(): any[] {
    return this.flattenResources(this.resources);
  }

  loadAssignedRolesToResources() {
    this.recursosRolesService.getAssignedRolesToResources().subscribe(data => {
      for (const entry of data) {
        // Verifica si ya existe una entrada para este recurso en assignedRolesToResources
        if (!this.assignedRolesToResources[entry.resource]) {
          this.assignedRolesToResources[entry.resource] = [];
        }
        // Agrega el ID de rol a la lista de roles asignados para este recurso
        this.assignedRolesToResources[entry.resource].push(entry.role);
      }
    });
  }

  hasAccess(role: number, resource: number): boolean {
    // Obtener los IDs de roles asignados a este resourceId
    const assignedRoles = this.assignedRolesToResources?.[resource];

    // Verificar si el roleId está incluido en los roles asignados
    return assignedRoles && assignedRoles.includes(role);
  }

}
