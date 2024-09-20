import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MomentosComponent } from './components/momentos/momentos.component';
import { EncuestasComponent } from './encuestas.component';


const routes: Routes = [
  {
    path:'preguntas',
    component: EncuestasComponent,
    loadChildren: ()=>import('./components/preguntas/preguntas.module').then(m => m.PreguntasModule)
  },
  {
    path: 'momentos',
    component: MomentosComponent,
    loadChildren: ()=>import('./components/momentos/momentos.module').then( m => m.MomentosModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncuestasRoutingModule { }
