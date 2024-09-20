import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RespuestasRoutingModule } from './respuestas-routing.module';
import { RespuestasComponent } from './respuestas.component';
import { VerComponent } from './components/ver/ver.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { VerUnaComponent } from './components/ver-una/ver-una.component';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [
    RespuestasComponent,
    VerComponent,
    CrearComponent,
    EditarComponent,
    EliminarComponent,
    VerUnaComponent
  ],
  imports: [
    CommonModule,
    RespuestasRoutingModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmPopupModule,
    AccordionModule,
    FormsModule,
  ReactiveFormsModule,
  ]
})
export class RespuestasModule { }
