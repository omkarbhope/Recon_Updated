import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReconcilationRoutingModule } from './reconcilation-routing.module';
import { DefineReconcilationComponent } from './define-reconcilation/define-reconcilation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { SourceComponent } from './source/source.component';
import { DefineReconciliationProcessComponent } from './define-reconciliation-process/define-reconciliation-process.component';
import { ScheduleProcessComponent } from './schedule-process/schedule-process.component';
import { DisputeResolutionComponent } from './dispute-resolution/dispute-resolution.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [DefineReconcilationComponent, SourceComponent, DefineReconciliationProcessComponent, ScheduleProcessComponent, DisputeResolutionComponent],
  imports: [
    CommonModule,
    ReconcilationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatProgressBarModule
  ]
})
export class ReconcilationModule { }
