import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewedListComponent } from './reviewed-list.component';

describe('ReviewedListComponent', () => {
  let component: ReviewedListComponent;
  let fixture: ComponentFixture<ReviewedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
