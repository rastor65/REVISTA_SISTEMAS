import { Component, OnInit } from '@angular/core';
import { Estado } from 'src/app/models/solicitudes';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit{

  estado: Estado = { id: 0, nombre: '', descripcion: '', status: true };
  
  ngOnInit(): void {
    
  }
  constructor(private solicitudesService: SolicitudesService) {}

  crearEstado() {
    this.solicitudesService.crearEstado(this.estado).subscribe(
      response => {
        // Aquí puedes realizar alguna redirección o mostrar un mensaje de éxito
      },
      error => {
        console.error('Error al crear estado:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    );
  }

}
