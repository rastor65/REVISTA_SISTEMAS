import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { VerComponent } from './components/ver/ver.component';

const routes: Routes = [
  {
    path: 'ver',
    component: VerComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluarRoutingModule { }

