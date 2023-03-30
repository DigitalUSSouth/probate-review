import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbateRecordsTableComponent } from './probate-records-table.component';

describe('ProbateRecordsTableComponent', () => {
  let component: ProbateRecordsTableComponent;
  let fixture: ComponentFixture<ProbateRecordsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbateRecordsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProbateRecordsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
