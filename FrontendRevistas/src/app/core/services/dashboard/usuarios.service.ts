import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {


  API_URI = environment.API_URI;

  // API path
  base_personas = `${this.API_URI}/persons`;
  base_usuarios_roles = `${this.API_URI}/roles/user_rol/`;
  base_roles = `${this.API_URI}/roles/`;
  base_usuarios = `${this.API_URI}/api/user/`;

  constructor(private http: HttpClient) { }

  getAllUsuarios() {
    return this.http.get<any[]>(`${this.base_personas}`);
  }

  getAllRoles() {
    return this.http.get<any[]>(`${this.base_usuarios_roles}`);
  }

  getRoles() {
    return this.http.get<any[]>(`${this.base_roles}`);
  }

  getUsers() {
    return this.http.get<any[]>(`${this.base_usuarios}`);
  }

  asignarRoles(bodyString: string, httpOptions: { headers: HttpHeaders }): Observable<any> {
    return this.http.post<any>(this.base_usuarios_roles, bodyString, httpOptions);
  }

  actualizarUserRole(userRoleId: number, body: any, httpOptions: any): Observable<any> {
    const url = `${this.base_usuarios_roles}${userRoleId}`; // Reemplaza "actualizarUserRole" con la ruta correcta en tu API
    return this.http.put(url, body, httpOptions);
  }
  
  deleteUserRole(userRoleId: number): Observable<any> {
    const url = `${this.base_usuarios_roles}${userRoleId}/`;
    return this.http.delete(url);
  }
  
  assignRole(data: any): Observable<any> {
    const url = `${this.base_usuarios_roles}`;
    return this.http.post(url, data);
  }
  
}

