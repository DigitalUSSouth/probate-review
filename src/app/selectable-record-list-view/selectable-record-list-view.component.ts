import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AmplifyUser } from '@aws-amplify/ui';
import { Subscription } from 'rxjs';
import { ProbateRecord } from '../API.service';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { CookieService } from 'ngx-cookie-service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { updateProbateRecord } from 'src/state/probate-record.actions';

const UNREVIEWED_PAGE_SIZE = 'unreviewedPageSize';

@Component({
  selector: 'app-selectable-record-list-view',
  templateUrl: './selectable-record-list-view.component.html',
  styleUrls: ['./selectable-record-list-view.component.sass'],
})
export class SelectableRecordListViewComponent {
  length = 50;
  pageSize = 10;
  pageSizes: number[] = [1, 5, 10, 25, 100];
  pageIndex = 0;
  // MatPaginator Output
  pageEvent?: PageEvent;
  displayedColumns: string[] = [
    'thumbnail',
    'title',
    'lockedBy',
    'lockedDate',
    'lockButton',
  ];
  nextToken: string | undefined;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @Input() showCheckBoxes = false;
  @Input() records?: ProbateRecord[];
  @Output() selectedProbateRecords = new EventEmitter<ProbateRecord[]>();
  dataSource?: MatTableDataSource<ProbateRecord>;
  user?: AmplifyUser;
  selectedRecords: ProbateRecord[] = [];
  constructor(
    private store: Store<AppState>,
    public authenticator: AuthenticatorService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    if (this.showCheckBoxes) {
      this.displayedColumns = ['checked', ...this.displayedColumns];
    }
    const pageSizeText = this.cookieService.get(UNREVIEWED_PAGE_SIZE);
    console.log('page size is ' + pageSizeText);

    this.pageSize = pageSizeText
      ? parseInt(this.cookieService.get(UNREVIEWED_PAGE_SIZE)) ?? 10
      : 10;

    if (this.records) {
      this.dataSource = new MatTableDataSource<ProbateRecord>(this.records);
      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
    }
  }

  ngAfterViewInit() {
    this.user = this.authenticator.user;  
  }

  ngOnChanges(changes: SimpleChanges) {
    let recordChange = changes['records'];

    if (recordChange) {
      console.log('updating data source');
      console.log(this.records);
      this.dataSource = new MatTableDataSource<ProbateRecord>(this.records);
      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
    }
  }

  handlePageEvent(event: PageEvent) {
    console.log('page event');
    console.log(event);
  }

  changePageSize(pageSize: number) {
    // Dispatch the action to change the page size
    console.log('setting page size to ', pageSize);
    this.cookieService.set(UNREVIEWED_PAGE_SIZE, String(pageSize));
  }

  async toggleRecordLock(record: ProbateRecord) {
    console.log('title: ' + record.title);
    if (record.lockedBy === this.user!.username!) {
      record.lockedBy = '';
      record.lockedDate = null;
    } else {
      record.lockedBy = this.user!.username!;
      record.lockedDate = new Date().toISOString();
    }

    try {
      const updatedRecord: ProbateRecord = {
        ...record,
        lockedBy: record.lockedBy,
        lockedDate: record.lockedDate,
      };
      this.store.dispatch(
        updateProbateRecord({ probateRecord: updatedRecord })
      );
    } catch (e) {
      if (e instanceof Error) {
        alert((e as Error).message);
      } else {
        alert('An error has occurred during save');
      }
    }
  }

  getLockedText(record: ProbateRecord) {
    return record.lockedBy === this.user!.username ? 'Unlock' : 'Lock';
  }

  toggleCheck(record: ProbateRecord, event: MatCheckboxChange) {
    if (event.checked) {
      this.selectedRecords.push(record);
    } else {
      const index = this.selectedRecords.findIndex(
        (selected) => selected.id === record.id
      );
      if (index !== -1) {
        this.selectedRecords.splice(index, 1);
      }
    }
  }

  toggleAllChecks(event: MatCheckboxChange) {
    this.selectedRecords = event.checked ? this.dataSource!.data : [];
  }

  isAllSelected() {
    return this.dataSource!.data.length === this.selectedRecords.length;
  }

  toggleSelection(record: ProbateRecord): void {
    if (this.isSelected(record)) {
      this.selectedRecords = this.selectedRecords.filter(
        (r) => r.id !== record.id
      );
    } else {
      this.selectedRecords.push(record);
    }

    this.selectedProbateRecords.emit(this.selectedRecords);
  }

  isSelected(record: ProbateRecord): boolean {
    return this.selectedRecords.some((r) => r.id === record.id);
  }
}
