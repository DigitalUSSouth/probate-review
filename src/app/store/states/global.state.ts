import { ProbateRecordState, initialProbateRecordState } from './probate-record.state';

export interface GlobalState {
  probateRecord: ProbateRecordState;
}

export const initialGlobalState: GlobalState = {
  probateRecord: initialProbateRecordState
};