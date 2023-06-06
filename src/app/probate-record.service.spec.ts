import { TestBed } from '@angular/core/testing';

import { ProbateRecordService } from './probate-record.service';

describe('ProbateRecordService', () => {
  let service: ProbateRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProbateRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
