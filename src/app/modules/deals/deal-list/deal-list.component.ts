import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DealService } from '../../../core/services/deal.service';
import { AuthService } from '../../../core/services/auth.service';
import { Deal, DealStage, DealType } from '../../../core/models/deal.model';
import { AddNoteDialogComponent } from '../add-note-dialog/add-note-dialog.component';
import { DialogService } from '../../../modules/shared/services/dialog.service';

@Component({
  selector: 'app-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.css'],
  standalone: false
})
export class DealListComponent implements OnInit {
  deals: Deal[] = [];
  filteredDeals: Deal[] = [];
  loading = false;
  isAdmin = false;
  
  filters = {
    clientName: '',
    dealType: '',
    sector: '',
    stage: ''
  };
  
  dealTypes = Object.values(DealType);
  dealStages = Object.values(DealStage);
  
  displayedColumns: string[] = [
    'clientName', 'dealType', 'sector', 'currentStage', 
    'assignedTo', 'createdAt', 'actions'
  ];
  
  constructor(
    private dealService: DealService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {
    this.isAdmin = this.authService.isAdmin();
  }
  
  ngOnInit(): void {
    this.loadDeals();
  }
  
  loadDeals(): void {
    this.loading = true;
    this.dealService.getDeals(this.filters).subscribe({
      next: (deals) => {
        this.deals = deals;
        this.filteredDeals = [...deals];
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load deals', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
  
  applyFilters(): void {
    this.loadDeals();
  }
  
  resetFilters(): void {
    this.filters = {
      clientName: '',
      dealType: '',
      sector: '',
      stage: ''
    };
    this.loadDeals();
  }
  
  viewDeal(id: number): void {
    this.router.navigate(['/deals/view', id]);
  }
  
  editDeal(id: number): void {
    this.router.navigate(['/deals/edit', id]);
  }
  
  deleteDeal(id: number): void {
    this.dialogService.confirm({
      title: 'Delete Deal',
      message: 'Are you sure you want to delete this deal? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: 'warn'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.dealService.deleteDeal(id).subscribe({
          next: () => {
            this.snackBar.open('Deal deleted successfully', 'Close', { duration: 3000 });
            this.loadDeals();
          },
          error: (error) => {
            this.snackBar.open('Failed to delete deal', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
  
  updateStage(deal: Deal, stage: string): void {
    this.dealService.updateDealStage(deal.id, stage).subscribe({
      next: (updatedDeal) => {
        deal.currentStage = updatedDeal.currentStage;
        this.snackBar.open('Stage updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to update stage', 'Close', { duration: 3000 });
      }
    });
  }
  
  openAddNoteDialog(deal: Deal): void {
    const dialogRef = this.dialog.open(AddNoteDialogComponent, {
      width: '500px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dealService.addNote(deal.id, { note: result }).subscribe({
          next: () => {
            this.snackBar.open('Note added successfully', 'Close', { duration: 3000 });
            this.loadDeals();
          },
          error: (error) => {
            this.snackBar.open('Failed to add note', 'Close', { duration: 3000 });
          }
        });
      }
    });
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
  
  getStageColor(stage: DealStage): string {
    const colorMap: Record<DealStage, string> = {
      [DealStage.PROSPECT]: 'primary',
      [DealStage.UNDER_EVALUATION]: 'accent',
      [DealStage.TERM_SHEET_SUBMITTED]: 'warn',
      [DealStage.CLOSED]: 'primary',
      [DealStage.LOST]: 'warn'
    };
    return colorMap[stage];
  }
}