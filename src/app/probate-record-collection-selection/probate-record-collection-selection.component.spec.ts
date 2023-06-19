import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbateRecordCollectionSelectionComponent } from './probate-record-collection-selection.component';

describe('ProbateRecordCollectionSelectionComponent', () => {
  let component: ProbateRecordCollectionSelectionComponent;
  let fixture: ComponentFixture<ProbateRecordCollectionSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProbateRecordCollectionSelectionComponent]
    });
    fixture = TestBed.createComponent(ProbateRecordCollectionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
