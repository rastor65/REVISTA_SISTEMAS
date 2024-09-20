import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VerComponent } from './components/ver/ver.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
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
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { EstadosComponent } from './estados.component';
import { EstadosRoutingModule } from './estados-routing.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    VerComponent,
    CrearComponent,
    EditarComponent,
    EliminarComponent, 
    EstadosComponent
  ],
  imports: [
    CommonModule, 
    EstadosRoutingModule,
    
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
    ConfirmDialogModule,
  ],
  providers:[
    DatePipe,
    SolicitudesService
  ],
})
export class EstadosModule { }
