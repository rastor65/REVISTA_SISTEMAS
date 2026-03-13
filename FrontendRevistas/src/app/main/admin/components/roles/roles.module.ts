import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RolesRoutingModule } from './roles-routing.module';
import { VerComponent } from './components/ver/ver.component';
import { RolesComponent } from './roles.component';



import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';

import { ConfirmPopupModule } from 'primeng/confirmpopup';


import { CardModule } from 'primeng/card';
// import { ConfirmationService } from 'primeng/api';


@NgModule({
  declarations: [
    VerComponent,
    RolesComponent,
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
