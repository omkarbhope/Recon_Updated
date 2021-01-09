import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/authentication.service';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'common-setup',
    loadChildren: () => import('./common-setup/common-setup.module').then(m => m.CommonSetupModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'company-setup',
    loadChildren: () => import('./company-setup/company-setup.module').then(m => m.CompanySetupModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'api-hub',
    loadChildren: () => import('./api-hub/api-hub.module').then(m => m.ApiHubModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reconcilation',
    loadChildren: () => import('./reconcilation/reconcilation.module').then(m => m.ReconcilationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'workflow',
    loadChildren: () => import('./workflow/workflow.module').then(m => m.WorkflowModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
