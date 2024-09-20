import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerarComponent } from './components/generar/generar.component';
import { EvaluarComponent } from './components/evaluar/evaluar.component';
import { SeguimientoComponent } from './components/seguimiento/seguimiento.component';
import { PasosComponent } from './components/pasos/pasos.component';
import { EstadosComponent } from './components/estados/estados.component';
import { RevistasComponent } from './components/revistas/revistas.component';


const routes: Routes = [
  {
    path: 'estados',
    component: EstadosComponent,
    loadChildren: ()=> import('./components/estados/estados.module').then(m => m.EstadosModule)
  },
  {
    path: 'pasos',
    component: PasosComponent,
    loadChildren: ()=> import('./components/pasos/pasos.module').then(m => m.PasosModule)
  },
  {
    path: 'generar',
    component: GenerarComponent,
    loadChildren: ()=> import('./components/generar/generar.module').then(m => m.GenerarModule)
  },
  {
    path: 'evaluar',
    component: EvaluarComponent,
    loadChildren: ()=> import('./components/evaluar/evaluar.module').then(m => m.EvaluarModule)
  },
  {
    path: 'seguimiento',
    component: SeguimientoComponent,
    loadChildren: ()=> import('./components/seguimiento/seguimiento.module').then(m => m.SeguimientoModule)
  },
  {
    path: 'revistas',
    component: RevistasComponent,
    loadChildren: ()=> import('./components/revistas/revistas.module').then(m => m.RevistasModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudesRoutingModule { }
