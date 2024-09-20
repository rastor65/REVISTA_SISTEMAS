import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmprendimientosRoutingModule } from './emprendimientos-routing.module';
import { EmprendimientosComponent } from './emprendimientos.component';
import { CrearComponent } from './components/crear/crear.component';
import { VerComponent } from './components/ver/ver.component';
import { EditarComponent } from './components/editar/editar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputTextareaModule } from 'primeng/inputtextarea';



@NgModule({
  declarations: [
    EmprendimientosComponent,
    CrearComponent,
    VerComponent,
    EditarComponent,
    EliminarComponent
  ],
  imports: [
    CommonModule,
    EmprendimientosRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    TableModule,
    DialogModule,
    DropdownModule,
    ConfirmPopupModule,
    InputTextareaModule,

  ]
})
export class EmprendimientosModule { }
