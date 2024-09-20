import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncuestasRoutingModule } from './encuestas-routing.module';
import { EncuestasComponent } from './encuestas.component';


@NgModule({
  declarations: [
    EncuestasComponent
  ],
  imports: [
    CommonModule,
    EncuestasRoutingModule
  ]
})
export class EncuestasModule { }
