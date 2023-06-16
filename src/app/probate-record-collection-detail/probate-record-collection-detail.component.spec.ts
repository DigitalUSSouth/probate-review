import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbateRecordCollectionDetailComponent } from './probate-record-collection-detail.component';

describe('ProbateRecordCollectionDetailComponent', () => {
  let component: ProbateRecordCollectionDetailComponent;
  let fixture: ComponentFixture<ProbateRecordCollectionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProbateRecordCollectionDetailComponent]
    });
    fixture = TestBed.createComponent(ProbateRecordCollectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
