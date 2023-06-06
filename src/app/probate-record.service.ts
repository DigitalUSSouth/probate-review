import { Injectable } from '@angular/core';
import { Observable, catchError, from, map } from 'rxjs';
import { APIService, ListProbateRecordsQuery, ModelProbateRecordFilterInput, ProbateRecord } from './API.service';

@Injectable({
  providedIn: 'root'
})
export class ProbateRecordService {

  constructor(private recordService: APIService ) { }  
  getProbateRecords(
    filter: ModelProbateRecordFilterInput | undefined,
    pageSize: number,
    nextToken?: string
  ): Observable<{ probateRecords: ProbateRecord[]; nextToken: string | null }> {
    return from(
      this.recordService.ListProbateRecords(undefined, filter, pageSize, nextToken)
    ).pipe(
      map((result: ListProbateRecordsQuery) => {
          let records = result!.items!.map((x) => x as ProbateRecord);
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
