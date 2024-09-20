import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { RolesRecursosComponent } from './components/roles-recursos/roles-recursos.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    RolesRecursosComponent,
  
    UserRolesComponent,
    AdminComponent,
  ],
  exports:[
    RolesRecursosComponent,
  ]
  ,
  imports: [
    CommonModule,
    DropdownModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
