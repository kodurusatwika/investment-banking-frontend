import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'warn' | 'accent';
  icon?: string;
  iconColor?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  standalone: false
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getIcon(): string {
    if (this.data.icon) {
      return this.data.icon;
    }
    
    // Default icons based on confirm color
    switch (this.data.confirmColor) {
      case 'warn':
        return 'warning';
      case 'accent':
        return 'info';
      default:
        return 'help_outline';
    }
  }

  getIconColor(): string {
    if (this.data.iconColor) {
      return this.data.iconColor;
    }
    
    // Default colors based on confirm color
    switch (this.data.confirmColor) {
      case 'warn':
        return 'warn';
      case 'accent':
        return 'accent';
      default:
        return 'primary';
    }
  }
}