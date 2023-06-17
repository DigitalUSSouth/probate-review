import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  loadProbateRecordCollections,
  loadProbateRecordCollectionsSuccess,
  loadProbateRecordCollectionsFailure,
  loadProbateRecordCollection,
  loadProbateRecordCollectionSuccess,
  loadProbateRecordCollectionFailure,
} from './probate-record-collection.actions';
import { ProbateRecordService } from 'src/app/probate-record.service';
import { APIService } from '../app/API.service';

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

  loadProbateRecordCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProbateRecordCollection),
      mergeMap((action) =>
        from(this.apiService.GetProbateRecordCollection(action.id)).pipe(
          map((response) =>
            loadProbateRecordCollectionSuccess({ collection: response })
          ),
          catchError((error) =>
            of(loadProbateRecordCollectionFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private probateRecordService: ProbateRecordService,
    private apiService: APIService
  ) {}
}
