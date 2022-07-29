import { Component, OnInit } from '@angular/core';
import { Document, ProbateRecord, APIService, ListProbateRecordsQuery, ModelProbateRecordFilterInput} from '../API.service';
import {PageEvent} from '@angular/material/paginator';
@Component({
  selector: 'app-unreviewed',
  templateUrl: './unreviewed.component.html',
  styleUrls: ['./unreviewed.component.sass']
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
  constructor(private recordService: APIService) { }

  ngOnInit(): void {
    this.fetchRcords();
  }

  fetchRcords(): void {
    let filter: ModelProbateRecordFilterInput;
    this.recordService.ListProbateRecords(undefined, {reviewCount: {lt: 2}}, this.pageSize, this.nextToken).then((recordsQuery: ListProbateRecordsQuery) => {
      console.log(recordsQuery);
      console.log(recordsQuery!.items);
      this.records = recordsQuery!.items!.map(x => x as ProbateRecord);
      this.length = this.records.length;
      
      this.nextToken = (recordsQuery.nextToken) ? recordsQuery.nextToken : undefined;
      console.log('next token: ' + this.nextToken);
    });
  }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    if(this.pageSize != event.pageSize) {
      this.pageSize = event.pageSize;
      this.nextToken = undefined;      
    }
    this.pageIndex = event.pageIndex;
    this.fetchRcords();
  }
}
