import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefineReconcilationComponent } from './define-reconcilation/define-reconcilation.component';
import { SourceComponent } from './source/source.component';
import { DefineReconciliationProcessComponent } from './define-reconciliation-process/define-reconciliation-process.component';
import { ScheduleProcessComponent } from './schedule-process/schedule-process.component';
import {DisputeResolutionComponent } from './dispute-resolution/dispute-resolution.component'

const routes: Routes = [
  {
    path: 'define_reconcilation',
    component: DefineReconcilationComponent
  },
  {
    path: 'source',
    component: SourceComponent
  },
  {
    path: 'define_reconcilation_process',
    component: DefineReconciliationProcessComponent
  },
  {
    path: 'sechedule_process',
    component: ScheduleProcessComponent
  },
  {
    path: 'dispute_resolution',
    component: DisputeResolutionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReconcilationRoutingModule { }
