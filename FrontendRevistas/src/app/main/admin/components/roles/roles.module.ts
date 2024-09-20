import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RolesRoutingModule } from './roles-routing.module';
import { VerComponent } from './components/ver/ver.component';
import { CrearComponent } from './components/crear/crear.component';
import { RolesComponent } from './roles.component';



import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { EliminarComponent } from './components/eliminar/eliminar.component';


import { CardModule } from 'primeng/card';
// import { ConfirmationService } from 'primeng/api';


@NgModule({
  declarations: [
    VerComponent,
    CrearComponent,
    RolesComponent,
    EliminarComponent
  ],
  providers: [
    // ConfirmationService
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    TableModule,
    InputTextModule,
    ButtonModule,
    KeyFilterModule,
    ToastModule,
    DialogModule,
    ConfirmPopupModule,
    CardModule,
    MenuModule,

  ]
})
export class RolesModule { }
