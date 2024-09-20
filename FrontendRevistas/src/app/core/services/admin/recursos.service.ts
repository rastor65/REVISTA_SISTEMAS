import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {
  API_URI = environment.API_URI;
  base_recursos = `${this.API_URI}/resources/`;

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
}
