import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    
    .empty-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    .empty-title {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 8px;
      color: #333;
    }
    
    .empty-message {
      font-size: 16px;
      margin-bottom: 24px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  `],
  standalone: false
})
export class EmptyStateComponent {
  @Input() icon = 'info';
  @Input() title = 'No Data';
  @Input() message = 'There is no data to display.';
}