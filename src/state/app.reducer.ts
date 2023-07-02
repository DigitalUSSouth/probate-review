import { createReducer, on } from '@ngrx/store';
import { initializeAppState } from './app.actions';
import { AppState } from '../app/app.state';
import { initialProbateRecordState } from '../state/probate-record.reducer';
import { initialProbateRecordCollectionState } from './probate-record-collection.reducer';
// Define the initial state
const initialAppState: AppState = {
  // Add your initial state properties here
  probateRecords: initialProbateRecordState,
  probateRecordCollections: initialProbateRecordCollectionState
};

// Create the reducer function
export const appReducer = createReducer(
  initialAppState,
  on(initializeAppState, (state) => {
    // Perform any initialization logic here
    // Return the updated state
    console.log('app state initialized');
    return state;
  })
);
