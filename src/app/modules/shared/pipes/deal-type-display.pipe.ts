import { Pipe, PipeTransform } from '@angular/core';
import { DealType } from '../../../core/models/deal.model';

@Pipe({
  name: 'dealTypeDisplay'
})
export class DealTypeDisplayPipe implements PipeTransform {
  transform(type: DealType): string {
    const typeMap: Record<DealType, string> = {
      [DealType.M_A]: 'M&A',
      [DealType.EQUITY_FINANCING]: 'Equity Financing',
      [DealType.DEBT_OFFERING]: 'Debt Offering',
      [DealType.IPO]: 'IPO'
    };
    return typeMap[type] || type;
  }
}