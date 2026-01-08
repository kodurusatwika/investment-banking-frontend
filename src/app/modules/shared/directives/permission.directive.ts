import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set appPermission(requiredPermissions: string[]) {
    const user = this.authService.getCurrentUserValue();
    const hasPermission = requiredPermissions.includes(user?.role || '');
    
    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}