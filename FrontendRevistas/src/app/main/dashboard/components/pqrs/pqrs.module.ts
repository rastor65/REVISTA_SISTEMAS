import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PqrsRoutingModule } from './pqrs-routing.module';
import { PqrsComponent } from './pqrs.component';
import { TipoSolicitudComponent } from './components/tipo-solicitud/tipo-solicitud.component';


@NgModule({
  declarations: [
    PqrsComponent,
    TipoSolicitudComponent,

  ],
  imports: [
    CommonModule,
    PqrsRoutingModule,
  ]
})
export class PqrsModule { }
