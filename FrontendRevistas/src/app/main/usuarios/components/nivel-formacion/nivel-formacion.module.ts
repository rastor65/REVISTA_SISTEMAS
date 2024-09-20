import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { VerComponent } from './components/ver/ver.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { NivelFormacionComponent } from './nivel-formacion.component';
import { NivelFormacionRoutingModule } from './nivel-formacion-routing.module';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';


@NgModule({
  declarations: [
    NivelFormacionComponent,
    CrearComponent,
    EditarComponent,
    VerComponent,
    EliminarComponent
  ],
  imports: [
    CommonModule,
    NivelFormacionRoutingModule,
    
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    KeyFilterModule,
    ToastModule,
    DialogModule,
    ConfirmPopupModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
  ]
})
export class NivelFormacionModule { }
