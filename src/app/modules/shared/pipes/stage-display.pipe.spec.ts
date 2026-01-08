import { StageDisplayPipe } from './stage-display.pipe';
import { DealStage } from '../../../core/models/deal.model';

describe('StageDisplayPipe', () => {
  let pipe: StageDisplayPipe;

  beforeEach(() => {
    pipe = new StageDisplayPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform PROSPECT to "Prospect"', () => {
    expect(pipe.transform(DealStage.PROSPECT)).toBe('Prospect');
  });

  it('should transform UNDER_EVALUATION to "Under Evaluation"', () => {
    expect(pipe.transform(DealStage.UNDER_EVALUATION)).toBe('Under Evaluation');
  });

  it('should transform TERM_SHEET_SUBMITTED to "Term Sheet Submitted"', () => {
    expect(pipe.transform(DealStage.TERM_SHEET_SUBMITTED)).toBe('Term Sheet Submitted');
  });

  it('should transform CLOSED to "Closed"', () => {
    expect(pipe.transform(DealStage.CLOSED)).toBe('Closed');
  });

  it('should transform LOST to "Lost"', () => {
    expect(pipe.transform(DealStage.LOST)).toBe('Lost');
  });

  it('should return original value for unknown stage', () => {
    expect(pipe.transform('UNKNOWN' as any)).toBe('UNKNOWN');
  });
});