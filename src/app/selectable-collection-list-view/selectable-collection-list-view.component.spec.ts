import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectableCollectionListViewComponent } from './selectable-collection-list-view.component';

describe('SelectableCollectionListViewComponent', () => {
  let component: SelectableCollectionListViewComponent;
  let fixture: ComponentFixture<SelectableCollectionListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectableCollectionListViewComponent]
    });
    fixture = TestBed.createComponent(SelectableCollectionListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
