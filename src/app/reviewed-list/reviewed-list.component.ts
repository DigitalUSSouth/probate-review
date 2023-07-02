import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { clearProbateRecords, loadProbateRecords, updateProbateRecord } from '../../state/probate-record.actions';
import {
  selectProbateRecords,
  selectNextToken,
  selectProbateRecordsLoading,
  selectProbateRecordsError,
} from '../../state/probte-record.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { ProbateRecord } from '../API.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppState } from '../app.state';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AmplifyUser } from '@aws-amplify/ui';
import { CookieService } from 'ngx-cookie-service';

const REVIEWED_PAGE_SIZE = 'unreviewedPageSize';

@Component({
  selector: 'app-reviewed-list',
  templateUrl: './reviewed-list.component.html',
  styleUrls: ['./reviewed-list.component.sass']
})
export class ReviewedListComponent implements OnInit {
  probateRecords$: Observable<ProbateRecord[]>;
  nextToken$: Observable<string | null | undefined>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  loading = true;
  loaded = false;
  length = 50;
  pageSize = 10;
  pageSizes: number[] = [1, 5, 10, 25, 100];
  pageIndex = 0;
  // MatPaginator Output
  pageEvent?: PageEvent;
  displayedColumns: string[] = ['thumbnail', 'title', 'description'];
  nextToken: string | undefined;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  dataSource?: MatTableDataSource<ProbateRecord>;
  user?: AmplifyUser;
  private subscriptions: Subscription[] = [];

  constructor(private store: Store<AppState>, public authenticator: AuthenticatorService, private cookieService: CookieService) {
    this.probateRecords$ = this.store.pipe(select(selectProbateRecords));
    this.nextToken$ = this.store.pipe(select(selectNextToken));
    this.loading$ = this.store.pipe(select(selectProbateRecordsLoading));
    this.error$ = this.store.pipe(select(selectProbateRecordsError));
  }

  ngOnInit(): void {
    const pageSizeText = this.cookieService.get(REVIEWED_PAGE_SIZE);
    console.log('page size is ' + pageSizeText);
    this.pageSize = parseInt(this.cookieService.get(REVIEWED_PAGE_SIZE)) ?? 10; 
    // Dispatch the initial action to load the probate records
    // Records not loaded, dispatch the load action
    this.store.dispatch(clearProbateRecords());
    this.store.dispatch(loadProbateRecords({ pageSize: this.pageSize, filter: { reviewCount: { ge: 2 } }, nextToken: '' }));
    
    
    // Subscribe to the probate records, page size, and next token
    this.subscriptions.push(
      this.probateRecords$.subscribe(records => {
        // Do something with the probate records
        this.dataSource = new MatTableDataSource(records);
        this.dataSource.paginator = this.paginator!; 
        console.log('records loaded');
        console.log(records);
      }),
      this.nextToken$.subscribe(nextToken => {
        // Do something with the next token
        this.nextToken = nextToken!;
      }),
      this.loading$.subscribe(loading => {
        this.loading = loading;
      }),
    );
  }  

  ngAfterViewInit() {
    this.user = this.authenticator.user;
     
  }

  loadProbateRecords(nextToken?: string): void {
    const pageSize = 10; // Set your desired page size here
    this.store.dispatch(loadProbateRecords({ pageSize, nextToken }));
  }

  onPageChange(nextToken: string): void {
    this.loadProbateRecords(nextToken);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadMoreRecords(nextToken: string | null) {
    // Dispatch the action to load more probate records using the next token
    this.store.dispatch(loadProbateRecords({ pageSize: this.pageSize, nextToken: this.nextToken }));
  }

  handlePageEvent(event: PageEvent) {
    console.log('page event');
    console.log(event);
  }

  changePageSize(pageSize: number) {
    // Dispatch the action to change the page size
    this.store.dispatch(loadProbateRecords({ pageSize }));
    console.log('setting page size to ', pageSize);
    this.cookieService.set(REVIEWED_PAGE_SIZE, String(pageSize));
  }

  async moveRecordToUnreviewed(record: ProbateRecord) {    
    try {
      const updatedRecord: ProbateRecord = { ...record,  reviewCount: 0};
      this.store.dispatch(updateProbateRecord({ probateRecord: updatedRecord }));
      }
      catch (e) {
        if (e instanceof Error) {
          alert((e as Error).message);
        }
        else {
          alert('An error has occurred during save');
        }
      }
  }
}
