import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ProbateRecordEffects } from './effects/probate-records.effects';
import { reducers } from './index';

@NgModule({
  imports: [
    // StoreModule.forRoot(reducers),
    StoreModule.forRoot({}),
    StoreModule.forFeature('probaterecords', reducers), // https://stackoverflow.com/questions/58263197/ngrx-store-selectors-are-not-working-for-a-root-global-store
    EffectsModule.forRoot([ ProbateRecordEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: true })
],
  exports: [StoreModule]
})
export class StorageModule { }