import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(
    private http: HttpClient
  ) { }

  //  Trae todas las personas
  getAllPersonas(api: any, token: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
    return this.http.get(api, httpOptions)
  }

  //  Crea una persona
  createPersona(api: any, body: any, token: any): Observable<any> {

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }
    return this.http.post(api, body, httpOptions)
  }


  //  Edita una Persona

  updatePersona(api: any, body: any, token: any): Observable<any> {

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }

    return this.http.put(api, body, httpOptions);
  }

  //Elimina una persona

  deletePersona(api: any, token: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }

    return this.http.delete(api, httpOptions);
  }

  

}
