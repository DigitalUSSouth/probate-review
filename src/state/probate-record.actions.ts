import { createAction, props } from '@ngrx/store';
import {
  ModelProbateRecordFilterInput,
  ProbateRecord,
} from '../app/API.service';

export const loadProbateRecords = createAction(
  '[ProbateRecord] Load ProbateRecords',
  props<{
    pageSize: number;
    filter?: ModelProbateRecordFilterInput;
    nextToken?: string;
  }>()
);

export const loadProbateRecordsSuccess = createAction(
  '[ProbateRecord] Load ProbateRecords Success',
  props<{ probateRecords: ProbateRecord[]; nextToken: string | null }>()
);
export const loadProbateRecordsFailure = createAction(
  '[ProbateRecord] Load ProbateRecords Failure',
  props<{ error: any }>()
);

export const updateProbateRecord = createAction(
  '[Probate Record] Update Probate Record',
  props<{ probateRecord: ProbateRecord }>()
);

export const createProbateRecord = createAction(
  '[Probate Record] Create Probate Record',
  props<{ probateRecord: ProbateRecord }>()
);

export const deleteProbateRecord = createAction(
  '[Probate Record] Delete Probate Record',
  props<{ id: string }>()
);

export const updateProbateRecordSuccess = createAction(
  '[Probate Record] Update Probate Record Success',
  props<{ probateRecord: ProbateRecord }>()
);

// Action creator function
export const updateProbateRecordAction = (probateRecord: ProbateRecord) => {
  return updateProbateRecord({ probateRecord });
};

export const setPage = createAction(
  '[Probate Record] Set Current Page',
  props<{ currentPage: number }>()
);
