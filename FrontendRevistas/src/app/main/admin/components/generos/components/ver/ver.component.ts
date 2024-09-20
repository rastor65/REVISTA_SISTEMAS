import { Component, OnInit } from '@angular/core';
import { TablasTipoService } from 'src/app/core/services/auth/tablas-tipo.service';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {
  generos: any[] = [];

  constructor(private generosService: TablasTipoService) { }

  ngOnInit(): void {
    this.cargarDocumentos();
  }

  cargarDocumentos(): void {
    this.generosService.obtenerGeneros().subscribe(data => {
      this.generos = data;
    });
  }
}