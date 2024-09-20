import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentosRoutingModule } from './momentos-routing.module';
import { MomentosComponent } from './momentos.component';

import { CrearComponent } from './components/crear/crear.component';
import { VerComponent } from './components/ver/ver.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { EditarComponent } from './components/editar/editar.component';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

import {DialogModule} from 'primeng/dialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';

@NgModule({
  declarations: [
    MomentosComponent,
    CrearComponent,
    VerComponent,
    EliminarComponent,
    EditarComponent
  ],
  imports: [
    CommonModule,
    MomentosRoutingModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmPopupModule
  ]
})
export class MomentosModule { }
