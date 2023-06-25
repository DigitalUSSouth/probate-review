import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProbateRecordDetailComponent } from './edit-probate-record-detail.component';

describe('EditProbateRecordDetailComponent', () => {
  let component: EditProbateRecordDetailComponent;
  let fixture: ComponentFixture<EditProbateRecordDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProbateRecordDetailComponent]
    });
    fixture = TestBed.createComponent(EditProbateRecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
