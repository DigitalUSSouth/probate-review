import { Component, OnInit } from '@angular/core';
import { Document, ProbateRecord, APIService, ListProbateRecordsQuery, ModelProbateRecordFilterInput} from '../API.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.sass']
})
export class RecordsComponent implements OnInit {
  records?: ProbateRecord[];
  documents?: Document[];
  // MatPaginator Inputs
  length = 50;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  // MatPaginator Output
  pageEvent?: PageEvent;
  displayedColumns: string[] = ['thumbnail', 'title', 'description'];

  constructor(private recordService: APIService) { }  

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngOnInit(): void {
    
    let filter: ModelProbateRecordFilterInput;
    this.recordService.ListProbateRecords(undefined, {reviewCount: {ge: 2}}).then((recordsQuery: ListProbateRecordsQuery) => {
      console.log(recordsQuery!.items);
      this.records = recordsQuery!.items!.map(x => x as ProbateRecord);
      this.length = this.records.length;
    });
    
  }

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }
}
