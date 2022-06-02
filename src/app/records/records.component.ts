import { Component, OnInit } from '@angular/core';
import { RecordService } from '../record.service';
import { ProbateRecord } from '../probate-record';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.sass']
})
export class RecordsComponent implements OnInit {
  records: ProbateRecord[] = [];
  constructor(private recordService: RecordService) { }

  async getRecords(): Promise<void> {
    console.log('getting records');
    this.records = await this.recordService.getProbateRecords();
    console.log('records received');
  }

  ngOnInit(): void {
    this.getRecords();
    console.log(this.records);
  }

}
