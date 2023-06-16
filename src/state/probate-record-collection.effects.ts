import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  loadProbateRecordCollections,
  loadProbateRecordCollectionsSuccess,
  loadProbateRecordCollectionsFailure,
} from './probate-record-collection.actions';
import { ProbateRecordService } from 'src/app/probate-record.service';

@Injectable()
export class ProbateRecordCollectionEffects {
  loadProbateRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProbateRecordCollections),
      switchMap(({ pageSize, filter, nextToken }) =>
        this.probateRecordService.getProbateRecordCollections(filter, pageSize, nextToken).pipe(
          map(({ probateRecordCollections, nextToken }) =>
          loadProbateRecordCollectionsSuccess({ probateRecordCollections, nextToken })
          ),
          catchError(error => of(loadProbateRecordCollectionsFailure({ error })))
        )
      )      
    )
  );

  constructor(
    private actions$: Actions,
    private probateRecordService: ProbateRecordService
  ) {}
}
