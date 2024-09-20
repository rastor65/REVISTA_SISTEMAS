import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnexoRoutingModule } from './anexo-routing.module';
import { AnexoComponent } from './anexo.component';
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
    AnexoComponent,
    CrearComponent,
    VerComponent,
    EditarComponent,
    EliminarComponent
  ],
  imports: [
    CommonModule,
    AnexoRoutingModule,

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
export class AnexoModule { }
