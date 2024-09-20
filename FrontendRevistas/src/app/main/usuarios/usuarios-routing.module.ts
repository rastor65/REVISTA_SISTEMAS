import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonasComponent } from './components/personas/personas.component';
import { NivelFormacionComponent } from './components/nivel-formacion/nivel-formacion.component';


const routes: Routes = [
  {
    path: 'personas',
    component: PersonasComponent,
    loadChildren: ()=> import('./components/personas/personas.module').then(m => m.PersonasModule)
  },
  {
    path: 'nivel_formacion',
    component: NivelFormacionComponent,
    loadChildren: ()=> import('./components/nivel-formacion/nivel-formacion.module').then(m => m.NivelFormacionModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }

