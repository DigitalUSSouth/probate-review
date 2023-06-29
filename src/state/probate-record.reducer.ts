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
  loadProbateRecordByIdSuccess,
} from './probate-record.actions';
import {
  ModelProbateRecordFilterInput,
  ProbateRecord,
} from '../app/API.service';
import isEqual from 'lodash/isEqual';

export interface ProbateRecordState {
  filter: ModelProbateRecordFilterInput | undefined | null;
  nextToken: string | undefined | null;
  records: ProbateRecord[];
  selectedRecord: ProbateRecord | null;
  loading: boolean;
  error: string | null;
}

export const initialProbateRecordState: ProbateRecordState = {
  records: [],
  selectedRecord: null,
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
    records: [...state.records, ...probateRecords],
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
    records: [...state.records, ...records],
    nextToken,
    error: null
  })),
  on(loadFilteredProbateRecordsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(setProbateRecordFilter, (state, { filter }) => {
    if (isEqual(state.filter, filter)) {
      // If the filter is the same, return the current state
      return state;
    } else {
      // If the filter is different, update the filter and empty the array of Probate Records
      return {
        ...state,
        filter,
        records: [],
      };
    }
  }),
  on(loadProbateRecordByIdSuccess, (state, { probateRecord }) => ({
    ...state,
    selectedRecord: probateRecord,
  })),
);
