import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  Document,
  ProbateRecord,
  APIService,
  ListProbateRecordsQuery,
  ModelProbateRecordFilterInput,
} from '../API.service';
import { PageEvent } from '@angular/material/paginator';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-unreviewed',
  templateUrl: './unreviewed.component.html',
  styleUrls: ['./unreviewed.component.sass'],
})
export class UnreviewedComponent implements OnInit {
  records?: ProbateRecord[];
  documents?: Document[];
  // MatPaginator Inputs
  length = 50;
  pageSize = 100;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  pageIndex = 0;
  // MatPaginator Output
  pageEvent?: PageEvent;
  displayedColumns: string[] = ['thumbnail', 'title', 'description'];
  nextToken: string | undefined;
  @ViewChild(MatSort) sort?: MatSort;
  dataSource?: MatTableDataSource<ProbateRecord>;
  
  constructor(private recordService: APIService, private _liveAnnouncer: LiveAnnouncer) {}
  
  ngAfterViewInit() {
    
  }

  ngOnInit(): void {
    this.fetchRcords().then(() => {
      console.log('records fetched');
      this.dataSource = new MatTableDataSource(this.records);
      this.dataSource.sort = this.sort!;
    });
  }

  async fetchRcords() {
    let filter: ModelProbateRecordFilterInput;
    let recordsQuery: ListProbateRecordsQuery =
      await this.recordService.ListProbateRecords(
        undefined,
        { reviewCount: { lt: 2 } },
        this.pageSize,
        this.nextToken
      ); 
    this.records = recordsQuery!.items!.map((x) => x as ProbateRecord);
    this.nextToken = recordsQuery.nextToken
        ? recordsQuery.nextToken
        : undefined;
    while (this.nextToken && this.records.length < this.pageSize) {
      recordsQuery = await this.recordService.ListProbateRecords(
        undefined,
        { reviewCount: { lt: 2 } },
        this.pageSize,
        this.nextToken
      );
      let recordsToAdd = recordsQuery!.items!.map((x) => x as ProbateRecord);
      if (recordsToAdd.length + this.records!.length > this.pageSize) {
        recordsToAdd = recordsToAdd.slice(
          0,
          recordsToAdd.length - this.pageSize
        );
      }
      this.records = this.records!.concat(recordsToAdd);
      this.nextToken = recordsQuery.nextToken
        ? recordsQuery.nextToken
        : undefined;
    }

    
    this.length = this.records.length;

  }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    if (this.pageSize != event.pageSize) {
      this.pageSize = event.pageSize;
      this.nextToken = undefined;
    }
    this.pageIndex = event.pageIndex;
    this.fetchRcords();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
