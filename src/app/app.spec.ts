/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { of } from 'rxjs';
import { AppComponent } from './app';
import { AuthService } from './core/services/auth.service';

describe('App', () => {
  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'currentUser$']);
    authServiceSpy.currentUser$.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar')).toBeTruthy();
  });
});
