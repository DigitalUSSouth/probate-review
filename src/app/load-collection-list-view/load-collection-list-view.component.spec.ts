import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCollectionListViewComponent } from './load-collection-list-view.component';

describe('LoadCollectionListViewComponent', () => {
  let component: LoadCollectionListViewComponent;
  let fixture: ComponentFixture<LoadCollectionListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadCollectionListViewComponent]
    });
    fixture = TestBed.createComponent(LoadCollectionListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
