import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VerComponent } from './components/ver/ver.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { GenerosRoutingModule } from './generos-routing.module';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';


import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { GenerosComponent } from './generos.component';
import { CardModule } from 'primeng/card';
// import { ConfirmationService } from 'primeng/api';


@NgModule({
  declarations: [
    GenerosComponent,

    VerComponent,
    CrearComponent,
    EditarComponent,
    EliminarComponent
  ],
  providers: [
    // ConfirmationService
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    GenerosRoutingModule,

    TableModule,
    InputTextModule,
    ButtonModule,
    KeyFilterModule,
    ToastModule,
    DialogModule,
    ConfirmPopupModule,
    CardModule,
    MessageModule,
    MessagesModule,

  ]
})
export class GenerosModule { }
