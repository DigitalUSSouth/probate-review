import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AmplifyUser } from '@aws-amplify/ui';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { loadFilteredProbateRecords } from 'src/state/probate-record.actions';
import {
  selectProbateRecords,
  selectNextToken,
  selectProbateRecordsLoading,
  selectProbateRecordsError,
} from 'src/state/probte-record.selectors';
import { ModelProbateRecordFilterInput, ModelSortDirection, ProbateRecord } from '../API.service';
import { AppState } from '../app.state';

@Component({
  selector: 'app-load-record-list-view',
  templateUrl: './load-record-list-view.component.html',
  styleUrls: ['./load-record-list-view.component.sass'],
})
export class LoadRecordListViewComponent {
  probateRecords$?: Observable<ProbateRecord[]>;
  records?: ProbateRecord[];
  loading$?: Observable<boolean>;
  nextToken$?: Observable<string | null | undefined>;
  nextToken: string | undefined;
  error$?: Observable<string | null>;
  user?: AmplifyUser;
  private subscriptions: Subscription[] = [];

  @Input() filter?: ModelProbateRecordFilterInput;
  @Input() showLocked = false;
  @Input() showCheckBoxes = false;
  @Output() selectedProbateRecords = new EventEmitter<ProbateRecord[]>();
  
  constructor(
    private store: Store<AppState>,
    public authenticator: AuthenticatorService
  ) {
    // this.probateRecords$ = this.store.pipe(select(selectProbateRecords));
    
  }

  ngOnInit(): void {
    if(!this.filter) {
      this.filter = { reviewCount: { lt: 2 } };
    }
    
    // Dispatch the initial action to load the probate records
    // if (!this.records || this.records.length == 0) {
    //   this.store.dispatch(
    //     loadFilteredProbateRecords({
    //       limit: 10,
    //       filter,
    //       sortDirection: ModelSortDirection.DESC,
    //       nextToken: undefined,
    //     })
    //   );
    //   console.log('fetching records');
    // }
    this.probateRecords$ = this.store.pipe(
      select(selectProbateRecords),
      tap((records) => {
        console.log('selected probate records', records);
        if (records.length === 0) {
          this.store.dispatch(
            loadFilteredProbateRecords({
              limit: 10,
              filter: this.filter!,
              sortDirection: ModelSortDirection.DESC,
              nextToken: undefined,
            })
          );
        }
      })
    );
    this.nextToken$ = this.store.pipe(select(selectNextToken));
    this.loading$ = this.store.pipe(select(selectProbateRecordsLoading));
    this.error$ = this.store.pipe(select(selectProbateRecordsError));

    // Subscribe to the probate records, page size, and next token
    this.subscriptions.push(
      this.probateRecords$.subscribe((records) => {
        // Do something with the probate records
        this.records = records;
        console.log('records loaded');
        console.log(records);
      }),
      this.nextToken$.subscribe((nextToken) => {
        // Do something with the next token
        this.nextToken = nextToken!;
      })
    );
  }

  ngAfterViewInit() {
    this.user = this.authenticator.user;
  }

  // bubble up selection changed to parent
  onSelectedRecordsChanged(selectedRecords: ProbateRecord[]) {
    this.selectedProbateRecords.emit(selectedRecords);
  }

  loadMoreRecords() {
    this.store.dispatch(
      loadFilteredProbateRecords({
        limit: 10,
        filter: this.filter ?? { reviewCount: { lt: 2 } },
        sortDirection: ModelSortDirection.DESC,
        nextToken: this.nextToken,
      })
    );
  }
}
