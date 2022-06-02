import { Injectable } from '@angular/core';
import { API, Auth } from 'aws-amplify';
import { ProbateRecord } from './probate-record';
import { Observable, of, from } from 'rxjs';


const apiName = 'probatemetadataapi';
const path = '/record/176f1ee9-a864-4dea-9598-9c48bb84192e';
// const path = '/records';
const myInit = { // OPTIONAL
  headers: {}, // OPTIONAL
};

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  constructor() {
    // Amplify.configure(awsconfig);
    // console.log('Amplify Initialized');
  }

  async getProbateRecord(id: string): Promise<ProbateRecord> {
    const data = await API.get(apiName, path, {});
    return {id: id, ...data};
  }

  getRecord(id: string): Observable<ProbateRecord> {
    return from(API.get(apiName, `/record/${id}`, {}));
  }

  async getProbateRecords(): Promise<ProbateRecord[]> {
    console.log('calling API');
    const data = await API.get(apiName, path, myInit);

    console.log(data);
    console.log('data received');
    return [
      {
        id: '1234',
        lines: [
          {
            boundingBox: {
              Height: 10,
              Width: 10,
              Left: 0,
              Top: 100
            },
            text: 'line 1',            
          }
        ]
      }
    ];
  }

}
