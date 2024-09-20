import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';
import { MessageService } from 'primeng/api';
import { Pasos } from 'src/app/models/solicitudes';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  nuevoPaso = {
    id: 0,
    nivel: 0,
    nombre: '',
    dias_programacion: '',
    status: true
  };

  constructor(private solicitudesService: SolicitudesService, private messageService: MessageService) { }

  ngOnInit(): void {

  }

  crearPaso(): void {
    this.solicitudesService.guardarPasos(this.nuevoPaso).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Paso guardada', detail: 'El paso a seguir se genero exitosamente' });
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
    this.nuevoPaso = {
      id: 0,
      nivel: 0,
      nombre: '',
      dias_programacion: '',
      status: true
    };
  }
}
