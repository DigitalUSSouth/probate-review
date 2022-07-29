import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnreviewedComponent } from './unreviewed.component';

describe('UnreviewedComponent', () => {
  let component: UnreviewedComponent;
  let fixture: ComponentFixture<UnreviewedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnreviewedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnreviewedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
