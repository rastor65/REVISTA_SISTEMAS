import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { Revistas } from 'src/app/models/solicitudes';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  revista: Revistas = {
    id: 0,
    nombre: '',
    status: true,
  };

  constructor(
    private solicitudesService: SolicitudesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

  }

  crearRevista(): void {
    this.solicitudesService.guardarRevistas(this.revista).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Revista guardada', detail: 'La revista se ha creado exitosamente' });
        this.limpiarCampos();
      },
      (error) => {
        // Aquí puedes manejar el error si ocurre
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Todos los campos son necesarios' });
      }
    );
  }

  limpiarCampos(): void {
    this.revista = {
      id: 0,
      nombre: '',
      status: true,
    };
  }
}
