import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombineLineDialogComponent } from './combine-line-dialog.component';

describe('CombineLineDialogComponent', () => {
  let component: CombineLineDialogComponent;
  let fixture: ComponentFixture<CombineLineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombineLineDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombineLineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
