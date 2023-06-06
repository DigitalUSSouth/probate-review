import { createSelector } from '@ngrx/store';
import { AppState } from '../app/app.state';
import { ProbateRecordState } from './probate-record.reducer';

export const selectProbateRecordState = (state: AppState) => state.probateRecords;

export const selectProbateRecords = createSelector(
    selectProbateRecordState,
    (state: ProbateRecordState) => state.probateRecords
  );
  
  export const selectPageSize = createSelector(
    selectProbateRecordState,
    (state: ProbateRecordState) => state.pageSize
  );
  
  export const selectNextToken = createSelector(
    selectProbateRecordState,
    (state: ProbateRecordState) => state.nextToken
  );
  
  export const selectProbateRecordsLoading = createSelector(
    selectProbateRecordState,
    (state: ProbateRecordState) => state.loading
  );
  
  export const selectProbateRecordsError = createSelector(
    selectProbateRecordState,
    (state: ProbateRecordState) => state.error
  );
  