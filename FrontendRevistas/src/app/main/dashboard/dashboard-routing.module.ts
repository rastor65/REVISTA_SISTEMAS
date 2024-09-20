import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClasificadosComponent } from './components/clasificados/clasificados.component';
import { EncuestasComponent } from './components/encuestas/encuestas.component';
import { PqrsComponent } from './components/pqrs/pqrs.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'encuestas',
        component: EncuestasComponent,
        loadChildren: () => import('./components/encuestas/encuestas.module').then(m => m.EncuestasModule)
      },
      {
        path: 'pqrs',
        component: PqrsComponent,
        loadChildren: () => import('./components/pqrs/pqrs.module').then(m => m.PqrsModule)
      },
      {
        path: 'clasificados',
        component: ClasificadosComponent,
        loadChildren: () => import('./components/clasificados/clasificados.module').then(m => m.ClasificadosModule)
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, ]
})
export class DashboardRoutingModule { }
