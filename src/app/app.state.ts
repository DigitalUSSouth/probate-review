import { ProbateRecordCollectionState } from "src/state/probate-record-collection.reducer";
import { ProbateRecordState } from "src/state/probate-record.reducer";

export interface AppState {
    probateRecords: ProbateRecordState
    probateRecordCollections: ProbateRecordCollectionState
}