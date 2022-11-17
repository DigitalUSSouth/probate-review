import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnreviewedDetailComponent } from './unreviewed-detail.component';

describe('UnreviewedDetailComponent', () => {
  let component: UnreviewedDetailComponent;
  let fixture: ComponentFixture<UnreviewedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnreviewedDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnreviewedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
