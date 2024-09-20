import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { VerComponent } from './components/ver/ver.component';
import { EditarComponent } from './components/editar/editar.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { CrearComponent } from './components/crear/crear.component';
import { MisSeguimientosComponent } from './components/mis-seguimientos/mis-seguimientos.component';
import { SolicitudesAsignadasComponent } from './components/solicitudes-asignadas/solicitudes-asignadas.component';

const routes: Routes = [
  {
    path: 'ver',
    component: VerComponent,
  },
  {
    path: 'crear',
    component: CrearComponent,
  },
  {
    path: 'editar',
    component: EditarComponent,
  },
  {
    path: 'eliminar',
    component: EliminarComponent,
  },
  {
    path: 'mis_seguimientos',
    component: MisSeguimientosComponent,
  },
  {
    path: 'solicitudes_asignadas',
    component: SolicitudesAsignadasComponent,
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguimientoRoutingModule { }

