import { createReducer, on } from '@ngrx/store';
import { loadProbateRecords, loadProbateRecordsSuccess, loadProbateRecordsFailure, updateProbateRecord } from './probate-record.actions';
import { ModelProbateRecordFilterInput, ProbateRecord } from '../app/API.service';

export interface ProbateRecordState {
  probateRecords: ProbateRecord[];
  pageSize: number;
  currentPage: number;
  nextToken: string | null;
  filter: ModelProbateRecordFilterInput | undefined;
  loading: boolean;
  loaded: boolean;
  error: any;  
}

export const initialProbateRecordState: ProbateRecordState = {
  probateRecords: [],
  pageSize: 10, // Default page size
  currentPage: 1,
  nextToken: null,
  filter: undefined,
  loading: false,
  loaded: false,
  error: null
};

export const probateRecordReducer = createReducer(
  initialProbateRecordState,
  on(loadProbateRecords, (state, { pageSize, filter }) => ({
    ...state,
    pageSize,
    filter,
    loading: true,
    loaded: false
  })),
  on(loadProbateRecordsSuccess, (state, { probateRecords, nextToken }) => ({
    ...state,
    probateRecords: [...state.probateRecords, ...probateRecords],
    nextToken,
    loading: false,
    loaded: true,
    error: null
  })),
  on(loadProbateRecordsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(updateProbateRecord, (state, { probateRecord }) => {
    const updatedRecords = state.probateRecords.map(record => {
      if (record.id === probateRecord.id) {
        return { ...record, ...probateRecord };
      }
      return record;
    });

    return { ...state, probateRecords: updatedRecords };
  })
);
