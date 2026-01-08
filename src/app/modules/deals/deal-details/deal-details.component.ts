import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DealService } from '../../../core/services/deal.service';
import { AuthService } from '../../../core/services/auth.service';
import { Deal, DealStage, DealType } from '../../../core/models/deal.model';
import { AddNoteDialogComponent } from '../add-note-dialog/add-note-dialog.component';

@Component({
  selector: 'app-deal-details',
  templateUrl: './deal-details.component.html',
  styleUrls: ['./deal-details.component.css'],
  standalone: false
})
export class DealDetailsComponent implements OnInit {
  deal: Deal | null = null;
  loading = false;
  isAdmin = false;
  
  dealStages = Object.values(DealStage);
  
  constructor(
    private route: ActivatedRoute,
    private dealService: DealService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.isAdmin = this.authService.isAdmin();
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadDeal(id);
    });
  }
  
  loadDeal(id: number): void {
    this.loading = true;
    this.dealService.getDealById(id).subscribe({
      next: (deal) => {
        this.deal = deal;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load deal', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
  
  updateStage(stage: string): void {
    if (this.deal) {
      this.dealService.updateDealStage(this.deal.id, stage).subscribe({
        next: (updatedDeal) => {
          this.deal!.currentStage = updatedDeal.currentStage;
          this.snackBar.open('Stage updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to update stage', 'Close', { duration: 3000 });
        }
      });
    }
  }
  
  updateValue(): void {
    if (this.deal) {
      const newValue = prompt('Enter new deal value:', this.deal.dealValue?.toString() || '');
      if (newValue !== null) {
        const value = parseFloat(newValue);
        if (!isNaN(value)) {
          this.dealService.updateDealValue(this.deal.id, value).subscribe({
            next: (updatedDeal) => {
              this.deal!.dealValue = updatedDeal.dealValue;
              this.snackBar.open('Value updated successfully', 'Close', { duration: 3000 });
            },
            error: (error) => {
              this.snackBar.open('Failed to update value', 'Close', { duration: 3000 });
            }
          });
        }
      }
    }
  }
  
  openAddNoteDialog(): void {
    const dialogRef = this.dialog.open(AddNoteDialogComponent, {
      width: '500px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.deal) {
        this.dealService.addNote(this.deal.id, { note: result }).subscribe({
          next: (updatedDeal) => {
            this.deal!.notes = updatedDeal.notes;
            this.snackBar.open('Note added successfully', 'Close', { duration: 3000 });
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