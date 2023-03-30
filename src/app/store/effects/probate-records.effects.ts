import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError, of, from, Observable } from 'rxjs';
import { APIService, ListProbateRecordsQuery } from '../../API.service';
import { ProbateRecordParams } from '../../models/probate-record-params';
import {
  loadingProbateRecords,
  loadProbateRecordsSuccess,
  loadProbateRecordsFailure,
} from '../actions/probate-record.actions';

@Injectable()
export class ProbateRecordEffects {
  constructor(private actions$: Actions, private service: APIService) {}

  public loadCustomer$ = createEffect(
    (): Observable<Action> =>
      this.actions$.pipe(
        ofType(loadingProbateRecords),
        switchMap((payload: { params: ProbateRecordParams }) =>
          from(
            this.service.ListProbateRecords(
              payload.params.id,
              payload.params.filter,
              payload.params.limit,
              payload.params.nextToken,
              payload.params.sortDirection
            )
          ).pipe(
            map((response: ListProbateRecordsQuery) =>
              loadProbateRecordsSuccess({ response })
            ),
            catchError((error: HttpErrorResponse) =>
              of(loadProbateRecordsFailure({ error }))
            )
          )
        )
      )
  );
}
