import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProbateRecordCollectionComponent } from './create-probate-record-collection.component';

describe('CreateProbateRecordCollectionComponent', () => {
  let component: CreateProbateRecordCollectionComponent;
  let fixture: ComponentFixture<CreateProbateRecordCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProbateRecordCollectionComponent]
    });
    fixture = TestBed.createComponent(CreateProbateRecordCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
