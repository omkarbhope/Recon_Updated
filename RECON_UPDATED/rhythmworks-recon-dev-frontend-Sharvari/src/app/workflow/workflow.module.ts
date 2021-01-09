import { DefineWorkflowComponent } from './define-workflow/define-workflow.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { WorkflowComponent } from './workflow/workflow.component';
import { LevelComponent } from './level/level.component';
import { ActivityComponent } from './activity/activity.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [DefineWorkflowComponent, WorkflowComponent, LevelComponent, ActivityComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class WorkflowModule { }


