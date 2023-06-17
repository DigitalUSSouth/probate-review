import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { loadProbateRecordCollection } from '../../state/probate-record-collection.actions';
import { selectProbateRecordCollection, selectProbateRecordCollectionLoading } from '../../state/probate-record-collection.selectors';
import { ProbateRecordCollection, ModelCollectionRecordsConnection, ProbateRecord } from '../API.service';
import { AmplifyUser } from '@aws-amplify/ui';
import { AuthenticatorService } from '@aws-amplify/ui-angular';

@Component({
  selector: 'app-probate-record-collection-detail',
  templateUrl: './probate-record-collection-detail.component.html',
  styleUrls: ['./probate-record-collection-detail.component.sass'],
})
export class ProbateRecordCollectionDetailComponent implements OnInit {
  probateRecordCollection$: Observable<ProbateRecordCollection | null>;
  probateRecords$: Observable<(ProbateRecord | null)[]>;
  loading$: Observable<boolean>;
  user?: AmplifyUser;
  displayedColumns = ["thumbnail", "title"];
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    public authenticator: AuthenticatorService,
  ) {
    this.probateRecordCollection$ = this.store.pipe(
      select(selectProbateRecordCollection)
    );

    this.probateRecords$ = this.probateRecordCollection$.pipe(
      map((collection) => collection!.probateRecords!.items.map(c => c!.probateRecord) || [])
    );

    this.loading$ = this.store.pipe(
      select(selectProbateRecordCollectionLoading)
    );
  }

  ngOnInit() {
    

    const collectionId = this.route.snapshot.paramMap.get('id');
    if (collectionId) {
      this.store.dispatch(loadProbateRecordCollection({ id: collectionId }));
    }
  }

  ngAfterViewInit() {
    this.user = this.authenticator.user;  
  }
}