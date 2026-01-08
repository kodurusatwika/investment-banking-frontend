import { Pipe, PipeTransform } from '@angular/core';
import { DealStage } from '../../../core/models/deal.model';

@Pipe({
  name: 'stageDisplay'
})
export class StageDisplayPipe implements PipeTransform {
  transform(stage: DealStage): string {
    const stageMap: Record<DealStage, string> = {
      [DealStage.PROSPECT]: 'Prospect',
      [DealStage.UNDER_EVALUATION]: 'Under Evaluation',
      [DealStage.TERM_SHEET_SUBMITTED]: 'Term Sheet Submitted',
      [DealStage.CLOSED]: 'Closed',
      [DealStage.LOST]: 'Lost'
    };
    return stageMap[stage] || stage;
  }
}