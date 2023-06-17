import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app/app.state';
import { ProbateRecordCollectionState, probateRecordCollectionReducer } from './probate-record-collection.reducer';

// Define the root reducer and the app state
export interface RootState {
  probateRecordCollections: ProbateRecordCollectionState;
  // Add other state slices if necessary
}

// Create a feature selector for the ProbateRecordState
export const selectProbateRecordCollectionState = createFeatureSelector<ProbateRecordCollectionState>('probateRecordCollections');

// Create selectors for the ProbateRecordState and other state slices if necessary
export const selectProbateRecordCollections = createSelector(
  selectProbateRecordCollectionState,
  (state: ProbateRecordCollectionState) => state.probateRecordCollections
);

// Define other selectors as needed

// Define the root selector
export const selectRootState = createFeatureSelector<AppState>('root');

// Export the selectors for the root state
export const selectRootProbateRecordCollections = createSelector(
  selectRootState,
  (state: AppState) => state.probateRecordCollections
);

// Create an ActionReducerMap for all the reducers
export const reducers: ActionReducerMap<RootState> = {
  probateRecordCollections: probateRecordCollectionReducer,
  // Add other reducers if necessary
};

  
  export const selectPageSize = createSelector(
    selectProbateRecordCollectionState,
    (state: ProbateRecordCollectionState) => state.pageSize
  );
  
  export const selectNextToken = createSelector(
    selectProbateRecordCollectionState,
    (state: ProbateRecordCollectionState) => state.nextToken
  );
  
  export const selectProbateRecordCollectionsLoading = createSelector(
    selectProbateRecordCollectionState,
    (state: ProbateRecordCollectionState) => state.loading
  );
  
  export const selectProbateRecordCollectionsLoaded = createSelector(
    selectProbateRecordCollectionState,
    (state: ProbateRecordCollectionState) => state.loaded
  );

  export const selectProbateRecordCollectionsError = createSelector(
    selectProbateRecordCollectionState,
    (state: ProbateRecordCollectionState) => state.error
  );
  
  export const selectProbateRecordCollection = createSelector(
    selectProbateRecordCollectionState,
    (state: ProbateRecordCollectionState) => state.collection
  );
  
  export const selectProbateRecordCollectionLoading = createSelector(
    selectProbateRecordCollectionState,
    (state: ProbateRecordCollectionState) => state.loading
  );
  
  export const selectProbateRecordCollectionError = createSelector(
    selectProbateRecordCollectionState,
    (state: ProbateRecordCollectionState) => state.error
  );