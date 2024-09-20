import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerComponent } from './components/ver/ver.component';

import { SeguimientoComponent } from './seguimiento.component';
import { SeguimientoRoutingModule } from './seguimiento-routing.module';

import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CrearComponent } from './components/crear/crear.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { EditarComponent } from './components/editar/editar.component';

import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MisSeguimientosComponent } from './components/mis-seguimientos/mis-seguimientos.component';
import { SolicitudesAsignadasComponent } from './components/solicitudes-asignadas/solicitudes-asignadas.component';
import { TooltipModule } from 'primeng/tooltip';

import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [
    VerComponent,
    SeguimientoComponent,
    CrearComponent,
    EliminarComponent,
    EditarComponent,
    MisSeguimientosComponent,
    SolicitudesAsignadasComponent,
  ],
  imports: [
    CommonModule,
    SeguimientoRoutingModule,

    TableModule,
    InputTextModule,
    ButtonModule,
    KeyFilterModule,
    ToastModule,
    DialogModule,
    ConfirmPopupModule,
    ReactiveFormsModule,
    AvatarModule,
    AccordionModule,

    FormsModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    CardModule,
  ]
})
export class SeguimientoModule { }
