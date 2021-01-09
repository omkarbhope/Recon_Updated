import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiHubRoutingModule } from './api-hub-routing.module';
// import { DefineApiComponent } from './define-api/define-api.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiHubService } from '../services/api-hub.service';
import { DefineStandardApiDefinitionComponent } from './define-standard-api-definition/define-standard-api-definition.component';
import { DefineApiComponent } from './define-api/define-api.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    DefineStandardApiDefinitionComponent,
    DefineApiComponent
    // DefineApiComponent
  ],
  imports: [
    CommonModule,
    ApiHubRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatButtonToggleModule,
  ]
})
export class ApiHubModule { }

