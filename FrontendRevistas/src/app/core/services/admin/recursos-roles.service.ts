import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecursosRolesService {
  API_URI = environment.API_URI;
  base_recursos = `${this.API_URI}/resources/`;
  base_recursos_rol = `${this.API_URI}/resourcesr/`;

  constructor(private http: HttpClient) { }

  getResources(): Observable<any> {
    return this.http.get(this.base_recursos);
  }

  createResource(resource: any): Observable<any> {
    return this.http.post(this.base_recursos, resource);
  }

  updateResource(id: number, resource: any): Observable<any> {
    const url = `${this.base_recursos}${id}/`;
    return this.http.put(url, resource);
  }

  deleteResource(id: number): Observable<any> {
    const url = `${this.base_recursos}${id}/`;
    return this.http.delete(url);
  }

  assignResourceToRole(resource: number, role: number): Observable<any> {
    const body = { resource: resource, role: role, status: true };
    return this.http.post(this.base_recursos_rol, body);
  }

  deleteResourceFromRole(resourcesRoleId: number): Observable<any> {
    const url = `${this.base_recursos_rol}/resourcesr/${resourcesRoleId}`; // Utiliza la ID del registro para eliminar la relación
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(url, { headers });
  }

  getAssignedRolesToResources(): Observable<any[]> {
    const endpoint = `${this.base_recursos_rol}`; // Reemplaza con la ruta real de tu API
    return this.http.get<any[]>(endpoint);
  }
}