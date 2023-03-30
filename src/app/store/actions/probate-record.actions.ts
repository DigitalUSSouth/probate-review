import { createAction, props } from "@ngrx/store";
import { from } from 'rxjs';
import { ListProbateRecordsQuery } from "../../API.service";
import { ProbateRecordParams } from "src/app/models/probate-record-params";

enum ProbateRecordActionType {
  Loading = "[ProbateRecord] Loading",
  LoadProbateRecordsSuccess = "[ProbateRecord] Loaded Success",
  loadProbateRecordsFailure = "[ProbateRecord] Loaded Failure",
}

export const loadingProbateRecords = createAction(
  ProbateRecordActionType.Loading,
  props<{ params: ProbateRecordParams }>()
);

export const loadProbateRecordsSuccess = createAction(
  ProbateRecordActionType.LoadProbateRecordsSuccess,
  props<{ response: ListProbateRecordsQuery }>()
);

export const loadProbateRecordsFailure = createAction(
  ProbateRecordActionType.loadProbateRecordsFailure,
  props<{ error: any }>()
);

