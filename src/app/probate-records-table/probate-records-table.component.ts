import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { APIService, ListProbateRecordsQuery, ProbateRecord } from '../API.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalState } from '../store/states/global.state';
import { Store, select } from '@ngrx/store';
import {
  selectAllProbateRecord,
  selectProbateRecordTotal,
  selectProbateRecordError,
  selectProbateRecordLoading,
} from '../store/selectors/probate-record.selectors';
import { loadingProbateRecords } from '../store/actions/probate-record.actions';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, merge, Subject, Subscription, from } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AmplifyUser } from '@aws-amplify/ui';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Amplify } from 'aws-amplify';
import awsExports from '../../aws-exports';
import {
  ModelProbateRecordFilterInput,
  ModelSortDirection,
} from '../API.service';

@Component({
  selector: 'app-probate-records-table',
  templateUrl: './probate-records-table.component.html',
  styleUrls: ['./probate-records-table.component.sass'],
})
export class ProbateRecordsTableComponent {
  // MatPaginator Inputs
  length = 50;
  pageSize = 100;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  pageIndex = 0;
  // MatPaginator Output
  pageEvent?: PageEvent;
  displayedColumns: string[] = ['thumbnail', 'title', 'description'];
  nextToken: string | undefined;
  sortDirection: ModelSortDirection | undefined;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  dataSource?: MatTableDataSource<ProbateRecord>;
  user?: AmplifyUser;
  filter?: ModelProbateRecordFilterInput;

  public probaterecordTotal: number = 0;
  public noData: ProbateRecord[] = [<ProbateRecord>{}];
  public loading: boolean = true;
  public error$: Observable<boolean> = new Observable();
  public filterSubject = new Subject<string>();
  public defaultSort: Sort = { active: 'role', direction: 'asc' };
  private subscription: Subscription = new Subscription();
  private query$: Observable<ListProbateRecordsQuery> = new Observable();
  constructor(
    public authenticator: AuthenticatorService,
    public store: Store<GlobalState>,
    private _liveAnnouncer: LiveAnnouncer,
    private recordService: APIService,
  ) {
    Amplify.configure(awsExports);
  }

  public ngOnInit(): void {
    this.store
      .pipe(select(selectAllProbateRecord))
      .subscribe((probateRecords) => {
        // this.initializeData(probateRecords);
        console.log(probateRecords);
      });
    // this.store
    //   .pipe(select(selectProbateRecordTotal))
    //   .subscribe((total) => (this.probaterecordTotal = total));
    // this.subscription.add(
    //   this.store.pipe(select(selectProbateRecordLoading)).subscribe((loading) => {
    //     if (loading) {
    //       this.dataSource = new MatTableDataSource(this.noData);
    //     }
    //     this.loading = loading;
    //   })
    // );
    // this.error$ = this.store.pipe(select(selectProbateRecordError));
  }

  ngAfterViewInit() {
    this.user = this.authenticator.user;
    this.loadProbateRecords();
    let filter$ = this.filterSubject.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      // tap((value: string) => {
      //   this.paginator!.pageIndex = 0;
      //   this.filter = value;
      // })
    );

    let sort$ = this.sort!.sortChange.pipe(
      tap(() => (this.paginator!.pageIndex = 0))
    );

    this.subscription.add(
      merge(filter$, sort$, this.paginator!.page)
        .pipe(tap(() => this.loadProbateRecords()))
        .subscribe()
    );
    // this.query$ = from(this.recordService.ListProbateRecords(
    //   undefined,
    //   { reviewCount: { lt: 2 } },
    //   this.pageSize,
    //   this.nextToken
    // ))
    // this.query$.subscribe((query) => {
    //   console.log(query);
    // })
  }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    if (this.pageSize != event.pageSize) {
      this.pageSize = event.pageSize;
      this.nextToken = undefined;
    }
    this.pageIndex = event.pageIndex;
    // this.fetchRcords();
  }

  private loadProbateRecords(): void {
    this.store.dispatch(
      loadingProbateRecords({
        params: {
          id: undefined,
          filter: undefined,
          limit: this.pageSize,
          nextToken: this.nextToken,
          sortDirection: this.sortDirection,
        },
      })
    );

  }

  private initializeData(probateRecords: ProbateRecord[]): void {
    this.dataSource = new MatTableDataSource(
      probateRecords.length ? probateRecords : this.noData
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public retry(): void {
    this.loadProbateRecords();
  }
}
