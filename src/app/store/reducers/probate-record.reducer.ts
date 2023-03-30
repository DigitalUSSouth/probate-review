import {
  ProbateRecordState,
  initialProbateRecordState,
  probateRecordAdapter,
} from '../states/probate-record.state';
import * as probaterecord from '../actions/probate-record.actions';
import { createReducer, on } from '@ngrx/store';
import { ProbateRecord } from 'src/app/API.service';

export const probateRecordReducer = createReducer(
  initialProbateRecordState,
  on(probaterecord.loadingProbateRecords, (state) => ({
    ...state,
    loading: true,
  })),
  on(probaterecord.loadProbateRecordsSuccess, (state, { response }) =>
    probateRecordAdapter.setAll(response.items as ProbateRecord[], {
      ...state,
      error: false,
      loading: false,
      total: response.count!,
    })
  ),
  on(probaterecord.loadProbateRecordsFailure, (state) =>
    probateRecordAdapter.removeAll({
      ...state,
      error: true,
      loading: false,
      total: 0,
    })
  )
);
