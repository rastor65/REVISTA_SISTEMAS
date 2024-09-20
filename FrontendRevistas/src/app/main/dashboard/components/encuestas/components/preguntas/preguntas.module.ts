import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreguntasRoutingModule } from './preguntas-routing.module';
import { PreguntasComponent } from './preguntas.component';
import { VerComponent } from './components/ver/ver.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { EditarComponent } from './components/editar/editar.component';
import { CrearComponent } from './components/crear/crear.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

import {ConfirmPopupModule} from 'primeng/confirmpopup';


@NgModule({
  declarations: [
    PreguntasComponent,
    VerComponent,
    EliminarComponent,
    EditarComponent,
    CrearComponent
  ],
  imports: [
    CommonModule,
    PreguntasRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    TableModule,
    DialogModule,
    DropdownModule,
    ConfirmPopupModule,
    
  ]
})
export class PreguntasModule { }
