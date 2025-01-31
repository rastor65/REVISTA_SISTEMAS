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
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmationService } from 'primeng/api';

import { RevistasRoutingModule } from './revistas-routing.module';
import { RevistasComponent } from './revistas.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    VerComponent,
    CrearComponent,
    EditarComponent,
    EliminarComponent,
    RevistasComponent
  ],
  imports: [
    CommonModule, 
    RevistasRoutingModule, 
    
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
    SolicitudesService,
    ConfirmationService
  ],
})
export class RevistasModule { }
