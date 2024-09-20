import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { RolesRecursosRoutingModule } from './components/roles-recursos/roles-recursos-routing.module';
import { RolesRecursosComponent } from './components/roles-recursos/roles-recursos.component';
import { RolesComponent } from './components/roles/roles.component';
import { RecursosComponent } from './components/recursos/recursos.component';
import { DocumentoComponent } from './components/documento/documento.component';
import { GenerosComponent } from './components/generos/generos.component';
import { UserRolesComponent } from './components/user-roles/user-roles.component';

const routes: Routes = [
  {
    path: 'roles',
    component: RolesComponent,
    loadChildren: ()=>import('./components/roles/roles.module').then(m => m.RolesModule)
  },
  {
    path: 'recursos',
    component: RecursosComponent,
    loadChildren: ()=>import('./components/recursos/recursos.module').then(m => m.RecursosModule)
  },
  {
    path: 'recursos_roles',
    component: RolesRecursosComponent,
    loadChildren: ()=>import('./components/roles-recursos/roles-recursos.module').then(m => m.RolesRecursosModule)
  },
  {
    path: 'user_roles',
    component: UserRolesComponent,
    loadChildren: ()=>import('./components/user-roles/user-roles.module').then(m => m.UserRolesModule)
  },
  {
    path: 'tipo_documento',
    component: DocumentoComponent,
    loadChildren: ()=>import('./components/documento/documento.module').then(m => m.DocumentoModule)
  },
  {
    path: 'generos',
    component: GenerosComponent,
    loadChildren: ()=>import('./components/generos/generos.module').then(m => m.GenerosModule)
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }


