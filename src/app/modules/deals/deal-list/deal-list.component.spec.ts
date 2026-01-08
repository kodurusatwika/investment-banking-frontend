/// <reference types="jasmine" />
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DealListComponent } from './deal-list.component';
import { DealService } from '../../../core/services/deal.service';
import { AuthService } from '../../../core/services/auth.service';
import { DialogService } from '../../shared/services/dialog.service';
import { Deal, DealType, DealStage } from '../../../core/models/deal.model';

describe('DealListComponent', () => {
  let component: DealListComponent;
  let fixture: ComponentFixture<DealListComponent>;
  let dealServiceSpy: jasmine.SpyObj<DealService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  const mockDeals: Deal[] = [
    {
      id: 1,
      clientName: 'Acme Corp',
      dealType: DealType.M_A,
      sector: 'Technology',
      dealValue: 50000000,
      currentStage: DealStage.PROSPECT,
      summary: 'Test deal 1',
      notes: [],
      createdBy: {
        id: 1,
        username: 'admin',
        email: 'admin@bank.com',
        role: 'ADMIN' as any,
        active: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      assignedTo: {
        id: 2,
        username: 'john',
        email: 'john@bank.com',
        role: 'USER' as any,
        active: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      clientName: 'Global Finance',
      dealType: DealType.EQUITY_FINANCING,
      sector: 'Finance',
      dealValue: 75000000,
      currentStage: DealStage.UNDER_EVALUATION,
      summary: 'Test deal 2',
      notes: [],
      createdBy: {
        id: 2,
        username: 'john',
        email: 'john@bank.com',
        role: 'USER' as any,
        active: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      assignedTo: {
        id: 1,
        username: 'admin',
        email: 'admin@bank.com',
        role: 'ADMIN' as any,
        active: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    const dealSpy = jasmine.createSpyObj('DealService', [
      'getDeals', 'deleteDeal', 'updateDealStage', 'addNote'
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', ['isAdmin']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogServiceSpyObj = jasmine.createSpyObj('DialogService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule
      ],
      declarations: [DealListComponent],
      providers: [
        { provide: DealService, useValue: dealSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj },
        { provide: DialogService, useValue: dialogServiceSpyObj }
      ]
    }).compileComponents();

    dealServiceSpy = TestBed.inject(DealService) as jasmine.SpyObj<DealService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialogServiceSpy = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealListComponent);
    component = fixture.componentInstance;
    
    // Mock admin status
    authServiceSpy.isAdmin.and.returnValue(true);
    
    // Mock initial deals load
    dealServiceSpy.getDeals.and.returnValue(of(mockDeals));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load deals on init', () => {
    expect(dealServiceSpy.getDeals).toHaveBeenCalled();
    expect(component.deals.length).toBe(2);
    expect(component.filteredDeals.length).toBe(2);
    expect(component.loading).toBeFalsy();
  });

  it('should navigate to deal details', () => {
    component.viewDeal(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/deals/view', 1]);
  });

  it('should navigate to edit deal', () => {
    component.editDeal(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/deals/edit', 1]);
  });

  it('should apply filters', () => {
    component.filters.clientName = 'Acme';
    component.applyFilters();
    
    expect(dealServiceSpy.getDeals).toHaveBeenCalledWith({
      clientName: 'Acme',
      dealType: '',
      sector: '',
      stage: ''
    });
  });

  it('should reset filters', () => {
    component.filters.clientName = 'Acme';
    component.filters.dealType = 'M_A';
    
    component.resetFilters();
    
    expect(component.filters.clientName).toBe('');
    expect(component.filters.dealType).toBe('');
    expect(dealServiceSpy.getDeals).toHaveBeenCalled();
  });

  it('should update deal stage', () => {
    const deal = mockDeals[0];
    dealServiceSpy.updateDealStage.and.returnValue(of({
      ...deal,
      currentStage: DealStage.UNDER_EVALUATION
    }));
    
    component.updateStage(deal, DealStage.UNDER_EVALUATION);
    
    expect(dealServiceSpy.updateDealStage).toHaveBeenCalledWith(1, 'UNDER_EVALUATION');
  });

  it('should get deal type display name', () => {
    expect(component.getDealTypeDisplay(DealType.M_A)).toBe('M&A');
    expect(component.getDealTypeDisplay(DealType.EQUITY_FINANCING)).toBe('Equity Financing');
  });

  it('should get stage display name', () => {
    expect(component.getStageDisplay(DealStage.PROSPECT)).toBe('Prospect');
    expect(component.getStageDisplay(DealStage.UNDER_EVALUATION)).toBe('Under Evaluation');
  });

  it('should show loading spinner', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show no data message when empty', fakeAsync(() => {
    dealServiceSpy.getDeals.and.returnValue(of([]));
    component.loadDeals();
    tick();
    fixture.detectChanges();
    
    const noDataMessage = fixture.nativeElement.querySelector('.no-data');
    expect(noDataMessage).toBeTruthy();
  }));
});