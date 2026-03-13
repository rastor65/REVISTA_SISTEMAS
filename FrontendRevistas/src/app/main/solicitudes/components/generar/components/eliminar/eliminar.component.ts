import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';

import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { UserService } from 'src/app/core/services/usuarios/user.service';

import { Solicitud, Revistas } from 'src/app/models/solicitudes';
import { Person } from 'src/app/models/user/person';

type ViewType = 'table' | 'cards';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  filteredSolicitudes: Solicitud[] = [];
  usuarios: Person[] = [];
  revistas: Revistas[] = [];

  eliminarDialogVisible = false;
  solicitudSeleccionada: Solicitud | null = null;

  searchText = '';
  viewType: ViewType = 'table';

  cargandoVista = true;
  eliminandoSolicitud = false;

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  get totalSolicitudes(): number {
    return this.solicitudes.length;
  }

  get totalConContenido(): number {
    return this.solicitudes.filter(s => this.hasContenido(s)).length;
  }

  get totalRevistas(): number {
    const ids = new Set(this.solicitudes.map(s => s.revista).filter(Boolean));
    return ids.size;
  }

  toggleView(view: ViewType): void {
    this.viewType = view;
  }

  private normalizarTexto(valor: string | null | undefined): string {
    return (valor || '').toLowerCase().trim();
  }

  private ordenarSolicitudesPorFecha(data: Solicitud[]): Solicitud[] {
    return [...data].sort((a, b) => {
      const fechaA = new Date(a.fecha_creacion || '').getTime();
      const fechaB = new Date(b.fecha_creacion || '').getTime();
      return fechaB - fechaA;
    });
  }

  cargarDatosIniciales(): void {
    this.cargandoVista = true;

    forkJoin({
      solicitudes: this.solicitudesService.obtenerSolicitudes(),
      usuarios: this.userService.ObtenerUsuarios(),
      revistas: this.solicitudesService.obtenerRevistas()
    }).subscribe({
      next: ({ solicitudes, usuarios, revistas }) => {
        const activas = (solicitudes || []).filter(s => s.status !== false);
        this.solicitudes = this.ordenarSolicitudesPorFecha(activas);
        this.filteredSolicitudes = [...this.solicitudes];
        this.usuarios = usuarios || [];
        this.revistas = revistas || [];
        this.cargandoVista = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes para eliminar:', error);
        this.cargandoVista = false;
      }
    });
  }

  getRevistaNombre(revistaId: number): string {
    const revista = this.revistas.find(r => r.id === revistaId);
    return revista ? revista.nombre : 'Sin revista';
  }

  getAutoresNombres(autoresIds: number[] | undefined): string {
    if (!autoresIds || autoresIds.length === 0) {
      return 'Autores desconocidos';
    }

    const nombresUnicos = new Set<string>();

    for (const usuarioId of autoresIds) {
      const usuario = this.usuarios.find(u => u.user === usuarioId);
      if (usuario) {
        nombresUnicos.add(`${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim());
      }
    }

    return nombresUnicos.size > 0
      ? Array.from(nombresUnicos).join(', ')
      : 'Autores desconocidos';
  }

  hasContenido(solicitud: Solicitud): boolean {
    return !!solicitud?.contenidoSolicitud && solicitud.contenidoSolicitud > 0;
  }

  buscarSolicitudes(): void {
    const termino = this.normalizarTexto(this.searchText);

    if (!termino) {
      this.filteredSolicitudes = [...this.solicitudes];
      return;
    }

    this.filteredSolicitudes = this.solicitudes.filter((solicitud) => {
      const titulo = this.normalizarTexto(solicitud.titulo_articulo);
      const afiliacion = this.normalizarTexto(solicitud.afiliacion);
      const autores = this.normalizarTexto(this.getAutoresNombres(solicitud.autores));
      const revista = this.normalizarTexto(this.getRevistaNombre(solicitud.revista));
      const fecha = this.normalizarTexto(
        solicitud.fecha_creacion
          ? new Date(solicitud.fecha_creacion).toLocaleDateString()
          : ''
      );

      return (
        titulo.includes(termino) ||
        afiliacion.includes(termino) ||
        autores.includes(termino) ||
        revista.includes(termino) ||
        fecha.includes(termino)
      );
    });
  }

  eliminarSolicitud(solicitud: Solicitud): void {
    this.solicitudSeleccionada = { ...solicitud };
    this.eliminarDialogVisible = true;
  }

  cancelarEliminar(): void {
    this.eliminarDialogVisible = false;
    this.solicitudSeleccionada = null;
  }

  confirmarEliminar(): void {
    if (!this.solicitudSeleccionada) {
      return;
    }

    this.eliminandoSolicitud = true;

    const solicitudActualizada: Solicitud = {
      ...this.solicitudSeleccionada,
      status: false
    };

    this.solicitudesService.editarSolicitud(solicitudActualizada).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Solicitud eliminada',
          detail: 'La solicitud fue desactivada exitosamente.'
        });

        this.eliminarDialogVisible = false;
        this.solicitudSeleccionada = null;
        this.eliminandoSolicitud = false;
        this.cargarDatosIniciales();
      },
      error: (error) => {
        console.error('Error al eliminar la solicitud:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible eliminar la solicitud.'
        });

        this.eliminandoSolicitud = false;
      }
    });
  }
}