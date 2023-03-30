import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProbateRecordState, probateRecordAdapter } from '../states/probate-record.state';

export const {
  selectIds: _selectProbateRecordDataIds,
  selectEntities: _selectProbateRecordEntities,
  selectAll: _selectAllProbateRecord,
  selectTotal: _selectProbateRecordTotal
} = probateRecordAdapter.getSelectors();

export const selectProbateRecordState = createFeatureSelector<ProbateRecordState>('probaterecords');

export const selectProbateRecordIds = createSelector(
  selectProbateRecordState,
  _selectProbateRecordDataIds
);

export const selectProbateRecordEntities = createSelector(
  selectProbateRecordState,
  _selectProbateRecordEntities
);

export const selectAllProbateRecord = createSelector(
  selectProbateRecordState,
  _selectAllProbateRecord
);

export const selectProbateRecordError = createSelector(
  selectProbateRecordState,
  (state: ProbateRecordState): boolean => state.error
);

export const selectProbateRecordLoading = createSelector(
  selectProbateRecordState,
  (state: ProbateRecordState): boolean => state.loading
);


export const selectProbateRecordTotal = createSelector(
  selectProbateRecordState,
  (state: ProbateRecordState): number => state.total
);