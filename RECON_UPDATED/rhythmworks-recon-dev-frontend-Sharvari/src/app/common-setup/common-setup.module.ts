import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonSetupRoutingModule } from './common-setup-routing.module';
import { UomComponent } from './uom/uom.component';
import { CurrencyComponent } from './currency/currency.component';
import { LocationComponent } from './location/location.component';
import { TermComponent } from './term/term.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReasonComponent } from './reason/reason.component';
import { CalendarComponent } from './calendar/calendar.component';


@NgModule({
  declarations: [UomComponent, CurrencyComponent, LocationComponent,TermComponent, ReasonComponent, CalendarComponent],
  imports: [
    CommonModule,
    CommonSetupRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatButtonToggleModule,
    
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,

  ]
})
export class CommonSetupModule { }
