import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rol } from 'src/app/models/user/person';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  API_URI = environment.API_URI;
  base_roles = `${this.API_URI}/roles/`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    return this.http.get<any>(this.base_roles);
  }

  obtenerEditorJefeId(roles: Rol[]): number | undefined {
    const editorJefeRole = roles.find(role => role.name === 'Editor jefe');
    if (editorJefeRole && editorJefeRole.users.length > 0) {
      return editorJefeRole.users[0]; // Se asume que solo hay un "editor jefe"
    }
    return undefined; // Si no se encuentra al "editor jefe"
  }

  createRole(roleData: any): Observable<any> {
    return this.http.post<any>(this.base_roles, roleData);
  }

  updateRole(roleId: number, roleData: any): Observable<any> {
    const url = `${this.base_roles}${roleId}`;
    return this.http.put<any>(url, roleData);
  }

  deleteRole(roleId: number): Observable<any> {
    const url = `${this.base_roles}${roleId}`;
    return this.http.delete<any>(url);
  }
}
