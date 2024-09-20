import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasificadosRoutingModule } from './clasificados-routing.module';
import { ClasificadosComponent } from './clasificados.component';


@NgModule({
  declarations: [
    ClasificadosComponent
  ],
  imports: [
    CommonModule,
    ClasificadosRoutingModule
  ]
})
export class ClasificadosModule { }
