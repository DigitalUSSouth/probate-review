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
  displayedColumns: string[] = ['thumbnail', 'title'];
  nextToken: string | undefined;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @Input() showCheckBoxes = false;
  @Input() showLocked = false;
  @Input() showMove = false;
  @Input() showDelete = false;
  @Input() pageSizeCookie: string | undefined;
  @Input() records?: (ProbateRecord | null)[] | null;
  @Input() deleteColTitle: 'Delete' | 'Restore' = 'Delete';
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
    this.user = this.authenticator.user;
    if (this.showCheckBoxes) {
      this.displayedColumns = ['checked', ...this.displayedColumns];
    }

    if (this.showLocked) {
      this.displayedColumns = this.displayedColumns.concat([
        'lockedBy',
        'lockedDate',
        'lockButton',
      ]);
    }

    if (this.showMove) {
      this.displayedColumns.push('move');
    }

    if(this.showDelete) {
      this.displayedColumns.push('delete');
    }

    if (this.pageSizeCookie) {
      const pageSize = parseInt(this.cookieService.get(this.pageSizeCookie));
      this.pageSize = isNaN(pageSize) ? 10 : pageSize;

      console.log('page size is ' + this.pageSize);
    }

    if (this.records) {
      this.dataSource = new MatTableDataSource<ProbateRecord>(
        this.records.map((r) => r as ProbateRecord)
      );
      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
    }
  }

  ngAfterViewInit() {
    // this.user = this.authenticator.user;
  }

  ngOnChanges(changes: SimpleChanges) {
    let recordChange = changes['records'];

    if (recordChange) {
      console.log('updating data source');
      console.log(this.records);
      this.dataSource = new MatTableDataSource<ProbateRecord>(
        this.records?.map((r) => r as ProbateRecord)
      );
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
    if (this.pageSizeCookie) {
      console.log('setting page size to ', pageSize);
      this.cookieService.set(this.pageSizeCookie, String(pageSize));
    }
  }

  async toggleRecordLock(record: ProbateRecord) {
    const unlockable = (this.user && this.user!.username! && record.lockedBy === this.user.username);
    const lockable = !record.lockedBy;
    
    if(!unlockable && !lockable) {
      return;
    }

    console.log('toggling lock for: ' + record.title);
    
    try {
      const lockedBy = (lockable) ? this.user!.username! : '';
      const lockedDate = (lockable) ? new Date().toISOString() : null ;
      const updatedRecord: ProbateRecord = {
        ...record,
        lockedBy,
        lockedDate,
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

  moveRecordToUnreviewed(record: ProbateRecord) {
    console.log('moving record back to unreviewed');
    try {
      const updatedRecord: ProbateRecord = {
        ...record,
        reviewCount: 0,
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

  toggleMarkRecordForDeletion(record) {
    console.log('moving record back to unreviewed');
    try {
      const updatedRecord: ProbateRecord = {
        ...record,
        markedForDeletion: !record.markedForDeletion,
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
    this.selectedProbateRecords.emit(this.selectedRecords);
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
