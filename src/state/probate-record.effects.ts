import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import {
  loadProbateRecords,
  loadProbateRecordsSuccess,
  loadProbateRecordsFailure,
} from './probate-record.actions';
import { ProbateRecordService } from 'src/app/probate-record.service';

@Injectable()
export class ProbateRecordEffects {
  loadProbateRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProbateRecords),
      switchMap(({ pageSize, filter, nextToken }) =>
        this.probateRecordService.getProbateRecords(filter, pageSize, nextToken).pipe(
          map(({ probateRecords, nextToken }) =>
            loadProbateRecordsSuccess({ probateRecords, nextToken })
          ),
          catchError(error => of(loadProbateRecordsFailure({ error })))
        )
      )      
    )
  );

  constructor(
    private actions$: Actions,
    private probateRecordService: ProbateRecordService
  ) {}
}
