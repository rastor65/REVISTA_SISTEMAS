import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerComponent } from './components/ver/ver.component';

import { EvaluarComponent } from './evaluar.component';
import { EvaluarRoutingModule } from './evaluar-routing.module';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    VerComponent, 
    EvaluarComponent, 
  ],
  imports: [
    CommonModule, 
    EvaluarRoutingModule,
    DropdownModule,

    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    KeyFilterModule,
    ToastModule,
    DialogModule,
    ConfirmPopupModule,
    CheckboxModule,
    AvatarModule,
    
  ]
})
export class EvaluarModule { }
