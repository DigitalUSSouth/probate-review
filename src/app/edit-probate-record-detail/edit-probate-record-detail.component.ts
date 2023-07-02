import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProbateRecord } from '../API.service';
import { loadProbateRecordById } from 'src/state/probate-record.actions';
import { selectSelectedRecord } from 'src/state/probte-record.selectors';

@Component({
  selector: 'app-edit-probate-record-detail',
  templateUrl: './edit-probate-record-detail.component.html',
  styleUrls: ['./edit-probate-record-detail.component.sass']
})
export class EditProbateRecordDetailComponent implements OnInit {
  probateRecord$: Observable<ProbateRecord | null>;

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {
    this.probateRecord$ = this.store.select(selectSelectedRecord);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(loadProbateRecordById({ id }));
    }
  }
}
