import { Injectable } from '@angular/core';
import { Observable, catchError, from, map } from 'rxjs';
import { APIService, ListProbateRecordsQuery, ModelProbateRecordFilterInput, ProbateRecord } from './API.service';

@Injectable({
  providedIn: 'root'
})
export class ProbateRecordService {

  constructor(private recordService: APIService ) { }  
  private async getProbateRecordsByCount(filter: ModelProbateRecordFilterInput | undefined, count: number, nextToken?: string) {
    let result = await this.recordService.ListProbateRecords(undefined, filter, count, nextToken);
    let newNextToken = result.nextToken;
    let records = result.items!.map((r) => r as ProbateRecord);
    while(records.length < count && newNextToken) {
      result = await this.recordService.ListProbateRecords(undefined, filter, count - records.length, nextToken);
      records = records.concat(result.items.map((r) => r as ProbateRecord));
      newNextToken = result.nextToken;
    }
    return {records, nextToken: newNextToken};
  }

  getProbateRecords(
    filter: ModelProbateRecordFilterInput | undefined,
    pageSize: number,
    nextToken?: string
  ): Observable<{ probateRecords: ProbateRecord[]; nextToken: string | null }> {
    console.log('getting probate records');
    return from(
      this.getProbateRecordsByCount(filter, pageSize, nextToken)
    ).pipe(
      map((result: {records: ProbateRecord[], nextToken: string | null | undefined}) => {
          let records = result.records;
          console.log('records returned');
          console.log(records);
          return {
            probateRecords: records, 
            nextToken: result.nextToken || null
          }
        }),
      catchError(error => {
        console.error('Error fetching ProbateRecords:', error);
        throw error;
      })
    );
  }
}
