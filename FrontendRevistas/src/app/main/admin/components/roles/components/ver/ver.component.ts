import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RolesService } from 'src/app/core/services/admin/roles.service';

type ViewType = 'table' | 'cards';
type DialogType = 'create' | 'edit' | 'delete' | '';

interface RoleItem {
  id: number;
  name: string;
  status?: boolean;
  createdAt?: string;
  updateAt?: string;
}

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  roles: RoleItem[] = [];
  filteredRoles: RoleItem[] = [];

  selectedRole: RoleItem = this.getEmptyRole();

  currentView: ViewType = 'cards';
  dialogVisible = false;
  dialogType: DialogType = '';
  dialogHeader = '';

  searchText = '';
  cargandoVista = true;
  guardandoRol = false;
  eliminandoRol = false;

  constructor(
    private rolesService: RolesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  get totalRoles(): number {
    return this.roles.length;
  }

  get totalActivos(): number {
    return this.roles.filter(role => role.status !== false).length;
  }

  get totalInactivos(): number {
    return this.roles.filter(role => role.status === false).length;
  }

  get formularioValido(): boolean {
    return !!this.selectedRole.name?.trim();
  }

  getEmptyRole(): RoleItem {
    return {
      id: 0,
      name: '',
      status: true
    };
  }

  private normalizarTexto(valor: string | null | undefined): string {
    return (valor || '').toLowerCase().trim();
  }

  private ordenarRoles(data: RoleItem[]): RoleItem[] {
    return [...data].sort((a, b) => {
      const fechaA = new Date(a.createdAt || '').getTime();
      const fechaB = new Date(b.createdAt || '').getTime();
      return fechaB - fechaA;
    });
  }

  toggleView(view: ViewType): void {
    this.currentView = view;
  }

  loadRoles(): void {
    this.cargandoVista = true;

    this.rolesService.getRoles().subscribe({
      next: (response: RoleItem[]) => {
        this.roles = this.ordenarRoles(response || []);
        this.filteredRoles = [...this.roles];
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar los roles.'
        });
        this.cargandoVista = false;
      }
    });
  }

  buscarRoles(): void {
    const termino = this.normalizarTexto(this.searchText);

    if (!termino) {
      this.filteredRoles = [...this.roles];
      return;
    }

    this.filteredRoles = this.roles.filter((role) => {
      const nombre = this.normalizarTexto(role.name);
      const estado = role.status === false ? 'inactivo' : 'activo';
      const fechaCreacion = this.normalizarTexto(
        role.createdAt ? new Date(role.createdAt).toLocaleDateString() : ''
      );
      const fechaActualizacion = this.normalizarTexto(
        role.updateAt ? new Date(role.updateAt).toLocaleDateString() : ''
      );

      return (
        nombre.includes(termino) ||
        estado.includes(termino) ||
        fechaCreacion.includes(termino) ||
        fechaActualizacion.includes(termino)
      );
    });
  }

  showCreateDialog(): void {
    this.dialogType = 'create';
    this.dialogHeader = 'Crear rol';
    this.selectedRole = this.getEmptyRole();
    this.dialogVisible = true;
  }

  showEditDialog(role: RoleItem): void {
    this.dialogType = 'edit';
    this.dialogHeader = 'Editar rol';
    this.selectedRole = {
      ...role,
      status: role.status !== false
    };
    this.dialogVisible = true;
  }

  showDeleteDialog(role: RoleItem): void {
    this.dialogType = 'delete';
    this.dialogHeader = 'Eliminar rol';
    this.selectedRole = { ...role };
    this.dialogVisible = true;
  }

  saveRole(): void {
    if (!this.formularioValido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Debes ingresar el nombre del rol.'
      });
      return;
    }

    this.guardandoRol = true;

    const roleData = {
      name: this.selectedRole.name.trim(),
      status: this.selectedRole.status !== false
    };

    if (this.dialogType === 'create') {
      this.rolesService.createRole(roleData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Rol creado',
            detail: 'El rol fue creado exitosamente.'
          });
          this.loadRoles();
          this.closeDialog();
          this.guardandoRol = false;
        },
        error: (error) => {
          console.error('Error al crear rol:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible crear el rol.'
          });
          this.guardandoRol = false;
        }
      });
      return;
    }

    if (this.dialogType === 'edit') {
      this.rolesService.updateRole(this.selectedRole.id, roleData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Rol actualizado',
            detail: 'El rol fue actualizado exitosamente.'
          });
          this.loadRoles();
          this.closeDialog();
          this.guardandoRol = false;
        },
        error: (error) => {
          console.error('Error al actualizar rol:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible actualizar el rol.'
          });
          this.guardandoRol = false;
        }
      });
    }
  }

  deleteRole(roleId: number): void {
    this.eliminandoRol = true;

    this.rolesService.deleteRole(roleId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Rol eliminado',
          detail: 'El rol fue eliminado exitosamente.'
        });
        this.loadRoles();
        this.closeDialog();
        this.eliminandoRol = false;
      },
      error: (error) => {
        console.error('Error al eliminar rol:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible eliminar el rol.'
        });
        this.eliminandoRol = false;
      }
    });
  }

  getEstadoTexto(role: RoleItem): string {
    return role.status === false ? 'Inactivo' : 'Activo';
  }

  getEstadoClase(role: RoleItem): string {
    return role.status === false ? 'status-inactive' : 'status-active';
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.dialogType = '';
    this.dialogHeader = '';
    this.selectedRole = this.getEmptyRole();
  }
}