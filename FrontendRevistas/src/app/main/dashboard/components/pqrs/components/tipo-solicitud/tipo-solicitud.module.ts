import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoSolicitudRoutingModule } from './tipo-solicitud-routing.module';
import { VerComponent } from './components/ver/ver.component';
import { CrearComponent } from './components/crear/crear.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { EditarComponent } from './components/editar/editar.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@NgModule({
  declarations: [
    VerComponent,
    CrearComponent,
    EliminarComponent,
    EditarComponent
  ],
  imports: [
    CommonModule,
    TipoSolicitudRoutingModule,

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
export class TipoSolicitudModule { }
