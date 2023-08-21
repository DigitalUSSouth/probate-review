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
  loadProbateRecordById,
  loadProbateRecordByIdFailure,
  loadSelectedProbateRecordsByIdFailure,
  loadSelectedProbateRecordsByIdSuccess,
  loadSelectedRecordsById,
  updateProbateRecordSuccess,
  updateProbateRecordFailure,
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
  selectedRecords: ProbateRecord[];
  loading: boolean;
  updating: boolean;
  error: string | null;
}

export const initialProbateRecordState: ProbateRecordState = {
  records: [],
  selectedRecord: null,
  selectedRecords: [],
  filter: null,
  nextToken: null,
  loading: false,
  updating: false,
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
  on(loadProbateRecordsFailure, (state, { error }) => {
    console.log('error updating');
    console.log(error);
    return {
    ...state,
    loading: false,
    error,
    };
  }),
  on(updateProbateRecord, (state) => ({
    ...state,
    updating: true,
  })),
  on(updateProbateRecordSuccess, (state, { probateRecord }) => {
    console.log('probate record updated');
    console.log(probateRecord);
    
    let updatedRecords = state.records.map((record) => {
      if (record.id === probateRecord.id) {
        return { ...record, ...probateRecord };
      }
      return record;
    });
    

    let updatedSelectedRecords = state.selectedRecords.map((record) => {
      if (record.id === probateRecord.id) {
        return { ...record, ...probateRecord };
      }
      return record;
    });

    const showingDeleted = state.filter && state.filter.markedForDeletion && state.filter.markedForDeletion.eq === true;
    updatedSelectedRecords = updatedSelectedRecords.filter(r => r.markedForDeletion == showingDeleted);
    updatedRecords = updatedRecords.filter(r => r.markedForDeletion == showingDeleted);
    return { ...state, records: updatedRecords, selectedRecord: probateRecord, selectedRecords: updatedSelectedRecords };
  }),
  on(updateProbateRecordFailure, (state, { error }) => {
    console.log('error updating');
    console.log(error);
    return {
    ...state, 
    updating: false,
    error,
 };}),
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
    error: null,
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
  on(loadProbateRecordById, (state) => ({
    ...state,
    loading: true,
  })),
  on(loadProbateRecordByIdSuccess, (state, { probateRecord }) => {
    const records = [...state.records];
    if (!state.records.map((r) => r.id).includes(probateRecord.id)) {
      records.push(probateRecord);
    }
    return {
      ...state,
      records,
      selectedRecord: probateRecord,
      loading: false,
    };
  }),
  on(loadProbateRecordByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(loadSelectedRecordsById, (state) => ({
    ...state,
    selectedRecords: [],
    loading: true,
  })),
  on(loadSelectedProbateRecordsByIdSuccess, (state, { probateRecords }) => {
    const records = [...state.records];
    for (const record of probateRecords) {
      if (!records.some((r) => r.id === record.id)) {
        records.push(record);
      }
    }
    return {
      ...state,
      records,
      selectedRecords: probateRecords,
      loading: false,
    };
  }),
  on(loadSelectedProbateRecordsByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
