import { Action, createReducer, on } from '@ngrx/store';
import { ModelProbateRecordCollectionFilterInput, ProbateRecordCollection } from 'src/app/API.service';
import {
  loadProbateRecordCollections,
  loadProbateRecordCollectionsSuccess,
  updateProbateRecordCollection,
  clearProbateRecordCollections,
  loadProbateRecordCollectionsFailure,
  loadProbateRecordCollection,
  loadProbateRecordCollectionSuccess,
  loadProbateRecordCollectionFailure,
  associateProbateRecordsSuccess,
  associateProbateRecordsFailure,
  createProbateRecordCollectionSuccess
} from './probate-record-collection.actions'

export interface ProbateRecordCollectionState {
  probateRecordCollections: ProbateRecordCollection[];
  collection: ProbateRecordCollection | null;
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
  collection: null,
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
  })),
  on(loadProbateRecordCollection, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadProbateRecordCollectionSuccess, (state, { collection }) => ({
    ...state,
    collection,
    loading: false,
    error: null
  })),
  on(loadProbateRecordCollectionFailure, (state, { error }) => ({
    ...state,
    collection: null,
    loading: false,
    error
  })),
  // on(associateProbateRecordsSuccess, (state, { collections }) => {
  //   const updatedRecordCollections = state.probateRecordCollections.map((recordCollection) => {
  //     if (recordCollection.id === collection.id) {
  //       return { ...recordCollection, ...collection };
  //     }
  //     return recordCollection;
  //   });

  //   return { ...state, probateRecordCollections: updatedRecordCollections, loading: false,
  //   error: null };
  // }),
  on(associateProbateRecordsSuccess, (state, { collections }) => {
    const updatedRecordCollections = state.probateRecordCollections.map((recordCollection) => {
      const updatedCollection = collections.find((c) => c.id === recordCollection.id);
      if (updatedCollection) {
        return { ...recordCollection, ...updatedCollection };
      }
      return recordCollection;
    });
  
    return { ...state, probateRecordCollections: updatedRecordCollections };
  }),
  on(associateProbateRecordsFailure, (state, { error }) => ({
    ...state,
    collection: null,
    loading: false,
    error
  })),
  on(createProbateRecordCollectionSuccess, (state, {collection}) => ({
    ...state,
    collection,
    probateRecordCollections: [...state.probateRecordCollections, collection],
    loading: false,
    error: null
  }))
  );

  export function reducer(state: ProbateRecordCollectionState | undefined, action: Action) {
    return probateRecordCollectionReducer(state, action);
  }
  