import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrudRoutingModule } from './crud-routing.module';
import { CrudComponent } from './crud.component';
import { CrearComponent } from './components/crear/crear.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { EditarComponent } from './components/editar/editar.component';
import { VerComponent } from './components/ver/ver.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {InputTextareaModule} from 'primeng/inputtextarea';


@NgModule({
  declarations: [
    CrudComponent,
    CrearComponent,
    EliminarComponent,
    EditarComponent,
    VerComponent
  ],
  imports: [
    CommonModule,
    CrudRoutingModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmPopupModule,   
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextareaModule
  ]
})
export class CrudModule { }
