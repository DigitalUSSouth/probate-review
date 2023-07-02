import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableRecordListViewComponent } from './selectable-record-list-view.component';

describe('SelectableRecordListViewComponent', () => {
  let component: SelectableRecordListViewComponent;
  let fixture: ComponentFixture<SelectableRecordListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectableRecordListViewComponent]
    });
    fixture = TestBed.createComponent(SelectableRecordListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
