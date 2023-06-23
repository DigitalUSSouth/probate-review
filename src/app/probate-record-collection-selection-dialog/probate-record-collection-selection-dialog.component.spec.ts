import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbateRecordCollectionSelectionDialogComponent } from './probate-record-collection-selection-dialog.component';

describe('ProbateRecordCollectionSelectionDialogComponent', () => {
  let component: ProbateRecordCollectionSelectionDialogComponent;
  let fixture: ComponentFixture<ProbateRecordCollectionSelectionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProbateRecordCollectionSelectionDialogComponent]
    });
    fixture = TestBed.createComponent(ProbateRecordCollectionSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
