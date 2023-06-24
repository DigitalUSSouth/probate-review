import { Component } from '@angular/core';
import { AmplifyUser } from '@aws-amplify/ui';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { loadFilteredProbateRecords } from 'src/state/probate-record.actions';
import { selectProbateRecords, selectNextToken, selectProbateRecordsLoading, selectProbateRecordsError } from 'src/state/probte-record.selectors';
import { ModelSortDirection, ProbateRecord } from '../API.service';
import { AppState } from '../app.state';

@Component({
  selector: 'app-load-record-list-view',
  templateUrl: './load-record-list-view.component.html',
  styleUrls: ['./load-record-list-view.component.sass']
})
export class LoadRecordListViewComponent {
  probateRecords$: Observable<ProbateRecord[]>;
  records?: ProbateRecord[];
  loading$?: Observable<boolean>;
  nextToken$: Observable<string | null | undefined>;
  nextToken: string | undefined;
  error$?: Observable<string | null>;
  user?: AmplifyUser;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    public authenticator: AuthenticatorService,
  ) {
    this.probateRecords$ = this.store.pipe(select(selectProbateRecords));
    this.nextToken$ = this.store.pipe(select(selectNextToken));
    this.loading$ = this.store.pipe(select(selectProbateRecordsLoading));
    this.error$ = this.store.pipe(select(selectProbateRecordsError));
  }

  ngOnInit(): void {
    
    // Dispatch the initial action to load the probate records
    this.store.dispatch(
      loadFilteredProbateRecords({
        limit: 10,
        filter: { reviewCount: { lt: 2 } },
        sortDirection: ModelSortDirection.DESC,
        nextToken: undefined
      })
    );

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
      }),
      // this.loading$.subscribe((loading) => {
      //   this.loading = loading;
      // })
    );
  }

  ngAfterViewInit() {
    this.user = this.authenticator.user;
  }

  loadMoreRecords() {
    this.store.dispatch(
      loadFilteredProbateRecords({
        limit: 10,
        filter: { reviewCount: { lt: 2 } },
        sortDirection: ModelSortDirection.DESC,
        nextToken: this.nextToken
      })
    );
  }
}
