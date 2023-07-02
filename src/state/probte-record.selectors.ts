import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app/app.state';
import { ProbateRecordState, probateRecordReducer } from './probate-record.reducer';

// Define the root reducer and the app state
export interface RootState {
  probateRecords: ProbateRecordState;
  // Add other state slices if necessary
}

// Create a feature selector for the ProbateRecordState
export const selectProbateRecordState = createFeatureSelector<ProbateRecordState>('probateRecords');

// Create selectors for the ProbateRecordState and other state slices if necessary
export const selectProbateRecords = createSelector(
  selectProbateRecordState,
  (state: ProbateRecordState) => state.records
);

// Define other selectors as needed

// Define the root selector
export const selectRootState = createFeatureSelector<AppState>('root');

// Export the selectors for the root state
export const selectRootProbateRecords = createSelector(
  selectRootState,
  (state: AppState) => state.probateRecords
);

// Create an ActionReducerMap for all the reducers
export const reducers: ActionReducerMap<RootState> = {
  probateRecords: probateRecordReducer,
  // Add other reducers if necessary
};

  
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

  export const selectSelectedRecord = createSelector(
    selectProbateRecordState,
    (state: ProbateRecordState) => state.selectedRecord
  );

  export const selectSelectedRecords = createSelector(
    selectProbateRecordState,
    (state: ProbateRecordState) => state.selectedRecords
  );
  