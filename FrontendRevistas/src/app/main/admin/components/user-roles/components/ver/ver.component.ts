import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/core/services/dashboard/usuarios.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Usuario, Rol, UserRole } from 'src/app/models/user/person';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})

export class VerComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  usuarioSeleccionado: Usuario = {} as Usuario;
  AllRoles: any[] = [];
  usuarioRolesMap: Map<string, string[]> = new Map<string, string[]>();
  filteredUsuarios: Usuario[] = [];
  rolesSeleccionados: number[] = [];
  nuevosRolesSeleccionados: number[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.usuariosService.getUsers().subscribe(data => {
      this.usuarios = data as Usuario[];
    });

    this.usuariosService.getRoles().subscribe(data => {
      this.roles = data as Rol[];
    });
    this.procesarRoles();
    this.getRol();

  }

  searchUsuarios(event: { query: string }): void {
    const filtered: Usuario[] = this.usuarios.filter(usuario =>
      usuario.username.toLowerCase().includes(event.query.toLowerCase())
    );
    this.filteredUsuarios = filtered;
  }

  getRol() {
    this.usuariosService.getAllRoles().subscribe(response => {
      this.AllRoles = response;
      this.procesarRoles();
    });
  }

  procesarRoles() {
    this.usuarioRolesMap.clear();

    this.AllRoles.forEach((userRole) => {
      const usuario = userRole.userId.username;

      // Aquí, verificamos si `rolesId` es un objeto o un arreglo
      // y extraemos los nombres de los roles en consecuencia.
      const roles = Array.isArray(userRole.rolesId)
        ? userRole.rolesId.map((rol: any) => rol.name)
        : [userRole.rolesId.name];

      if (this.usuarioRolesMap.has(usuario)) {
        const rolesExistente = this.usuarioRolesMap.get(usuario) || [];
        rolesExistente.push(...roles);
        this.usuarioRolesMap.set(usuario, Array.from(new Set(rolesExistente)));
      } else {
        this.usuarioRolesMap.set(usuario, Array.from(new Set(roles)));
      }
    });


    // Actualizar rolesSeleccionados con los roles del usuario seleccionado
    const rolesDelUsuarioSeleccionado = this.usuarioRolesMap.get(this.usuarioSeleccionado.username) || [];
    this.rolesSeleccionados = rolesDelUsuarioSeleccionado.map((rolNombre: string) => {
      const rolEncontrado = this.roles.find((rol) => rol.name === rolNombre);
      return rolEncontrado ? rolEncontrado.id : null;
    }) as number[];

  }

  onUsuarioSelect(event: any) {
    this.usuarioSeleccionado = event;
    this.rolesSeleccionados = this.getAllRolesForUsuario(this.usuarioSeleccionado.id);
  }

  getAllRolesForUsuario(usuarioId: number): number[] {
    const rolesSeleccionados: number[] = [];

    // Filtrar los roles que corresponden al usuario seleccionado
    const rolesUsuario = this.AllRoles.filter((rol) => rol.userId.id === usuarioId);

    // Extraer solo los identificadores de roles y agregarlos a rolesSeleccionados
    rolesUsuario.forEach((rol) => {
      rolesSeleccionados.push(rol.rolesId.id);
    });

    return rolesSeleccionados;
  }

  isRolSelected(rol: any): boolean {
    return this.rolesSeleccionados.some((selectedRoleId) => selectedRoleId === rol.id);
  }


  onRolChange(rol: any, isChecked: boolean) {
    const rolId = Number(rol.id); // Convertir el id del rol a número

    if (isChecked) {
      // Si el rol no estaba seleccionado previamente, agregarlo a la lista de roles seleccionados
      if (!this.rolesSeleccionados.includes(rolId)) {
        this.rolesSeleccionados.push(rolId);
        this.asignarRol();
      }
    } else {
      // Si el rol estaba seleccionado previamente, eliminarlo de la lista de roles seleccionados
      const index = this.rolesSeleccionados.indexOf(rolId);
      if (index !== -1) {
        this.rolesSeleccionados.splice(index, 1);
        this.deleteUserRole(rol);
        return;
      }
    }
  }



  asignarRol() {
  
    // Verificar si hay algún rol seleccionado
    if (this.rolesSeleccionados.length === 0) {
      return;
    }
  
    const rolId = this.rolesSeleccionados[this.rolesSeleccionados.length - 1]; // Obtener el último rol seleccionado
  
    // Verificar si el usuario ya tiene asignado este rol (incluso si está oculto)
    const existingUserRole = this.buscarUserRole(this.usuarioSeleccionado.id, rolId);
  
    if (existingUserRole) {
      // Si el rol existe y está oculto, cambiar su estado a true
      if (!existingUserRole.status) {
        existingUserRole.status = true;
        const userRoleId = existingUserRole.id;
        this.actualizarUserRole(userRoleId, existingUserRole);
      }
    } else {
      // Si el rol no existe, agregarlo como un nuevo registro
      const body = {
        status: true,
        userId: this.usuarioSeleccionado.id,
        rolesId: rolId // Enviar solo el ID del rol seleccionado
      };
  
      const bodyString = JSON.stringify(body);
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
  
      this.usuariosService.asignarRoles(bodyString, httpOptions).subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: `Rol asignado satisfactoriamente` });
  
          // Recargar los roles del usuario después de agregar uno nuevo
          this.getAllRolesForUsuario(this.usuarioSeleccionado.id);
        },
        error => {
          console.error("Error al asignar el rol", error);
          this.messageService.add({ severity: 'error', summary: 'Error al asignar el rol' });
        }
      );
    }
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
  
    this.usuariosService.actualizarUserRole(userRoleId, bodyString, httpOptions).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: `Rol actualizado satisfactoriamente` });
  
        // Recargar los roles del usuario después de actualizar el estado del rol
        this.getAllRolesForUsuario(this.usuarioSeleccionado.id);
      },
      error => {
        console.error("Error al actualizar el rol", error);
        this.messageService.add({ severity: 'error', summary: 'Error al actualizar el rol' });
      }
    );
  }
  
  
  buscarUserRole(usuarioId: number, rolId: number): UserRole | undefined {
    return this.AllRoles.find((userRole: UserRole) =>
      userRole.userId.id === usuarioId && userRole.rolesId.id === rolId
    );
  }

  deleteUserRole(rol: any) {
    const usuarioIdSeleccionado = this.usuarioSeleccionado.id;
    const rolIdSeleccionado = rol.id;

    const userRoleAEliminar = this.buscarUserRole(usuarioIdSeleccionado, rolIdSeleccionado);

    if (!userRoleAEliminar) {
      console.error('No se encontró ningún registro de user_roles coincidente');
      return;
    }

    const userRoleId = userRoleAEliminar.id;

    this.usuariosService.deleteUserRole(userRoleId).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: `Rol eliminado satisfactoriamente` });
        // Realizar las acciones necesarias después de eliminar el user_roles.
      },
      (error: HttpErrorResponse) => {
        console.error('Error al eliminar el user_roles', error);
        this.messageService.add({ severity: 'error', summary: 'Error al eliminar el rol' });
        // Realizar el manejo de errores adecuado.
      }
    );
  }
}

