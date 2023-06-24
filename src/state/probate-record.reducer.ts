import { createReducer, on } from '@ngrx/store';
import {
  loadProbateRecords,
  loadProbateRecordsSuccess,
  loadProbateRecordsFailure,
  updateProbateRecord,
  clearProbateRecords,
  loadFilteredProbateRecordsFailure,
  loadFilteredProbateRecordsSuccess,
  setProbateRecordFilter,
  loadFilteredProbateRecords,
} from './probate-record.actions';
import {
  ModelProbateRecordFilterInput,
  ProbateRecord,
} from '../app/API.service';

export interface ProbateRecordState {
  filter: ModelProbateRecordFilterInput | undefined | null;
  nextToken: string | undefined | null;
  records: ProbateRecord[];
  loading: boolean;
  error: string | null;
}

export const initialProbateRecordState: ProbateRecordState = {
  records: [],
  filter: null,
  nextToken: null,
  loading: false,
  error: null,
};

export const probateRecordReducer = createReducer(
  initialProbateRecordState,
  on(loadProbateRecords, (state, { pageSize, filter }) => ({
    ...state,
    pageSize,
    filter,
    loading: true,
  })),
  on(loadProbateRecordsSuccess, (state, { probateRecords, nextToken }) => ({
    ...state,
    probateRecords: [...state.records, ...probateRecords],
    nextToken,
    loading: false,
    error: null,
  })),
  on(loadProbateRecordsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(updateProbateRecord, (state, { probateRecord }) => {
    const updatedRecords = state.records.map((record) => {
      if (record.id === probateRecord.id) {
        return { ...record, ...probateRecord };
      }
      return record;
    });

    return { ...state, records: updatedRecords };
  }),
  on(clearProbateRecords, (state) => ({
    ...state,
    records: [],
  })),
  on(loadFilteredProbateRecords, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadFilteredProbateRecordsSuccess, (state, { records, nextToken }) => ({
    ...state,
    loading: false,
    records,
    nextToken,
    error: null
  })),
  on(loadFilteredProbateRecordsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(setProbateRecordFilter, (state, { filter }) => ({
    ...state,
    filter,
    records: [], // Empty the array of Probate Records when the filter changes
  }))
);
