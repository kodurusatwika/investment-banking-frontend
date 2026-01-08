import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: data,
      disableClose: true
    });
    
    return dialogRef.afterClosed();
  }

  confirmDelete(message: string = 'Are you sure you want to delete this item?'): Observable<boolean> {
    return this.confirm({
      title: 'Confirm Delete',
      message: message,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: 'warn',
      icon: 'delete',
      iconColor: 'warn'
    });
  }

  confirmWarning(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title: title,
      message: message,
      confirmText: 'Proceed',
      cancelText: 'Cancel',
      confirmColor: 'warn',
      icon: 'warning',
      iconColor: 'warn'
    });
  }

  confirmInfo(title: string, message: string): Observable<boolean> {
    return this.confirm({
      title: title,
      message: message,
      confirmText: 'OK',
      cancelText: 'Cancel',
      confirmColor: 'primary',
      icon: 'info',
      iconColor: 'primary'
    });
  }
}