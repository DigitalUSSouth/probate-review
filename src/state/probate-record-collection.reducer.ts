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
  createProbateRecordCollectionSuccess,
  disassociateProbateRecord,
  disassociateProbateRecordSuccess,
  disassociateProbateRecordFailure,
  associateProbateRecordFailure,
  associateProbateRecord,
  associateProbateRecordSuccess,
  updateProbateRecordCollectionSuccess,
  updateProbateRecordCollectionFailure,
  deleteProbateRecordCollections,
  deleteProbateRecordsCollectionsFailure,
  deleteProbateRecordsCollectionsSuccess,
  createProbateRecordCollectionFailure
} from './probate-record-collection.actions'

export interface ProbateRecordCollectionState {
  probateRecordCollections: ProbateRecordCollection[];
  collection: ProbateRecordCollection | null;
  pageSize: number;
  currentPage: number;
  nextToken: string | null | undefined;
  filter: ModelProbateRecordCollectionFilterInput | undefined;
  loading: boolean;
  updating: boolean;
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
  updating: false,
  error: null
}

export const probateRecordCollectionReducer = createReducer(initialProbateRecordCollectionState,
  on(loadProbateRecordCollections, (state, {pageSize, filter}) => ({
    ...state,
    pageSize,
    filter,
    loading: true,
  })),
  on(loadProbateRecordCollectionsSuccess, (state, { probateRecordCollections, nextToken }) => ({
    ...state,
    probateRecordCollections: [...state.probateRecordCollections, ...probateRecordCollections],
    nextToken,
    loading: false,
    error: null,
  })),
  on(loadProbateRecordCollectionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(updateProbateRecordCollection, (state) => ({
     ...state, 
     updating: true
  })),
  on(updateProbateRecordCollectionSuccess, (state, { probateRecordCollection }) => {
    const updatedRecordCollections = state.probateRecordCollections.map((recordCollection) => {
      if (recordCollection.id === probateRecordCollection.id) {
        return { ...recordCollection, ...probateRecordCollection };
      }
      return recordCollection;
    });
    return { ...state, updating: false, probateRecordCollections: updatedRecordCollections, collection: probateRecordCollection };
  }),
  on(updateProbateRecordCollectionFailure, (state, { error }) => ({
    ...state, 
    updating: false,
    error,
 })),
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
  on(createProbateRecordCollectionSuccess, (state, {collection}) => ({
    ...state,
    collection,
    probateRecordCollections: [...state.probateRecordCollections, collection],
    loading: false,
    error: null
  })),
  on(createProbateRecordCollectionFailure, (state, { error }) => ({
    ...state, 
    updating: false,
    error,
 })),
  on(deleteProbateRecordCollections, (state) => ({
    ...state, 
    updating: true
 })),
 on(deleteProbateRecordsCollectionsSuccess, (state, { collections }) => {
   const deletedIds = collections.map(c => c.id);
   const updatedCollections = state.probateRecordCollections.filter(c => !deletedIds.includes(c.id));
   const updatedCollection = (state.collection && !deletedIds.includes(state.collection.id)) ? state.collection : null; 
   return { ...state, updating: false, probateRecordCollections: updatedCollections, collection: updatedCollection };
 }),
 on(deleteProbateRecordsCollectionsFailure, (state, { error }) => ({
   ...state, 
   updating: false,
   error,
})),
  on(associateProbateRecord, (state) => ({ ...state, updating: true })),
  on(associateProbateRecordSuccess, (state, { collection }) => {
    const updatedRecordCollections = state.probateRecordCollections.map((recordCollection) => {
      if (collection.id === recordCollection.id) {
        return { ...recordCollection, ...collection };
      }
      return recordCollection;
    });
    return { ...state, updating: false, collection,  probateRecordCollections: updatedRecordCollections };
  }),
  on(associateProbateRecordFailure, (state, { error }) => ({ ...state, updating: false, error: error.message })),
  on(disassociateProbateRecord, (state) => ({ ...state, updating: true })),
  on(disassociateProbateRecordSuccess, (state, { collection }) => {
    const updatedRecordCollections = state.probateRecordCollections.map((recordCollection) => {
      if (collection.id === recordCollection.id) {
        return { ...recordCollection, ...collection };
      }
      return recordCollection;
    });
    return { ...state, updating: false, collection,  probateRecordCollections: updatedRecordCollections };
  }),
  on(disassociateProbateRecordFailure, (state, { error }) => ({ ...state, updating: false, error: error.message }))
  );

  export function reducer(state: ProbateRecordCollectionState | undefined, action: Action) {
    return probateRecordCollectionReducer(state, action);
  }
  