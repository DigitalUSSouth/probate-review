import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProbateRecordsDialogComponent } from './select-probate-records-dialog.component';

describe('SelectProbateRecordsDialogComponent', () => {
  let component: SelectProbateRecordsDialogComponent;
  let fixture: ComponentFixture<SelectProbateRecordsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectProbateRecordsDialogComponent]
    });
    fixture = TestBed.createComponent(SelectProbateRecordsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
