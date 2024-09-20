import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentType } from 'src/app/models/user/person';

@Injectable({
  providedIn: 'root'
})
export class TablasTipoService {


  API_URI = environment.API_URI;

  // API path documentos
  base_documentos = `${this.API_URI}/documents/`;

  // API path documentos
  base_generos = `${this.API_URI}/genders/`;

  constructor(private http: HttpClient) { }

  // documentos

  getDocuments(): Observable<any> {
    return this.http.get<any[]>(this.base_documentos);
  }

  createDocument(documentData: any): Observable<any> {
    return this.http.post(this.base_documentos, documentData);
  }

  editarDocumento(documento: DocumentType): Observable<any> {
    const url = `${this.base_documentos}${documento.id}`;
    return this.http.put(url, documento);
  }

  eliminarDocumento(nivelId: number) {
    const url = `${this.base_documentos}${nivelId}`;
    return this.http.delete(url);
  }

  // generos

  obtenerGeneros(): Observable<any> {
    return this.http.get<any[]>(this.base_generos);
  }

  createGeneros(documentData: any): Observable<any> {
    return this.http.post(this.base_generos, documentData);
  }

  editarGeneros(documento: any): Observable<any> {
    const url = `${this.base_generos}${documento.id}`;
    return this.http.put(url, documento);
  }

  eliminarGeneros(nivelId: number) {
    const url = `${this.base_generos}${nivelId}`;
    return this.http.delete(url);
  }
  
}