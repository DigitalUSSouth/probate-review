import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadRecordListViewComponent } from './load-record-list-view.component';

describe('LoadRecordListViewComponent', () => {
  let component: LoadRecordListViewComponent;
  let fixture: ComponentFixture<LoadRecordListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadRecordListViewComponent]
    });
    fixture = TestBed.createComponent(LoadRecordListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
