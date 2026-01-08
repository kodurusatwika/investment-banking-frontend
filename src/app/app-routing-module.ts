import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login.component';
import { DealListComponent } from './modules/deals/deal-list/deal-list.component';
import { DealFormComponent } from './modules/deals/deal-form/deal-form.component';
import { DealDetailsComponent } from './modules/deals/deal-details/deal-details.component';
import { UserManagementComponent } from './modules/admin/user-management.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'deals', 
    canActivate: [AuthGuard],//AuthGuard to protect authenticated pages
    children: [
      { path: '', component: DealListComponent },
      { path: 'create', component: DealFormComponent },
      { path: 'edit/:id', component: DealFormComponent },
      { path: 'view/:id', component: DealDetailsComponent }
    ]
  },
  { 
    path: 'admin/users', 
    component: UserManagementComponent, 
    canActivate: [AuthGuard, RoleGuard] //admin only access
  },
  { path: '', redirectTo: '/deals', pathMatch: 'full' },
  { path: '**', redirectTo: '/deals' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }