import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearComponent } from './components/crear/crear.component';
import { VerComponent } from './components/ver/ver.component';

const routes: Routes = [
  {
    path: 'crear',
    component: CrearComponent
  },
  {
    path: 'ver',
    component: VerComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRecursosRoutingModule { }
