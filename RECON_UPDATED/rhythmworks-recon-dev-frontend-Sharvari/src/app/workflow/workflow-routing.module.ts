import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { DefineWorkflowComponent } from './define-workflow/define-workflow.component';
import { LevelComponent } from './level/level.component';
import { WorkflowComponent } from './workflow/workflow.component';

const routes: Routes = [
  {
    path: 'define_workflow', 
    component: DefineWorkflowComponent
  },
  {
    path: 'activity',
    component: ActivityComponent
  },
  {
    path: 'level',
    component: LevelComponent
  },
  {
    path: 'workflow',
    component: WorkflowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
