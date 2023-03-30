import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProbateRecord } from '../../API.service';

export interface ProbateRecordState extends EntityState<ProbateRecord> {
  error: boolean;
  loading: boolean;
  total: number;
}

export const probateRecordAdapter: EntityAdapter<ProbateRecord> = createEntityAdapter<ProbateRecord>({
  selectId: (probateRecord: ProbateRecord) => probateRecord.id
});

export const initialProbateRecordState: ProbateRecordState = probateRecordAdapter.getInitialState({
  error: false,
  loading: true,
  total: 0
});