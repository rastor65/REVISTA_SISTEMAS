import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnexoComponent } from './components/anexo/anexo.component';
import { AsignacionComponent } from './components/asignacion/asignacion.component';
import { CrudComponent } from './components/crud/crud.component';
import { RespuestasComponent } from './components/respuestas/respuestas.component';
import { TipoSolicitudComponent } from './components/tipo-solicitud/tipo-solicitud.component';

const routes: Routes = [
  {
    path:'respuesta',
    component: RespuestasComponent,
    loadChildren: ()=> import('./components/respuestas/respuestas.module').then( m => m.RespuestasModule)
  },
  {
    path:'solicitud',
    component: CrudComponent,
    loadChildren: ()=> import('./components/crud/crud.module').then( m => m.CrudModule)
  },
  {
    path:'tipo',
    component: TipoSolicitudComponent,
    loadChildren: ()=> import('./components/tipo-solicitud/tipo-solicitud.module').then( m => m.TipoSolicitudModule)
  },
  {
    path:'asignacion',
    component: AsignacionComponent,
    loadChildren: ()=> import('./components/asignacion/asignacion.module').then( m => m.AsignacionModule)
  },
  {
    path:'anexo',
    component: AnexoComponent,
    loadChildren: ()=> import('./components/anexo/anexo.module').then( m => m.AnexoModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PqrsRoutingModule { }
