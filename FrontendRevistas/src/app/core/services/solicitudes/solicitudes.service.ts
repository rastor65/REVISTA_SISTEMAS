import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Pasos, Revistas, Contenido, Solicitud, Seguimiento } from 'src/app/models/solicitudes';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SolicitudesService {

  API_URI = environment.API_URI;

  // API path
  base_solicitud = `${this.API_URI}/solicitud/solicitud/solicitudes/`;
  base_contenido = `${this.API_URI}/solicitud/contenido/contenido/`;
  base_pasos = `${this.API_URI}/solicitud/pasossolicitud/pasos_seguimiento/`;
  base_seguimiento = `${this.API_URI}/solicitud/seguimiento/seguimientos/`;
  base_solicitud_x_autor = `${this.API_URI}/solicitud/autsoli/autorxsolicitud/`;
  base_estados = `${this.API_URI}/solicitud/estado/estado_seguimiento/`;
  base_revistas = `${this.API_URI}//solicitud/revista/revista/`;

  constructor(private http: HttpClient) { }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // generar solicitudes y contenidos

  // solicitudes.service.ts
  reemplazarSolicitud(id: number, solicitudCompleta: any) {
    return this.http.put(`${this.API_URI}/solicitud/solicitud/solicitudes/${id}/`, solicitudCompleta);
  }


  obtenerSolicitudesPorUsuario(usuarioId: number): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.base_solicitud).pipe(
      map((solicitudes: Solicitud[]) => {
        return solicitudes.filter((solicitud) => solicitud.autores && solicitud.autores.includes(usuarioId));
      })
    );
  }

  obtenerSolicitudesXAutor(usuarioId: number): Observable<any[]> {
    const url = `${this.base_solicitud_x_autor}`;
    return this.http.get<any[]>(url).pipe(
      map((response: any) => {
        return response.filter((autor: any) => autor.usuario === usuarioId);
      })
    );
  }

  obtenerSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.base_solicitud).pipe(
      map((response: any) => response)
    );
  }

  obtenerContenidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base_contenido}`).pipe(
      map((response: any) => response)
    );
  }

  guardarContenido(contenido: FormData): Observable<any> {
    return this.http.post(`${this.base_contenido}`, contenido);
  }

  guardarSolicitud(solicitud: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.base_solicitud}`, solicitud, { headers });
  }

  editarContenido(contenido: Contenido): Observable<Contenido> {
    const url = `${this.base_contenido}${contenido.id}/`;
    return this.http.put<Contenido>(url, contenido);
  }

  editarSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    const url = `${this.base_solicitud}${solicitud.id}/`;
    return this.http.put<Solicitud>(url, solicitud);
  }

  cambiarEstadoSolicitud(id: string, nuevoEstado: boolean): Observable<any> {
    const data = { status: nuevoEstado };
    return this.http.put(`${this.base_solicitud}${id}/`, data);
  }

  editarContenido2(formData: FormData): Observable<any> {
    const url = `${this.base_contenido}${formData.get('id')}/`;
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    return this.http.put(url, formData, { headers });
  }


  obtenerContenidoPorId(contenidoId: number): Observable<Contenido> {
    const url = `${this.base_contenido}${contenidoId}`;
    return this.http.get<Contenido>(url);
  }

  descargarArchivo(id: number, tipo: 'archivo_adjunto' | 'originalidad'): Observable<Blob> {
    return this.http.get(`${this.base_contenido}${id}/${tipo}/`, { responseType: 'blob' });
  }
  //////////////////////////////////////////////////////////////////////////////////
  // pasos solicitud

  obtenerPasos(): Observable<Pasos[]> {
    return this.http.get<Pasos[]>(this.base_pasos).pipe(
      map((response: any) => response.pasos_seguimiento)
    );
  }

  guardarPasos(pasos: Pasos): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.base_pasos}`, pasos, { headers });
  }

  actualizarPaso(paso: Pasos): Observable<Pasos> {
    const url = `${this.base_pasos}${paso.id}/`;
    return this.http.put<Pasos>(url, paso);
  }

  eliminarPaso(id: number, nuevoStatus: boolean): Observable<Pasos> {
    const url = `${this.base_pasos}${id}`;
    const data = { status: nuevoStatus };
    return this.http.patch<Pasos>(url, data);
  }

  //////////////////////////////////////////////////////////////////////////////////
  // revistas solicitud

  obtenerRevistas(): Observable<Revistas[]> {
    return this.http.get<Pasos[]>(this.base_revistas).pipe(
      map((response: any) => response.revista)
    );
  }

  guardarRevistas(revista: Revistas): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.base_revistas}`, revista, { headers });
  }

  actualizarRevista(revista: Revistas): Observable<Revistas> {
    const url = `${this.base_revistas}${revista.id}/`;
    return this.http.put<Pasos>(url, revista);
  }

  eliminarRevista(id: number, nuevoStatus: boolean): Observable<Revistas> {
    const url = `${this.base_revistas}${id}`;
    const data = { status: nuevoStatus };
    return this.http.patch<Revistas>(url, data);
  }

  //////////////////////////////////////////////////////////////////////////////////
  // seguimiento solicitud

  obtenerSeguimiento(): Observable<any> {
    return forkJoin({
      solicitudes: this.obtenerSolicitudes(),
      pasosSolicitud: this.obtenerPasos()
    });
  }

  obtenerIdPasoSolicitud(pasoId: string): Observable<any> {
    const url = `${this.base_pasos}${pasoId}/`;
    return this.http.get<any>(url).pipe(
      map((response: any) => response.id)
    );
  }

  obtenerIdSolicitud(solicitudId: string): Observable<any> {
    const url = `${this.base_solicitud}${solicitudId}/`;
    return this.http.get<any>(url).pipe(
      map((response: any) => response.id)
    );
  }

  crearSeguimiento(seguimientoData: FormData): Observable<any> {
    return this.http.post(this.base_seguimiento, seguimientoData);
  }

  eliminarSeguimiento(id: number): Observable<any> {
    const url = `${this.base_seguimiento}${id}/`;
    return this.http.delete(url);
  }

  actualizarSeguimientoConArchivo(formData: FormData): Observable<any> {
    const url = `${this.base_seguimiento}${formData.get('id')}/`;
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');  // You can add any necessary headers here
    return this.http.put(url, formData, { headers });
  }

  getSeguimientosPorEditor(editorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base_seguimiento}?editor_id=${editorId}`);
  }

  getSolicitudesPorIds(solicitudIds: number[]): Observable<any[]> {
    const queryParams = solicitudIds.map(id => `id=${id}`).join('&');
    return this.http.get<any[]>(`${this.base_solicitud}?${queryParams}`);
  }

  getSeguimientoPorId(seguimientoId: number): Observable<any> {
    const url = `${this.base_seguimiento}${seguimientoId}`;
    return this.http.get(url).pipe(
      catchError((error: any) => {
        console.error('Error al obtener el seguimiento:', error);
        throw error;
      })
    );
  }

  actualizarStatusSeguimiento(id: number, nuevoStatus: boolean): Observable<any> {
    const url = `${this.base_seguimiento}${id}/`;
    const seguimientoActualizado = {
      id: id,
      status: nuevoStatus
    };
    return this.http.put(url, seguimientoActualizado);
  }

  obtenerSeguimientos() {
    return this.http.get<any>(this.base_seguimiento).pipe(
      map(response => response)
    );
  }

  editarSeguimiento(seguimiento: Seguimiento): Observable<any> {
    return this.http.put<any>(`${this.base_seguimiento}${seguimiento.id}/`, seguimiento);
  }


  //////////////////////////////////////////////////////////////////////////

  // EVALUAR SOLICITUDES

  getSeguimientos(): Observable<any> {
    return this.http.get(this.base_seguimiento);
  }

  getSolicitudes(): Observable<any> {
    return this.http.get(this.base_solicitud);
  }

  getSolicitud(solicitudId: number): Observable<any> {
    return this.http.get(`${this.base_solicitud}${solicitudId}/`);
  }

  getContenidos(): Observable<any> {
    return this.http.get(this.base_contenido)
  }

  getContenido(contenidoId: number): Observable<any> {
    return this.http.get(`${this.base_contenido}${contenidoId}/`);
  }

  getSeguimientosBySolicitud(solicitudId: number): Observable<any[]> {
    const url = `${this.base_seguimiento}?solicitudId=${solicitudId}`;
    return this.http.get<any[]>(url);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  //ESTADOS

  obtenerEstados(): Observable<any[]> {
    return this.http.get<any[]>(this.base_estados);
  }

  crearEstado(estado: any): Observable<any> {
    return this.http.post(this.base_estados, estado);
  }

  actualizarEstado(estado: any): Observable<any> {
    const url = `${this.base_estados}${estado.id}/`;
    return this.http.put(url, estado);
  }

  eliminarEstado(id: number): Observable<any> {
    const url = `${this.base_estados}${id}/`;
    return this.http.delete(url);
  }

  marcarVistoBueno(solicitudId: number, visto: boolean) {
    return this.http.patch(
      `${this.API_URI}/solicitud/solicitudes/${solicitudId}/visto_bueno/`,
      { visto_bueno: visto }
    );
  }
}