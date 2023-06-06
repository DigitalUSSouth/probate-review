import { createAction, props } from '@ngrx/store';
import { ModelProbateRecordFilterInput, ProbateRecord } from '../app/API.service'

export const loadProbateRecords = createAction(
  '[ProbateRecord] Load ProbateRecords',
  props<{ pageSize: number; filter?: ModelProbateRecordFilterInput; nextToken?: string }>()
);

export const loadProbateRecordsSuccess = createAction(
  '[ProbateRecord] Load ProbateRecords Success',
  props<{ probateRecords: ProbateRecord[], nextToken: string | null }>()
);
export const loadProbateRecordsFailure = createAction(
  '[ProbateRecord] Load ProbateRecords Failure',
  props<{ error: any }>()
);