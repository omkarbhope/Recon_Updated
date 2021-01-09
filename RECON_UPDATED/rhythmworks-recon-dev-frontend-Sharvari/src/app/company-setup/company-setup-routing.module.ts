import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { TransactionTypeComponent } from './transaction-type/transaction-type.component'
import { UserformComponent } from './userform/userform.component'

const routes: Routes = [
  {
    path: 'company',
    component: CompanyComponent
  },
  {
    path: 'transaction-type',
    component: TransactionTypeComponent
  },
  {
    path: 'userform',
    component: UserformComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanySetupRoutingModule { }
