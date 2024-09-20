import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantenimientoComponent } from './main/mantenimiento/mantenimiento.component';
import { FormLoginComponent } from './layout/public-layout/components/form-login/form-login.component'


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: FormLoginComponent
  },
  { 
    path: 'mantenimiento',
    component:MantenimientoComponent
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
