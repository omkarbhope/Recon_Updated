import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UomComponent } from './uom/uom.component';
import { CurrencyComponent } from './currency/currency.component';
import { LocationComponent } from './location/location.component';
import { TermComponent } from './term/term.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ReasonComponent } from './reason/reason.component';

const routes: Routes = [
  {
    path: 'uom',
    component: UomComponent
  },
  {
    path: 'currency', 
    component: CurrencyComponent
  },
  {
    path: 'location',
    component: LocationComponent
  }, 
  {
    path: 'calender',
    component: CalendarComponent
  }, 
  {
    path: 'reason',
    component: ReasonComponent
  },    
  {
    path: 'term',
    component: TermComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonSetupRoutingModule { }
