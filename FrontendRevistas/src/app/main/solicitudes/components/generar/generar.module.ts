import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GenerarRoutingModule } from './generar-routing.module';
import { GenerarComponent } from './generar.component';
import { SolicitudesService } from 'src/app/core/services/solicitudes/solicitudes.service';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { calendarFormat } from 'moment';
import { DropdownModule } from 'primeng/dropdown';
import { EditarComponent } from './components/editar/editar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { CrearComponent } from './components/crear/crear.component';
import { VerComponent } from './components/ver/ver.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MisSolicitudesComponent } from './components/mis-solicitudes/mis-solicitudes.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { Card, CardModule } from 'primeng/card';

@NgModule({
  declarations: [
    GenerarComponent,
    EditarComponent,
    EliminarComponent,
    CrearComponent, 
    VerComponent, MisSolicitudesComponent,
  ],
  imports: [
    CommonModule,
    GenerarRoutingModule,
    CardModule,
    MessageModule,
    
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    KeyFilterModule,
    ToastModule,
    DialogModule,
    ConfirmPopupModule,
    CalendarModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    AccordionModule,
    PanelModule,
    FileUploadModule,
    MultiSelectModule,
    ProgressSpinnerModule,

  ], 
  providers:[
    DatePipe, 
    SolicitudesService, 
    AuthService,
    Card,
  ],
})
export class GenerarModule { }