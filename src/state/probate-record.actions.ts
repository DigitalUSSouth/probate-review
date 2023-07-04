import { createAction, props } from '@ngrx/store';
import {
  ModelProbateRecordFilterInput,
  ProbateRecord,
  ModelSortDirection
} from '../app/API.service';

export const LOAD_FILTERED_PROBATE_RECORDS = '[Probate Records] Load Filtered Probate Records';
export const LOAD_FILTERED_PROBATE_RECORDS_SUCCESS = '[Probate Records] Load Filtered Probate Records Success';
export const LOAD_FILTERED_PROBATE_RECORDS_FAILURE = '[Probate Records] Load Filtered Probate Records Failure';
export const SET_PROBATE_RECORD_FILTER = '[ProbateRecord] Set Filter';

export const loadProbateRecords = createAction(
  '[ProbateRecord] Load ProbateRecords',
  props<{
    pageSize: number;
    filter?: ModelProbateRecordFilterInput;
    nextToken?: string | null | undefined;
  }>()
);

export const loadProbateRecordsSuccess = createAction(
  '[ProbateRecord] Load ProbateRecords Success',
  props<{ probateRecords: ProbateRecord[]; nextToken: string | null | undefined }>()
);

export const loadProbateRecordsSuccessWithHistoryState = createAction(
  '[ProbateRecord] Load Probate Records Success with History State',
  props<{ probateRecords: ProbateRecord[] }>()
);

export const loadProbateRecordsFailure = createAction(
  '[ProbateRecord] Load ProbateRecords Failure',
  props<{ error: any }>()
);

export const clearProbateRecords = createAction('[ProbateRecord] Clear Returned Records');

export const updateProbateRecord = createAction(
  '[Probate Record] Update Probate Record',
  props<{ probateRecord: ProbateRecord }>()
);

export const updateProbateRecordSuccess = createAction(
  '[Probate Record] Update Probate Record Success',
  props<{ probateRecord: ProbateRecord }>()
);

export const updateProbateRecordFailure = createAction(
  '[Probate Record] Update Probate Record Failure',
  props<{ error: any }>()
);

// Action creator function
export const updateProbateRecordAction = (probateRecord: ProbateRecord) => {
  return updateProbateRecord({ probateRecord });
};


export const createProbateRecord = createAction(
  '[Probate Record] Create Probate Record',
  props<{ probateRecord: ProbateRecord }>()
);

export const deleteProbateRecord = createAction(
  '[Probate Record] Delete Probate Record',
  props<{ id: string }>()
);


export const setPage = createAction(
  '[Probate Record] Set Current Page',
  props<{ currentPage: number }>()
);

export const loadFilteredProbateRecords = createAction(
  LOAD_FILTERED_PROBATE_RECORDS,
  props<{
    filter: ModelProbateRecordFilterInput;
    limit: number;
    nextToken: string | null | undefined;
    sortDirection: ModelSortDirection;
  }>()
);

export const loadFilteredProbateRecordsSuccess = createAction(
  LOAD_FILTERED_PROBATE_RECORDS_SUCCESS,
  props<{ records: ProbateRecord[]; nextToken: string | null | undefined}>()
);

export const loadFilteredProbateRecordsFailure = createAction(
  LOAD_FILTERED_PROBATE_RECORDS_FAILURE,
  props<{ error: string }>()
);

export const setProbateRecordFilter = createAction(
  SET_PROBATE_RECORD_FILTER,
  props<{ filter: ModelProbateRecordFilterInput }>()
);

export const loadProbateRecordById = createAction(
  '[Probate Record] Load Probate Record By ID',
  props<{ id: string }>()
);

export const loadProbateRecordByIdSuccess = createAction(
  '[Probate Record] Load Probate Record By ID Success',
  props<{ probateRecord: ProbateRecord }>()
);

export const loadProbateRecordByIdFailure = createAction(
  '[Probate Record] Load Probate Record By ID Failure',
  props<{ error: string }>()
);

export const loadSelectedRecordsById = createAction(
  '[Probate Record] Load Selected Probate Records By ID',
  props<{ ids: string[] }>()
);

export const loadSelectedProbateRecordsByIdSuccess = createAction(
  '[Probate Record] Load Selected Probate Records By ID Success',
  props<{ probateRecords: ProbateRecord[] }>()
);

export const loadSelectedProbateRecordsByIdFailure = createAction(
  '[Probate Record] Load Selected Probate Records By ID Failure',
  props<{ error: string }>()
);
