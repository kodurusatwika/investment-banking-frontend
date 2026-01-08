import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DealService } from '../../../core/services/deal.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Deal, DealType, DealStage, CreateDeal } from '../../../core/models/deal.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-deal-form',
  templateUrl: './deal-form.component.html',
  styleUrls: ['./deal-form.component.css'],
  standalone: false
})
export class DealFormComponent implements OnInit {
  dealForm: FormGroup;
  isEditMode = false;
  dealId: number | null = null;
  loading = false;
  users: User[] = [];
  
  dealTypes = Object.values(DealType);
  dealStages = Object.values(DealStage);
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dealService: DealService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.dealForm = this.fb.group({
      clientName: ['', Validators.required],
      dealType: ['', Validators.required],
      sector: ['', Validators.required],
      currentStage: ['', Validators.required],
      summary: [''],
      assignedToId: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.dealId = +params['id'];
        this.loadDeal(this.dealId);
      }
    });
  }
  
  loadUsers(): void {
    if (this.authService.isAdmin()) {
      this.userService.getAllUsers().subscribe(users => {
        this.users = users.filter(u => u.active);
      });
    } else {
      const currentUser = this.authService.getCurrentUserValue();
      if (currentUser) {
        this.users = [currentUser];
        this.dealForm.patchValue({ assignedToId: currentUser.id });
      }
    }
  }
  
  loadDeal(id: number): void {
    this.loading = true;
    this.dealService.getDealById(id).subscribe({
      next: (deal) => {
        this.dealForm.patchValue({
          clientName: deal.clientName,
          dealType: deal.dealType,
          sector: deal.sector,
          currentStage: deal.currentStage,
          summary: deal.summary,
          assignedToId: deal.assignedTo.id
        });
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load deal', 'Close', { duration: 3000 });
        this.router.navigate(['/deals']);
      }
    });
  }
  
  onSubmit(): void {
    if (this.dealForm.valid) {
      this.loading = true;
      const dealData: CreateDeal = this.dealForm.value;
      
      if (this.isEditMode && this.dealId) {
        this.dealService.updateDeal(this.dealId, dealData).subscribe({
          next: () => {
            this.snackBar.open('Deal updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/deals']);
          },
          error: (error) => {
            this.snackBar.open('Failed to update deal', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        this.dealService.createDeal(dealData).subscribe({
          next: () => {
            this.snackBar.open('Deal created successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/deals']);
          },
          error: (error) => {
            this.snackBar.open('Failed to create deal', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    }
  }
  
  getDealTypeDisplay(type: DealType): string {
    const typeMap: Record<DealType, string> = {
      [DealType.M_A]: 'M&A',
      [DealType.EQUITY_FINANCING]: 'Equity Financing',
      [DealType.DEBT_OFFERING]: 'Debt Offering',
      [DealType.IPO]: 'IPO'
    };
    return typeMap[type];
  }
  
  getStageDisplay(stage: DealStage): string {
    const stageMap: Record<DealStage, string> = {
      [DealStage.PROSPECT]: 'Prospect',
      [DealStage.UNDER_EVALUATION]: 'Under Evaluation',
      [DealStage.TERM_SHEET_SUBMITTED]: 'Term Sheet Submitted',
      [DealStage.CLOSED]: 'Closed',
      [DealStage.LOST]: 'Lost'
    };
    return stageMap[stage];
  }
}