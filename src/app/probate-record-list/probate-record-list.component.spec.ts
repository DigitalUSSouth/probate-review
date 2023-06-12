import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbateRecordListComponent } from './probate-record-list.component';

describe('ProbateRecordListComponent', () => {
  let component: ProbateRecordListComponent;
  let fixture: ComponentFixture<ProbateRecordListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbateRecordListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProbateRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
