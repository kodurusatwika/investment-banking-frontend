import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { SharedModule } from './modules/shared/shared.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { LoginComponent } from './modules/auth/login.component';
import { DealListComponent } from './modules/deals/deal-list/deal-list.component';
import { DealFormComponent } from './modules/deals/deal-form/deal-form.component';
import { DealDetailsComponent } from './modules/deals/deal-details/deal-details.component';
import { UserManagementComponent } from './modules/admin/user-management.component';
import { AddNoteDialogComponent } from './modules/deals/add-note-dialog/add-note-dialog.component';
import { ConfirmDialogComponent } from './modules/shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from './modules/shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from './modules/shared/components/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DealListComponent,
    DealFormComponent,
    DealDetailsComponent,
    UserManagementComponent,
    AddNoteDialogComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }