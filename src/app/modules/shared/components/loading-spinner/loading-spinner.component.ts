import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  
  template: `
    <div class="loading-spinner" [ngClass]="{ 'overlay': overlay }">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <p *ngIf="message" class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .loading-spinner.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 1000;
    }
    
    .loading-message {
      margin-top: 16px;
      color: #666;
      font-size: 14px;
    }
  `],
  standalone: false
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
  @Input() message = '';
  @Input() overlay = false;
}