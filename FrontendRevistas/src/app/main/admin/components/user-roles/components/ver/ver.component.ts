import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';
import { Usuario, Rol, UserRole } from 'src/app/models/user/person';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  allRoles: UserRole[] = [];

  usuarioSeleccionado: Usuario | null = null;

  rolesSeleccionados: number[] = [];
  rolesIniciales: number[] = [];

  userSearchText = '';
  rolesSearchText = '';

  cargandoVista = true;
  guardandoCambios = false;

  constructor(
    private usuariosService: UsuariosService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  get totalUsuarios(): number {
    return this.usuarios.length;
  }

  get totalRoles(): number {
    return this.roles.length;
  }

  get totalAsignaciones(): number {
    return this.allRoles.filter((x) => x.status !== false).length;
  }

  get tieneUsuarioSeleccionado(): boolean {
    return !!this.usuarioSeleccionado?.id;
  }

  get nombreUsuarioSeleccionado(): string {
    return this.usuarioSeleccionado?.username || 'Sin usuario seleccionado';
  }

  get rolesUsuarioSeleccionadoTexto(): string {
    if (!this.usuarioSeleccionado) {
      return 'Selecciona un usuario para visualizar sus roles.';
    }

    const nombres = this.getRoleNamesForUser(this.usuarioSeleccionado.id);
    return nombres.length ? nombres.join(', ') : 'Sin roles asignados';
  }

  get totalRolesSeleccionados(): number {
    return this.rolesSeleccionados.length;
  }

  get hayCambiosPendientes(): boolean {
    if (!this.usuarioSeleccionado) {
      return false;
    }

    const actuales = [...this.rolesSeleccionados].sort((a, b) => a - b);
    const iniciales = [...this.rolesIniciales].sort((a, b) => a - b);

    return JSON.stringify(actuales) !== JSON.stringify(iniciales);
  }

  get usuariosFiltrados(): Usuario[] {
    const term = this.userSearchText.trim().toLowerCase();

    const lista = !term
      ? [...this.usuarios]
      : this.usuarios.filter((usuario) => {
          const username = (usuario.username || '').toLowerCase();
          const email = (usuario.email || '').toLowerCase();
          return username.includes(term) || email.includes(term);
        });

    return lista.sort((a, b) => (a.username || '').localeCompare(b.username || ''));
  }

  get rolesFiltrados(): Rol[] {
    const term = this.rolesSearchText.trim().toLowerCase();

    const lista = !term
      ? [...this.roles]
      : this.roles.filter((rol) => (rol.name || '').toLowerCase().includes(term));

    return lista.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  cargarDatos(): void {
    this.cargandoVista = true;

    forkJoin({
      usuarios: this.usuariosService.getUsers(),
      roles: this.usuariosService.getRoles(),
      asignaciones: this.usuariosService.getAllRoles()
    }).subscribe({
      next: ({ usuarios, roles, asignaciones }) => {
        this.usuarios = (usuarios || []) as Usuario[];
        this.roles = (roles || []) as Rol[];
        this.allRoles = (asignaciones || []) as UserRole[];
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar la información:', error);
        this.cargandoVista = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar usuarios, roles y asignaciones.'
        });
      }
    });
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.rolesSearchText = '';

    const rolesActuales = this.getAllRolesForUsuario(usuario.id);
    this.rolesSeleccionados = [...rolesActuales];
    this.rolesIniciales = [...rolesActuales];
  }

  limpiarSeleccion(): void {
    this.usuarioSeleccionado = null;
    this.rolesSeleccionados = [];
    this.rolesIniciales = [];
    this.rolesSearchText = '';
  }

  usuarioEstaSeleccionado(usuarioId: number): boolean {
    return this.usuarioSeleccionado?.id === usuarioId;
  }

  getAllRolesForUsuario(usuarioId: number): number[] {
    return this.allRoles
      .filter(
        (registro) =>
          registro.userId?.id === usuarioId &&
          registro.rolesId?.id &&
          registro.status !== false
      )
      .map((registro) => registro.rolesId.id);
  }

  getRoleNamesForUser(usuarioId: number): string[] {
    const nombres = this.allRoles
      .filter(
        (registro) =>
          registro.userId?.id === usuarioId &&
          registro.rolesId?.name &&
          registro.status !== false
      )
      .map((registro) => registro.rolesId.name);

    return Array.from(new Set(nombres)).sort((a, b) => a.localeCompare(b));
  }

  getRolesCountForUser(usuarioId: number): number {
    return this.getRoleNamesForUser(usuarioId).length;
  }

  getRolesPreviewForUser(usuarioId: number): string {
    const roles = this.getRoleNamesForUser(usuarioId);
    if (!roles.length) {
      return 'Sin roles asignados';
    }
    if (roles.length <= 3) {
      return roles.join(', ');
    }
    return `${roles.slice(0, 3).join(', ')} y ${roles.length - 3} más`;
  }

  isRolSelected(rol: Rol): boolean {
    return this.rolesSeleccionados.includes(rol.id);
  }

  toggleRol(rolId: number): void {
    const index = this.rolesSeleccionados.indexOf(rolId);

    if (index >= 0) {
      this.rolesSeleccionados.splice(index, 1);
    } else {
      this.rolesSeleccionados.push(rolId);
    }

    this.rolesSeleccionados = [...this.rolesSeleccionados];
  }

  seleccionarTodosLosRoles(): void {
    if (!this.usuarioSeleccionado) {
      return;
    }
    this.rolesSeleccionados = this.roles.map((rol) => rol.id);
  }

  quitarTodosLosRoles(): void {
    if (!this.usuarioSeleccionado) {
      return;
    }
    this.rolesSeleccionados = [];
  }

  restablecerSeleccion(): void {
    if (!this.usuarioSeleccionado) {
      return;
    }
    this.rolesSeleccionados = [...this.rolesIniciales];
  }

  buscarUserRole(usuarioId: number, rolId: number): UserRole | undefined {
    return this.allRoles.find(
      (userRole: UserRole) =>
        userRole.userId?.id === usuarioId && userRole.rolesId?.id === rolId
    );
  }

  actualizarUserRole(userRoleId: number, updatedUserRole: UserRole) {
    const body = {
      status: updatedUserRole.status,
      userId: updatedUserRole.userId.id,
      rolesId: updatedUserRole.rolesId.id
    };

    const bodyString = JSON.stringify(body);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.usuariosService.actualizarUserRole(userRoleId, bodyString, httpOptions);
  }

  crearAsignacionRol(usuarioId: number, rolId: number) {
    const body = {
      status: true,
      userId: usuarioId,
      rolesId: rolId
    };

    const bodyString = JSON.stringify(body);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.usuariosService.asignarRoles(bodyString, httpOptions);
  }

  eliminarAsignacionRol(userRoleId: number) {
    return this.usuariosService.deleteUserRole(userRoleId);
  }

  guardarRolesUsuario(): void {
    if (!this.usuarioSeleccionado?.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Selecciona un usuario',
        detail: 'Debes seleccionar un usuario antes de guardar.'
      });
      return;
    }

    if (!this.hayCambiosPendientes) {
      this.messageService.add({
        severity: 'info',
        summary: 'Sin cambios',
        detail: 'No hay cambios pendientes por guardar.'
      });
      return;
    }

    this.guardandoCambios = true;

    const usuarioId = this.usuarioSeleccionado.id;

    const rolesAAgregar = this.rolesSeleccionados.filter(
      (rolId) => !this.rolesIniciales.includes(rolId)
    );

    const rolesAEliminar = this.rolesIniciales.filter(
      (rolId) => !this.rolesSeleccionados.includes(rolId)
    );

    const operacionesAgregar = rolesAAgregar.map((rolId) => {
      const existingUserRole = this.buscarUserRole(usuarioId, rolId);

      if (existingUserRole) {
        if (!existingUserRole.status) {
          existingUserRole.status = true;
          return this.actualizarUserRole(existingUserRole.id, existingUserRole);
        }
        return of(null);
      }

      return this.crearAsignacionRol(usuarioId, rolId);
    });

    const operacionesEliminar = rolesAEliminar.map((rolId) => {
      const userRoleAEliminar = this.buscarUserRole(usuarioId, rolId);

      if (!userRoleAEliminar) {
        return of(null);
      }

      return this.eliminarAsignacionRol(userRoleAEliminar.id);
    });

    const operaciones = [...operacionesAgregar, ...operacionesEliminar];

    if (!operaciones.length) {
      this.guardandoCambios = false;
      return;
    }

    forkJoin(operaciones)
      .pipe(switchMap(() => this.usuariosService.getAllRoles()))
      .subscribe({
        next: (response) => {
          this.allRoles = response as UserRole[];
          const rolesActuales = this.getAllRolesForUsuario(usuarioId);
          this.rolesSeleccionados = [...rolesActuales];
          this.rolesIniciales = [...rolesActuales];
          this.guardandoCambios = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Roles actualizados',
            detail: 'Los roles del usuario se guardaron correctamente.'
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar roles del usuario', error);
          this.guardandoCambios = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No fue posible guardar los cambios de roles.'
          });
        }
      });
  }

  trackByUserId(index: number, usuario: Usuario): number {
    return usuario.id;
  }

  trackByRoleId(index: number, rol: Rol): number {
    return rol.id;
  }
}