import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerComponent } from './components/ver/ver.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecursosRoutingModule } from './recursos-routing.module';


import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

import { ConfirmPopupModule } from 'primeng/confirmpopup';


import { CardModule } from 'primeng/card';
import { RecursosComponent } from './recursos.component';


@NgModule({
  declarations: [
    VerComponent,
    RecursosComponent
  ],
  imports: [
    CommonModule,
    RecursosRoutingModule,

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
  ]
})
export class RecursosModule { }
