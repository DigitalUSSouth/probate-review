import Auth from '@aws-amplify/auth';
import { Component, OnInit } from '@angular/core';
import { Document, ProbateRecord, APIService, ListProbateRecordsQuery, ModelProbateRecordFilterInput} from '../API.service';
import {LegacyPageEvent as PageEvent} from '@angular/material/legacy-paginator';

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
  pageSize = 1;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  pageIndex = 0;
  // MatPaginator Output
  pageEvent?: PageEvent;
  displayedColumns: string[] = ['thumbnail', 'title', 'description'];
  nextToken: string | undefined;

  constructor(private recordService: APIService) {
    // https://stackoverflow.com/questions/52494919/mattabledatasource-cannot-read-property-length-of-undefined
    this.records = [];
  }  

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngOnInit(): void { 
    Auth.currentAuthenticatedUser().then((user) => {
      console.log(user);
      this.displayedColumns.push('move');
    });

    this.fetchRcords();    
  }

  fetchRcords(): void {
    let filter: ModelProbateRecordFilterInput;
    this.recordService.ListProbateRecords(undefined, {reviewCount: {ge: 2}}, this.pageSize, this.nextToken).then((recordsQuery: ListProbateRecordsQuery) => {
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

  async moveRecordToUnreviewed(id: string) {
    let record = (this.records as ProbateRecord[]).find(r => r.id === id);
    if(record) {
      await this.recordService.UpdateProbateRecord({id: id, reviewCount: 0});
      this.records = (this.records as ProbateRecord[]).filter(r => r.id != id);      
    }

  }
}
