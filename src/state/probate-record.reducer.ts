import { createReducer, on } from '@ngrx/store';
import { loadProbateRecords, loadProbateRecordsSuccess, loadProbateRecordsFailure } from './probate-record.actions';
import { ModelProbateRecordFilterInput, ProbateRecord } from '../app/API.service';

export interface ProbateRecordState {
  probateRecords: ProbateRecord[];
  pageSize: number;
  nextToken: string | null;
  filter: ModelProbateRecordFilterInput | undefined;
  loading: boolean;
  error: any;
}

export const initialState: ProbateRecordState = {
  probateRecords: [],
  pageSize: 10, // Default page size
  nextToken: null,
  filter: undefined,
  loading: false,
  error: null
};

export const probateRecordReducer = createReducer(
  initialState,
  on(loadProbateRecords, (state, { pageSize, filter }) => ({
    ...state,
    pageSize,
    filter,
    loading: true
  })),
  on(loadProbateRecordsSuccess, (state, { probateRecords, nextToken }) => ({
    ...state,
    probateRecords: [...state.probateRecords, ...probateRecords],
    nextToken,
    loading: false,
    error: null
  })),
  on(loadProbateRecordsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
