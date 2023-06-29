import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  loadProbateRecordCollections,
  loadProbateRecordCollectionsSuccess,
  loadProbateRecordCollectionsFailure,
  loadProbateRecordCollection,
  loadProbateRecordCollectionSuccess,
  loadProbateRecordCollectionFailure,
  createProbateRecordCollection,
  createProbateRecordCollectionSuccess,
  createProbateRecordCollectionFailure,
  associateProbateRecords,
  associateProbateRecordsSuccess,
  associateProbateRecordsFailure,
} from './probate-record-collection.actions';
import { ProbateRecordService } from 'src/app/probate-record.service';
import {
  APIService,
  CollectionRecords,
  ProbateRecord,
  ProbateRecordCollection,
} from '../app/API.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import {
  selectProbateRecordCollection,
  selectProbateRecordCollections,
} from './probate-record-collection.selectors';

@Injectable()
export class ProbateRecordCollectionEffects {
  loadProbateRecordCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProbateRecordCollections),
      switchMap(({ pageSize, filter, nextToken }) =>
        this.probateRecordService
          .getProbateRecordCollections(filter, pageSize, nextToken)
          .pipe(
            map(({ probateRecordCollections, nextToken }) =>
              loadProbateRecordCollectionsSuccess({
                probateRecordCollections,
                nextToken,
              })
            ),
            catchError((error) =>
              of(loadProbateRecordCollectionsFailure({ error }))
            )
          )
      )
    )
  );

  // loadProbateRecordCollection$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(loadProbateRecordCollection),
  //     withLatestFrom(this.store.pipe(select(selectProbateRecordCollections))),
  //     filter(([action, collections]) => !collections.map(r => r.id).includes(action.id)),
  //     mergeMap(([action]) =>
  //       from(this.apiService.GetProbateRecordCollection(action.id)).pipe(
  //         map((response) =>
  //           loadProbateRecordCollectionSuccess({ collection: response })
  //         ),
  //         catchError((error) =>
  //           of(loadProbateRecordCollectionFailure({ error }))
  //         )
  //       )
  //     )
  //   )
  // );
  loadProbateRecordCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProbateRecordCollection),
      withLatestFrom(this.store.pipe(select(selectProbateRecordCollections))),
      mergeMap(([action, collections]) => {
        const existingCollection = collections.find((c) => c.id === action.id);
        if (existingCollection) {
          console.log('found existing collection');
          return of(
            loadProbateRecordCollectionSuccess({
              collection: existingCollection,
            })
          );
        } else {
          return from(
            this.apiService.GetProbateRecordCollection(action.id)
          ).pipe(
            map((response) =>
              loadProbateRecordCollectionSuccess({
                collection: response as ProbateRecordCollection,
              })
            ),
            catchError((error) =>
              of(loadProbateRecordCollectionFailure({ error }))
            )
          );
        }
      })
    )
  );

  createProbateRecordCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createProbateRecordCollection),
      mergeMap(({ title, description }) =>
        from(
          this.apiService.CreateProbateRecordCollection({
            title,
            description,
            lowerTitle: title?.toLowerCase(),
            lowerDescription: description?.toLowerCase(),
          })
        ).pipe(
          map((response) =>
            createProbateRecordCollectionSuccess({
              collection: response as ProbateRecordCollection,
            })
          ),
          catchError((error) =>
            of(createProbateRecordCollectionFailure({ error }))
          )
        )
      )
    )
  );

  associateProbateRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(associateProbateRecords),
      mergeMap(({ collectionId, recordIds }) =>
        from(this.associateRecords(collectionId, recordIds)).pipe(
          map((response) =>
            associateProbateRecordsSuccess({
              collections: response as ProbateRecordCollection[],
            })
          ),
          catchError((error) => of(associateProbateRecordsFailure({ error })))
        )
      )
    )
  );

  async associateRecords(
    collectionId: string,
    recordIds: string[]
  ): Promise<ProbateRecordCollection[]> {
    const collections: ProbateRecordCollection[] = [];
    
    for (const recordId of recordIds) {
      const collectionRecord = await this.apiService.CreateCollectionRecords({
        probateRecordCollectionID: collectionId,
        probateRecordID: recordId,
      });

      const collection =
        collectionRecord.probateRecordCollection as ProbateRecordCollection;
      
      collections.push(collection);
    }
    return collections;
  }

  constructor(
    private actions$: Actions,
    private probateRecordService: ProbateRecordService,
    private apiService: APIService,
    private store: Store<AppState>
  ) {}
}
