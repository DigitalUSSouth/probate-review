import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedRecordListViewComponent } from './deleted-record-list-view.component';

describe('DeletedRecordListViewComponent', () => {
  let component: DeletedRecordListViewComponent;
  let fixture: ComponentFixture<DeletedRecordListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedRecordListViewComponent]
    });
    fixture = TestBed.createComponent(DeletedRecordListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
