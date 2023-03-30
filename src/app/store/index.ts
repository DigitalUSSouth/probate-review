import { ActionReducerMap } from '@ngrx/store';
import { GlobalState } from './states/global.state';
import { probateRecordReducer } from './reducers/probate-record.reducer';

export const reducers: ActionReducerMap<GlobalState> = {
  probateRecord: probateRecordReducer
};