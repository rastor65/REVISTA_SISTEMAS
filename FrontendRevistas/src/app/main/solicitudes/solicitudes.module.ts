import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitudesComponent } from './solicitudes.component';
import { SolicitudesRoutingModule } from './solicitudes-routing.module';


@NgModule({
  declarations: [
    SolicitudesComponent,
  ],
  imports: [
    CommonModule,
    SolicitudesRoutingModule
  ]
})
export class SolicitudesModule { }
