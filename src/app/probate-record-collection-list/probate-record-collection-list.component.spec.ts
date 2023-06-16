import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbateRecordCollectionListComponent } from './probate-record-collection-list.component';

describe('ProbateRecordCollectionListComponent', () => {
  let component: ProbateRecordCollectionListComponent;
  let fixture: ComponentFixture<ProbateRecordCollectionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProbateRecordCollectionListComponent]
    });
    fixture = TestBed.createComponent(ProbateRecordCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
