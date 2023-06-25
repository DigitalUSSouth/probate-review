import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of, from, Observable } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  loadProbateRecords,
  loadProbateRecordsSuccess,
  loadProbateRecordsFailure,
  loadFilteredProbateRecords,
  loadFilteredProbateRecordsFailure,
  loadFilteredProbateRecordsSuccess,
  loadProbateRecordById,
  loadProbateRecordByIdSuccess,
  loadProbateRecordByIdFailure,
} from './probate-record.actions';
import { ProbateRecordService } from 'src/app/probate-record.service';
import { Action, Store, select } from '@ngrx/store';
import { selectProbateRecords } from './probte-record.selectors';
import { APIService, ProbateRecord } from 'src/app/API.service';
import { AppState } from 'src/app/app.state';

@Injectable()
export class ProbateRecordEffects {
  loadProbateRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProbateRecords),
      switchMap(({ pageSize, filter, nextToken }) =>
        this.probateRecordService
          .getProbateRecords(filter, pageSize, nextToken)
          .pipe(
            map(({ probateRecords, nextToken }) =>
              loadProbateRecordsSuccess({ probateRecords, nextToken })
            ),
            catchError((error) => of(loadProbateRecordsFailure({ error })))
          )
      )
    )
  );

  loadFilteredProbateRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFilteredProbateRecords),
      switchMap(({ filter, limit, nextToken, sortDirection }) =>
        this.probateRecordService
          .loadFilteredProbateRecords(filter, limit, nextToken, sortDirection)
          .pipe(
            map((response) =>
              loadFilteredProbateRecordsSuccess({
                records: response.probateRecords,
                nextToken: response.nextToken,
              })
            ),
            catchError((error) =>
              of(loadFilteredProbateRecordsFailure({ error: error.message }))
            )
          )
      )
    )
  );

  loadProbateRecordById$ = createEffect((): Observable<Action> =>
    this.actions$.pipe(
      ofType(loadProbateRecordById),
      withLatestFrom(this.store.pipe(select(selectProbateRecords))),
      mergeMap(([action, records]) => {
        const existingRecord = records.find((r) => r.id === action.id);
        return existingRecord
          ? of(loadProbateRecordByIdSuccess({ probateRecord: existingRecord }))
          : from(this.apiService.GetProbateRecord(action.id)).pipe(
              map((response) =>
                loadProbateRecordByIdSuccess({ probateRecord: response as ProbateRecord })
              ),
              catchError((error) =>
                of(loadProbateRecordByIdFailure({ error }))
              )
            );
      })
    ) as Observable<Action>
  );

  constructor(
    private actions$: Actions,
    private probateRecordService: ProbateRecordService,
    private apiService: APIService,
    private store: Store<AppState>
  ) {}
}

