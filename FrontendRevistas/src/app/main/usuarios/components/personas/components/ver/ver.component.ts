import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';

interface UserRow {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  fullName: string;
  roles: string[];
  roleText: string;
  status: boolean;
}

type DialogMode = 'create' | 'edit';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  @ViewChild('dt') dt?: Table;

  public usersRaw: any[] = [];
  public rolesAssignments: any[] = [];
  public rolesCatalog: any[] = [];

  public userRows: UserRow[] = [];
  public loading = true;
  public saving = false;
  public deleting = false;

  public searchValue = '';

  public dialogVisible = false;
  public deleteDialogVisible = false;
  public dialogMode: DialogMode = 'create';

  public selectedUser: UserRow | null = null;

  public formModel = {
    id: 0,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    status: true
  };

  public globalFilterFields: string[] = [
    'id',
    'username',
    'email',
    'first_name',
    'last_name',
    'fullName',
    'roleText'
  ];

  constructor(
    private usuariosService: UsuariosService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  get totalUsers(): number {
    return this.userRows.length;
  }

  get usersWithRoles(): number {
    return this.userRows.filter(user => user.roles.length > 0).length;
  }

  get totalAssignments(): number {
    return this.rolesAssignments.length;
  }

  get dialogTitle(): string {
    return this.dialogMode === 'create' ? 'Crear usuario' : 'Editar usuario';
  }

  loadData(): void {
    this.loading = true;

    forkJoin({
      users: this.usuariosService.getUsers(),
      rolesAssignments: this.usuariosService.getAllRoles(),
      rolesCatalog: this.usuariosService.getRoles()
    }).subscribe({
      next: ({ users, rolesAssignments, rolesCatalog }) => {
        this.usersRaw = users || [];
        this.rolesAssignments = rolesAssignments || [];
        this.rolesCatalog = rolesCatalog || [];
        this.buildUserRows();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar los usuarios.'
        });
      }
    });
  }

  buildUserRows(): void {
    const rolesMap = new Map<number, Set<string>>();

    for (const assignment of this.rolesAssignments) {
      const userId = Number(assignment?.userId?.id ?? assignment?.userId ?? 0);
      const roleName = assignment?.rolesId?.name ?? '';

      if (!userId || !roleName) {
        continue;
      }

      if (!rolesMap.has(userId)) {
        rolesMap.set(userId, new Set<string>());
      }

      rolesMap.get(userId)?.add(roleName);
    }

    this.userRows = (this.usersRaw || []).map((user: any) => {
      const roles = Array.from(rolesMap.get(Number(user.id)) || []);

      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();

      return {
        id: Number(user.id),
        username: user.username || '',
        email: user.email || '',
        first_name: firstName,
        last_name: lastName,
        fullName: fullName || 'Sin nombre registrado',
        roles,
        roleText: roles.join(', '),
        status: typeof user.status === 'boolean' ? user.status : true
      };
    }).sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  applyGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dt?.filterGlobal(value, 'contains');
  }

  clearFilters(): void {
    this.searchValue = '';
    this.dt?.clear();
  }

  openCreateDialog(): void {
    this.dialogMode = 'create';
    this.formModel = {
      id: 0,
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      status: true
    };
    this.dialogVisible = true;
  }

  openEditDialog(user: UserRow): void {
    this.dialogMode = 'edit';
    this.formModel = {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: '',
      status: user.status
    };
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }

  confirmDelete(user: UserRow): void {
    this.selectedUser = user;
    this.deleteDialogVisible = true;
  }

  closeDeleteDialog(): void {
    this.deleteDialogVisible = false;
    this.selectedUser = null;
  }

  saveUser(): void {
    if (!this.formModel.username.trim() || !this.formModel.email.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Usuario y correo son obligatorios.'
      });
      return;
    }

    if (this.dialogMode === 'create' && !this.formModel.password.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Contraseña requerida',
        detail: 'Debes ingresar una contraseña para crear el usuario.'
      });
      return;
    }

    const payload: any = {
      username: this.formModel.username.trim(),
      email: this.formModel.email.trim(),
      first_name: this.formModel.first_name.trim(),
      last_name: this.formModel.last_name.trim(),
      status: this.formModel.status
    };

    if (this.formModel.password.trim()) {
      payload.password = this.formModel.password.trim();
    }

    this.saving = true;

    const request =
      this.dialogMode === 'create'
        ? this.usuariosService.createUser(payload)
        : this.usuariosService.updateUser(this.formModel.id, payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.dialogVisible = false;
        this.loadData();

        this.messageService.add({
          severity: 'success',
          summary: this.dialogMode === 'create' ? 'Usuario creado' : 'Usuario actualizado',
          detail:
            this.dialogMode === 'create'
              ? 'El usuario fue creado correctamente.'
              : 'El usuario fue actualizado correctamente.'
        });
      },
      error: (error: any) => {
        console.error('Error al guardar usuario:', error);
        this.saving = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible guardar el usuario.'
        });
      }
    });
  }

  deleteUser(): void {
    if (!this.selectedUser) {
      return;
    }

    this.deleting = true;

    this.usuariosService.deleteUser(this.selectedUser.id).subscribe({
      next: () => {
        this.deleting = false;
        this.deleteDialogVisible = false;
        this.loadData();

        this.messageService.add({
          severity: 'success',
          summary: 'Usuario eliminado',
          detail: 'El usuario fue eliminado correctamente.'
        });
      },
      error: (error: any) => {
        console.error('Error al eliminar usuario:', error);
        this.deleting = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible eliminar el usuario.'
        });
      }
    });
  }

  getInitials(user: UserRow): string {
    const base = user.fullName && user.fullName !== 'Sin nombre registrado'
      ? user.fullName
      : user.username;

    const parts = base.split(' ').filter(Boolean).slice(0, 2);

    return parts.map(part => part.charAt(0).toUpperCase()).join('') || 'U';
  }
}