import { Injectable } from '@angular/core';
import { Observable, catchError, from, map } from 'rxjs';
import {
  APIService,
  ListProbateRecordsQuery,
  ModelProbateRecordCollectionFilterInput,
  ModelProbateRecordFilterInput,
  ModelSortDirection,
  ProbateRecord,
  ProbateRecordCollection,
} from './API.service';

@Injectable({
  providedIn: 'root',
})
export class ProbateRecordService {
  constructor(private recordService: APIService) {}
  private async getProbateRecordsByCount(
    filter: ModelProbateRecordFilterInput | undefined,
    count: number,
    nextToken?: string | null | undefined
  ) {
    console.log('filter passed to probate svc');
    console.log(filter);
    let result = await this.recordService.ListProbateRecords(
      undefined,
      filter,
      count,
      nextToken ?? ''
    );
    let newNextToken = result.nextToken;
    let records = result.items!.map((r) => r as ProbateRecord);
    let ids = new Set<string>();
    records.map((r) => {
      ids.add(r.id);
    });
    let recordCount = records.length;
    while (recordCount < count && newNextToken) {
      console.log('next token', newNextToken);
      result = await this.recordService.ListProbateRecords(
        undefined,
        filter,
        count - records.length,
        newNextToken ?? ''
      );
      let recordsToAdd = result.items.map((r) => r as ProbateRecord);
      let dupesFound = false;
      for (const record of recordsToAdd) {
        if (ids.has(record.id)) {
          dupesFound = true;
          console.log('dupe record found', record)
        } else {
          ids.add(record.id);
          records.push(record);
        }
      }
      
      if (newNextToken === result.nextToken) {
        break;
      }
      
      recordCount = records.length;
      newNextToken = result.nextToken;
    }
    return { records, nextToken: newNextToken };
  }

  getProbateRecords(
    filter: ModelProbateRecordFilterInput | undefined,
    pageSize: number,
    nextToken?: string | null
  ): Observable<{ probateRecords: ProbateRecord[]; nextToken: string | undefined }> {
    console.log('getting probate records');
    return from(
      this.getProbateRecordsByCount(filter, pageSize, nextToken)
    ).pipe(
      map(
        (result: {
          records: ProbateRecord[];
          nextToken: string | null | undefined;
        }) => {
          let records = result.records;
          console.log('records returned');
          console.log(records);
          return {
            probateRecords: records,
            nextToken: result.nextToken || undefined,
          };
        }
      ),
      catchError((error) => {
        console.error('Error fetching ProbateRecords:', error);
        throw error;
      })
    );
  }

  loadFilteredProbateRecords(
    filter: ModelProbateRecordFilterInput | undefined,
    limit: number,
    nextToken: string | null | undefined,
    sortDirection: ModelSortDirection
  ): Observable<{ probateRecords: ProbateRecord[]; nextToken: string | undefined }> {
    console.log('getting probate records');
    return from(
      this.getProbateRecordsByCount(filter, limit, nextToken)
    ).pipe(
      map(
        (result: {
          records: ProbateRecord[];
          nextToken: string | null | undefined;
        }) => {
          let records = result.records;
          console.log('records returned');
          console.log(records);
          return {
            probateRecords: records,
            nextToken: result.nextToken || undefined,
          };
        }
      ),
      catchError((error) => {
        console.error('Error fetching ProbateRecords:', error);
        throw error;
      })
    );
  }

  private async getProbateRecordCollectionsByCount(
    filter: ModelProbateRecordCollectionFilterInput | undefined,
    count: number,
    nextToken?: string | null | undefined,
    sortDirection?: ModelSortDirection
  ) {
    let result = await this.recordService.ListProbateRecordCollections(
      filter,
      count,
      nextToken ?? ''
    );
    let newNextToken = result.nextToken;
    let recordCollections = result.items!.map(
      (r) => r as ProbateRecordCollection
    );
    let ids = new Set<string>();
    recordCollections.map((r) => {
      ids.add(r.id);
    });
    let recordCollectionCount = recordCollections.length;
    while (recordCollectionCount < count && newNextToken) {
      result = await this.recordService.ListProbateRecordCollections(
        filter,
        count - recordCollections.length,
        nextToken ?? ''
      );
      let recordsToAdd = result.items.map((r) => r as ProbateRecordCollection);
      let dupesFound = false;
      for (const record of recordsToAdd) {
        if (ids.has(record.id)) {
          dupesFound = true;
        } else {
          ids.add(record.id);
          recordCollections.push(record);
        }
      }
      if (dupesFound) {
        console.log('duplicates found');
      }
      if (newNextToken === result.nextToken) {
        break;
      }
      if (recordCollectionCount === recordCollections.length) {
        // no new records were added
        break;
      }
      recordCollectionCount = recordCollections.length;
      newNextToken = result.nextToken;
    }
    return { records: recordCollections, nextToken: newNextToken };
  }

  getProbateRecordCollections(
    filter: ModelProbateRecordFilterInput | undefined,
    pageSize: number,
    nextToken?: string
  ): Observable<{
    probateRecordCollections: ProbateRecordCollection[];
    nextToken: string | null;
  }> {
    console.log('getting probate record collections');
    return from(
      this.getProbateRecordCollectionsByCount(filter, pageSize, nextToken)
    ).pipe(
      map(
        (result: {
          records: ProbateRecordCollection[];
          nextToken: string | null | undefined;
        }) => {
          let records = result.records;
          console.log('records returned');
          console.log(records);
          return {
            probateRecordCollections: records,
            nextToken: result.nextToken || null,
          };
        }
      ),
      catchError((error) => {
        console.error('Error fetching ProbateRecords:', error);
        throw error;
      })
    );
  }

  
}
