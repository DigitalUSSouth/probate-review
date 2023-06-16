import { createReducer, on } from '@ngrx/store';
import { ModelProbateRecordCollectionFilterInput, ProbateRecordCollection } from 'src/app/API.service';
import {
  loadProbateRecordCollections,
  loadProbateRecordCollectionsSuccess,
  updateProbateRecordCollection,
  clearProbateRecordCollections,
  loadProbateRecordCollectionsFailure
} from './probate-record-collection.actions'

export interface ProbateRecordCollectionState {
  probateRecordCollections: ProbateRecordCollection[];
  pageSize: number;
  currentPage: number;
  nextToken: string | null | undefined;
  filter: ModelProbateRecordCollectionFilterInput | undefined;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const initialProbateRecordCollectionState: ProbateRecordCollectionState = {
  probateRecordCollections: [],
  pageSize:10,
  currentPage: 1,
  nextToken: undefined,
  filter: undefined,
  loading: false,
  loaded: false,
  error: null
}

export const probateRecordCollectionReducer = createReducer(initialProbateRecordCollectionState,
  on(loadProbateRecordCollections, (state, {pageSize, filter}) => ({
    ...state,
    pageSize,
    filter,
    loading: true,
    loaded: false,
  })),
  on(loadProbateRecordCollectionsSuccess, (state, { probateRecordCollections, nextToken }) => ({
    ...state,
    probateRecordCollections: [...state.probateRecordCollections, ...probateRecordCollections],
    nextToken,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(loadProbateRecordCollectionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(updateProbateRecordCollection, (state, { probateRecordCollection }) => {
    const updatedRecordCollections = state.probateRecordCollections.map((recordCollection) => {
      if (recordCollection.id === probateRecordCollection.id) {
        return { ...recordCollection, ...probateRecordCollection };
      }
      return recordCollection;
    });

    return { ...state, probateRecordCollections: updatedRecordCollections };
  }),
  on(clearProbateRecordCollections, (state) => ({
    ...state,
    probateRecordCollections: [],
  })))