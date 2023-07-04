import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of, from, Observable, forkJoin } from 'rxjs';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
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
  loadSelectedRecordsById,
  loadSelectedProbateRecordsByIdSuccess,
  loadSelectedProbateRecordsByIdFailure,
  updateProbateRecordSuccess,
  updateProbateRecord,
  updateProbateRecordFailure,
} from './probate-record.actions';
import { ProbateRecordService } from 'src/app/probate-record.service';
import { Action, Store, select } from '@ngrx/store';
import { selectProbateRecords } from './probte-record.selectors';
import { APIService, ProbateRecord } from 'src/app/API.service';
import { AppState } from 'src/app/app.state';
import { removeDynamoFields } from 'src/app/utilities/utility';

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

  loadProbateRecordById$ = createEffect(
    (): Observable<Action> =>
      this.actions$.pipe(
        ofType(loadProbateRecordById),
        withLatestFrom(this.store.pipe(select(selectProbateRecords))),
        mergeMap(([action, records]) => {
          const existingRecord = records.find((r) => r.id === action.id);
          return existingRecord
            ? of(
                loadProbateRecordByIdSuccess({ probateRecord: existingRecord })
              )
            : from(this.apiService.GetProbateRecord(action.id)).pipe(
                map((response) =>
                  loadProbateRecordByIdSuccess({
                    probateRecord: response as ProbateRecord,
                  })
                ),
                catchError((error) =>
                  of(loadProbateRecordByIdFailure({ error }))
                )
              );
        })
      ) as Observable<Action>
  );

  // loadSelectedRecordsById$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(loadSelectedRecordsById),
  //     withLatestFrom(this.store.pipe(select(selectProbateRecords))),
  //     filter(([action, records]) => !this.areRecordsLoaded(action.ids, records)),
  //     mergeMap(([action, records]) =>
  //       from(this.getProbateRecordsByIds(action.ids)).pipe(
  //         map((probateRecords) =>
  //         loadSelectedProbateRecordsByIdSuccess({ probateRecords })
  //         ),
  //         catchError((error) =>
  //           of(loadSelectedProbateRecordsByIdFailure({ error }))
  //         )
  //       )
  //     )
  //   )
  // );
  loadSelectedRecordsById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSelectedRecordsById),
      withLatestFrom(this.store.pipe(select(selectProbateRecords))),
      mergeMap(([action, records]) => {
        const existingRecords = records.filter((record) =>
          action.ids.includes(record.id)
        );
        const missingRecordIds = action.ids.filter(
          (recordId) =>
            !existingRecords.some((record) => record.id === recordId)
        );

        const existingRecordsAction = loadSelectedProbateRecordsByIdSuccess({
          probateRecords: existingRecords,
        });

        if (missingRecordIds.length === 0) {
          // All requested records are already present in the state
          return of(existingRecordsAction);
        }

        return forkJoin([
          of(existingRecordsAction),
          from(this.getProbateRecordsByIds(missingRecordIds)),
        ]).pipe(
          map(([existingAction, fetchedRecords]) => {
            const allRecords = [
              ...existingAction.probateRecords,
              ...fetchedRecords,
            ];
            return loadSelectedProbateRecordsByIdSuccess({
              probateRecords: allRecords,
            });
          }),
          catchError((error) =>
            of(loadSelectedProbateRecordsByIdFailure({ error }))
          )
        );
      })
    )
  );

  updateProbateRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProbateRecord),
      mergeMap(({ probateRecord }) =>
        from(
          this.apiService.UpdateProbateRecord(removeDynamoFields(probateRecord))
        ).pipe(
          map((response) => {
            console.log('svc response');
            console.log(response);
            return updateProbateRecordSuccess({
              probateRecord: response as ProbateRecord,
            })
          }
          ),
          catchError((error) =>
            of(updateProbateRecordFailure({ error }))
          )
        )
      )
    )
  );
  constructor(
    private actions$: Actions,
    private probateRecordService: ProbateRecordService,
    private apiService: APIService,
    private store: Store<AppState>
  ) {}

  private async getProbateRecordsByIds(
    recordIds: string[]
  ): Promise<ProbateRecord[]> {
    const records: ProbateRecord[] = [];
    for (const recordId of recordIds) {
      const record = await this.apiService.GetProbateRecord(recordId);
      records.push(record);
    }
    return records;
  }
  private areRecordsLoaded(
    recordIds: string[],
    records: ProbateRecord[]
  ): boolean {
    return recordIds.every((recordId) =>
      records.some((record) => record.id === recordId)
    );
  }
}
