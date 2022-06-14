import { Injectable } from '@angular/core';
import { API, Auth } from 'aws-amplify';
import { ProbateRecord } from './probate-record';
import { Observable, of, from } from 'rxjs';
import axios, {AxiosError} from 'axios';


const apiName = 'probatemetadataapi';
const path = '/record/';
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
    const data = await API.get(apiName, `${path}${id}`, {});
    return {id: id, ...data};
  }

  getRecord(id: string): Observable<ProbateRecord> {
    return from(API.get(apiName, `/record/${id}`, {}));
  }

  async getProbateRecordStatus(id: string): Promise<number> {
    let statusCode = 200;
    try {
      await API.head(apiName, `/record/${id}`, {});
    }
    catch(error) {
      const httpError = error as AxiosError;
      console.log(httpError);
      statusCode = httpError.response!.status;
    }
    return statusCode;
  }

  async doesProbateRecordExist(id: string): Promise<boolean> {
    let statusCode = 200;
    try {
      await API.head(apiName, `/record/${id}`, {});
    }
    catch(error) {
      console.log(error);
      statusCode = 500;
    }
    return statusCode === 200;
  }

  doesRecordExist(id: string): Observable<boolean> {
    console.log(`calling does record exist with ${id}`);
    return from(API.head(apiName, `/record/${id}`, {}));
    // console.log(response);
    // return response.body === 'true';
    
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
