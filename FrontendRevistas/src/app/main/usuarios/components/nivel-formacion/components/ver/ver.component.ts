import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/usuarios/user.service';
import { MessageService } from 'primeng/api';
import { NivelFormacion } from 'src/app/models/user/person';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  niveles: NivelFormacion[] = [];

  constructor(private userService: UserService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.cargarNivelesFormacion();
  }

  cargarNivelesFormacion() {
    this.userService.obtenerNivelesFormacion().subscribe(
      data => {
        this.niveles = data as NivelFormacion[];
      },
      error => {
        console.error("Error al cargar los niveles de formación", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los niveles de formación' });
      }
    );
  }
}
