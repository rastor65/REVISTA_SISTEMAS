import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClasificadosComponent } from './clasificados.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { SeccionComponent } from './components/seccion/seccion.component';
import { SubCategoriaComponent } from './components/sub-categoria/sub-categoria.component';

const routes: Routes = [
  {
    path: 'emprendimientos',
    component: ClasificadosComponent,
    loadChildren: () => import('./components/emprendimientos/emprendimientos.module').then(m => m.EmprendimientosModule)
  },
  {
    path: 'categoria',
    component: CategoriaComponent,
    loadChildren: () => import('./components/categoria/categoria.module').then(m => m.CategoriaModule)
  },
  {
    path: 'sub-categoria',
    component: SubCategoriaComponent,
    loadChildren: () => import('./components/sub-categoria/sub-categoria.module').then(m => m.SubCategoriaModule)
  },
  {
    path: 'seccion',
    component: SeccionComponent,
    loadChildren: () => import('./components/seccion/seccion.module').then(m => m.SeccionModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasificadosRoutingModule { }
