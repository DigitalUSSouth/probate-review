import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProbateRecordCollectionDialogComponent } from './select-probate-record-collection-dialog.component';

describe('ProbateRecordCollectionSelectionDialogComponent', () => {
  let component: SelectProbateRecordCollectionDialogComponent;
  let fixture: ComponentFixture<SelectProbateRecordCollectionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectProbateRecordCollectionDialogComponent]
    });
    fixture = TestBed.createComponent(SelectProbateRecordCollectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
