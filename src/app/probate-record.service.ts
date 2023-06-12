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
    let ids = new Set<string>();
    records.map(r => {
      ids.add(r.id);
    })
    let recordCount = records.length;
    while(recordCount < count && newNextToken) {
      result = await this.recordService.ListProbateRecords(undefined, filter, count - records.length, nextToken);
      let recordsToAdd = result.items.map((r) => r as ProbateRecord);
      let dupesFound = false;
      for(const record of recordsToAdd) {
        if(ids.has(record.id)) {
          dupesFound = true;          
        }
        else {
          ids.add(record.id);
          records.push(record);
        }
      }
      if(dupesFound) {
        console.log('duplicates found');
      }
      if(newNextToken === result.nextToken) {
        break;
      }
      if(recordCount === records.length) {
        // no new records were added
        break;
      }
      recordCount = records.length;
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
