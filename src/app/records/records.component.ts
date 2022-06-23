import { Component, OnInit } from '@angular/core';
// import { RecordService } from '../record.service';
// import { ProbateRecord } from '../probate-record';
import { Document, ProbateRecord, APIService, ListProbateRecordsQuery} from '../API.service';
// import { API } from '../API.service';
import { API, graphqlOperation } from 'aws-amplify';
// import { ListProbateRecords} from '../../graphql/queries';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.sass']
})
export class RecordsComponent implements OnInit {
  records?: ProbateRecord[];
  documents?: Document[];
  constructor(private recordService: APIService) { }

  // async getRecords(): Promise<void> {
  //   console.log('getting records');
  //   this.records = await this.recordService.getProbateRecords();
  //   console.log('records received');
  // }

  

  ngOnInit(): void {
    // this.getRecords();
    // (API.graphql(graphqlOperation(ListProbateRecords)) as unknown as Observable<ProbateRecord>).subscribe({
    //     next: (records: any) => {
    //     console.log(records);
    //   }
    // });

    let records = this.recordService.ListProbateRecords().then((recordsQuery: ListProbateRecordsQuery) => {
      // if(recordsQuery.items) {
      //   this.records = recordsQuery.items;
      // }
      console.log(recordsQuery);

    });
    // console.log(this.records);
  }

}
