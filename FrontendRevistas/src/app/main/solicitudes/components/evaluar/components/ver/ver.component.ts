import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Seguimiento, Solicitud, Pasos, Estado } from 'src/app/models/solicitudes';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

export interface Contenido {
  id: number;
  resumen: string;
  resumenCorrecto: boolean;
  palabras_claves: string;
  palabrasClavesCorrecto: boolean;
  abstract: string;
  abstractCorrecto: boolean;
  Keywords: string;
  keywordsCorrecto: boolean;
  introduccion: string;
  introduccionCorrecto: boolean;
  materi_metodos: string;
  materiMetodosCorrecto: boolean;
  result_discu: string;
  resultDiscuCorrecto: boolean;
  agradecimientos: string;
  agradecimientosCorrecto: boolean;
  literact_citada: string;
  literactCitadaCorrecto: boolean;
  observacionGeneral: string;
}

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  API_URI = environment.API_URI;
  seguimientos: Seguimiento[] = [];
  usuarios: any[] = [];
  solicitudes: Solicitud[] = [];
  displayDialog: boolean = false;
  selectedSeguimiento: any;
  selectedContenido: any;
  selectedResultado: string = '';
  descripcionEvaluacion: string = '';
  selectedResultadoEvaluacion: string = '';
  usuarioLogueadoId: number | null = null;
  pasos: Pasos[] = [];
  estados: Estado[] = [];
  selectedFileCorreciones: File | null = null;
  selectedFileFormato: File | null = null;
  archivoSeleccionadoCorreciones: string = '';
  archivoSeleccionadoFormato: string = '';
  selectedFileName: string = 'Seleccionar archivo...';


  constructor(
    private solicitudService: SolicitudesService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    const loggedUser = this.authService.getUserId();
    if (loggedUser != null) {
      this.usuarioLogueadoId = loggedUser;
      this.obtenerSeguimientos_y_Solicitudes();
    }

    this.obtenerUsuarios();
    this.obtenerEstados();
    this.obtenerPasos();
  }

  obtenerSeguimientos_y_Solicitudes() {
    if (this.usuarioLogueadoId) {
      this.solicitudService.getSeguimientos().subscribe(data => {
        this.seguimientos = data.filter((seguimiento: Seguimiento) =>
          seguimiento.responsableId === this.usuarioLogueadoId
        );

        this.solicitudService.getSolicitudes().subscribe(solicitudData => {
          this.solicitudes = solicitudData;
        });
      });
    }
  }

  obtenerPasos(): void {
    this.solicitudService.obtenerPasos().subscribe(
      (pasos: any[]) => {
        this.pasos = pasos;
      },
      (error: any) => {
        console.error('Error al obtener los pasos de solicitud', error);
      }
    );
  }

  obtenerEstados(): void {
    this.solicitudService.obtenerEstados().subscribe(
      (estados: any[]) => {
        this.estados = estados;
      },
      (error: any) => {
        console.error('Error al obtener los estados', error);
      }
    );
  }

  obtenerUsuarios(): void {
    this.userService.ObtenerUsuarios().subscribe(
      (response: any) => {

        if (response && Array.isArray(response)) {
          this.usuarios = response;
        } else {
          console.error('Respuesta inválida del backend:', response);
        }
      },
      (error: any) => {
        console.error('Error al obtener la lista de usuarios', error);
      }
    );
  }

  getUsuarioNombre(usuarioId: number): string {
    const usuario = this.usuarios.find(u => u.user === usuarioId);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Evaluador desconocido';
  }

  getTituloSolicitud(solicitudId: number): string {
    const solicitud = this.solicitudes.find(solicitud => solicitud.id === solicitudId);
    return solicitud ? solicitud.titulo_articulo : 'Solicitud no encontrada';
  }

  getPasoNombre(pasoId: number): string {
    const paso = this.pasos.find(p => p.id === pasoId);
    return paso ? paso.nombre : 'Paso no encontrado';
  }

  getEstadoNombre(estadoId: number): string {
    const estado = this.estados.find(e => e.id === estadoId);
    return estado ? estado.nombre : 'Estado no encontrado';
  }

  async showDialog(seguimiento: Seguimiento): Promise<void> {
    this.selectedSeguimiento = seguimiento;

    const fechaActual = new Date();
    const fechaActualISO = fechaActual.toISOString().split('T')[0];
    this.selectedSeguimiento.fecha_evaluacion = fechaActualISO;

    try {
      // Obtener la solicitud asociada al seguimiento
      const solicitudResponse = await this.solicitudService.getSolicitud(seguimiento.solicitudId).toPromise();
      const solicitud = solicitudResponse.solicitud;
      // Obtener el contenido asociado a la solicitud
      this.selectedContenido = await this.solicitudService.getContenido(solicitud.contenidoSolicitud).toPromise();
      // Asignar las observaciones al objeto selectedContenido
      this.descripcionEvaluacion = this.selectedContenido.observacionGeneral;
      this.displayDialog = true;
      // Forzar la detección de cambios
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error fetching data:', error);
      this.selectedContenido = null;
      this.displayDialog = true;
      // Forzar la detección de cambios
      this.cdRef.detectChanges();
    }
  }

  DescargarContenido(id: number, tipo: 'archivo_adjunto' | 'originalidad'): void {
    this.solicitudService.descargarArchivo(id, tipo).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tipo}_${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }

  hideDialog(): void {
    this.selectedSeguimiento = null;
    this.selectedContenido = null;
    this.displayDialog = false;
    this.selectedResultadoEvaluacion = '';
    this.descripcionEvaluacion = '';
  }

  guardarEvaluacion(): void {
    if (this.selectedSeguimiento) {
      const seguimientoId = this.selectedSeguimiento.id;

      // Verificar si los campos requeridos están definidos y tienen valores válidos
      if (
        typeof this.selectedSeguimiento.pasos_seguimiento === 'number' &&
        typeof this.selectedSeguimiento.solicitudId === 'number'
      ) {
        // Crear un nuevo objeto FormData
        const formData = new FormData();

        // Agregar los campos requeridos al formData
        formData.append('pasos_seguimiento', this.selectedSeguimiento.pasos_seguimiento.toString());
        formData.append('solicitudId', this.selectedSeguimiento.solicitudId.toString());

        // Agregar los campos editables al formData
        formData.append('fecha_evaluacion', this.selectedSeguimiento.fecha_evaluacion);
        formData.append('estado_seguimiento', this.selectedSeguimiento.estado_seguimiento);

        // Verificar si selectedFile es un objeto File válido y agregarlo al formData
        if (this.selectedFileCorreciones instanceof File) {
          formData.append('correciones', this.selectedFileCorreciones);
        }

        if (this.selectedFileFormato instanceof File) {
          formData.append('formato_evaluacion', this.selectedFileFormato);
        }

        formData.append('status', 'true');

        // Realiza la solicitud HTTP PUT utilizando FormData
        this.http.put(`${this.API_URI}/solicitud/seguimiento/seguimientos/${seguimientoId}/`, formData)
          .subscribe(
            (response) => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evaluacion guardada exitosamente' });
              this.obtenerSeguimientos_y_Solicitudes();
              this.hideDialog();
            },
            (error) => {
              console.error('Error al guardar la evaluación:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al evaluar el seguimiento' });
            }
          );
      } else {
        console.error('Los campos requeridos no están definidos o no son válidos.');
      }
    }
  }

  seguimientoEnPaso(paso: number): boolean {
    const pasosNivel4 = this.pasos.filter((p) => p.nivel === 4);
    return pasosNivel4.some((p) => p.id === paso);
  }

  handleFileInputCorreciones(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileCorreciones = file;
      this.selectedFileName = file.name;
      this.archivoSeleccionadoCorreciones = event.target.files[0].name;
    }
  }

  handleFileInputFormato(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileFormato = file;
      this.selectedFileName = file.name; // Actualiza el nombre del archivo
      this.archivoSeleccionadoFormato = event.target.files[0].name;
    }
  }

}
