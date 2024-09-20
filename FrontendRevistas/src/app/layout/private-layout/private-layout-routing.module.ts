import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateGuard } from 'src/app/core/guards/validate.guard';
import { LandingComponent } from './landing/landing.component';
import { PrivateLayoutComponent } from './private-layout.component';

const routes: Routes = [ 
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [ValidateGuard],
    canLoad:[ValidateGuard],
    children: [
      {
        path: 'landing',
        component: LandingComponent
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../../main/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'administrador',
        loadChildren: () => import('../../main/admin/admin.module').then(m => m.AdminModule),
      },
      {
        path: 'solicitudes',
        loadChildren: () => import('../../main/solicitudes/solicitudes.module').then(m => m.SolicitudesModule),
      },
      {
        path: 'usuarios',
        loadChildren: () => import('../../main/usuarios/usuarios.module').then(m => m.UsuariosModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateLayoutRoutingModule { }
