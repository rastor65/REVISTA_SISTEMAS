import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerComponent } from './components/ver/ver.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';

const routes: Routes = [
  {
    path: 'ver',
    component: VerComponent
  },
  {
    path: 'editar',
    component: EditarComponent
  },
  {
    path: 'eliminar',
    component: EliminarComponent
  },
  {
    path: 'crear',
    component: CrearComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRolesRoutingModule { }