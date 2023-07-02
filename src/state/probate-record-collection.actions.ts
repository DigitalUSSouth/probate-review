import { createAction, props } from '@ngrx/store';
import {
  ModelProbateRecordCollectionFilterInput,
  ProbateRecord,
  ProbateRecordCollection,
} from '../app/API.service';

export const loadProbateRecordCollections = createAction(
  '[Probate Record Collection] Load ProbateRecordCollections',
  props<{
    pageSize: number;
    filter?: ModelProbateRecordCollectionFilterInput;
    nextToken?: string;
  }>()
);

export const loadProbateRecordCollectionsSuccess = createAction(
  '[Probate Record Collection] Load Probate Record Collections Success',
  props<{
    probateRecordCollections: ProbateRecordCollection[];
    nextToken: string | null;
  }>()
);

export const loadProbateRecordCollectionsSuccessWithHistoryState = createAction(
  '[Probate Record Collection] Load Probate Record Collections Success with History State',
  props<{ probateRecordCollections: ProbateRecordCollection[] }>()
);

export const loadProbateRecordCollectionsFailure = createAction(
  '[Probate Record Collection] Load Probate Record Collections Failure',
  props<{ error: any }>()
);

export const clearProbateRecordCollections = createAction(
  '[ProbateRecordCollection] Clear Returned Records'
);

export const updateProbateRecordCollection = createAction(
  '[Probate Record Collection] Update Probate Record',
  props<{ probateRecordCollection: ProbateRecordCollection }>()
);

export const createProbateRecordCollection = createAction(
  '[Probate Record Collection] Create Probate Record',
  props<{ title: string; description: string }>()
);

export const createProbateRecordCollectionSuccess = createAction(
  '[Probate Record Collection] Create Probate Record Collection Success',
  props<{ collection: ProbateRecordCollection }>()
);

export const createProbateRecordCollectionFailure = createAction(
  '[Probate Record Collection] Create Probate Record Collection Failure',
  props<{ error: any }>()
);

export const deleteProbateRecordCollection = createAction(
  '[Probate Record Collection] Delete Probate Record Collection',
  props<{ id: string }>()
);

export const deleteProbateRecordCollections = createAction(
  '[Probate Record Collection] Delete Probate Record Collections',
  props<{ ids: string[] }>()
);

export const deleteProbateRecordsCollectionsSuccess = createAction(
  '[Probate Record Collection] Delete Probate Record Collections Success',
  props<{ collections: ProbateRecordCollection[] }>()
);

export const deleteProbateRecordsCollectionsFailure = createAction(
  '[Probate Record Collection] Delete Probate Record Collections Failure',
  props<{ error: any }>()
);

export const updateProbateRecordCollectionSuccess = createAction(
  '[Probate Record Collection] Update Probate Record Collections Success',
  props<{ probateRecordCollection: ProbateRecordCollection }>()
);

export const updateProbateRecordCollectionFailure = createAction(
  '[Probate Record Collection] Update Probate Record Collections Failure',
  props<{ error: any }>()
);


// Action creator function
export const updateProbateRecordCollectionAction = (
  probateRecordCollection: ProbateRecordCollection
) => {
  return updateProbateRecordCollection({ probateRecordCollection });
};

export const setPage = createAction(
  '[Probate Record Collection] Set Current Page',
  props<{ currentPage: number }>()
);

export const loadProbateRecordCollection = createAction(
  '[Probate Record Collection] Load Collection',
  props<{ id: string }>()
);

export const loadProbateRecordCollectionSuccess = createAction(
  '[Probate Record Collection] Load Collection Success',
  props<{ collection: ProbateRecordCollection }>()
);

export const loadProbateRecordCollectionFailure = createAction(
  '[Probate Record Collection] Load Collection Failure',
  props<{ error: any }>()
);




export const associateProbateRecord = createAction(
  '[Probate Record Collection] Associate Probate Record',
  props<{ collection: ProbateRecordCollection; recordId: string }>()
);

export const associateProbateRecordSuccess = createAction(
  '[Probate Record Collection] Associate Probate Record Success',
  props<{ collection: ProbateRecordCollection }>()
);

export const associateProbateRecordFailure = createAction(
  '[Probate Record Collection] Associate Probate Record Failure',
  props<{ error: any }>()
);

// export const associateProbateRecords = createAction(
//   '[Probate Record Collection] Associate Probate Records',
//   props<{ collectionId: string; recordIds: string[] }>()
// );

// export const associateProbateRecordsSuccess = createAction(
//   '[Probate Record Collection] Associate Probate Records Success',
//   props<{ collections: ProbateRecordCollection[] }>()
// );

// export const associateProbateRecordsFailure = createAction(
//   '[Probate Record Collection] Associate Probate Records Failure',
//   props<{ error: any }>()
// );

export const disassociateProbateRecord = createAction(
  '[Probate Record Collection] Disassociate Probate Record',
  props<{ collection: ProbateRecordCollection, recordId: string }>()
);

export const disassociateProbateRecordSuccess = createAction(
  '[Probate Record Collection] Disassociate Probate Record Success',
  props<{ collection: ProbateRecordCollection }>()
);

export const disassociateProbateRecordFailure = createAction(
  '[Probate Record Collection] Disassociate Probate Record Failure',
  props<{ error: any }>()
);
