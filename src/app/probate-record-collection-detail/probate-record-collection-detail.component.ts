import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { associateProbateRecords, loadProbateRecordCollection } from '../../state/probate-record-collection.actions';
import { selectProbateRecordCollection, selectProbateRecordCollectionLoading } from '../../state/probate-record-collection.selectors';
import { ProbateRecordCollection, ModelCollectionRecordsConnection, ProbateRecord } from '../API.service';
import { AmplifyUser } from '@aws-amplify/ui';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectProbateRecordsDialogComponent } from '../select-probate-records-dialog/select-probate-records-dialog.component';

@Component({
  selector: 'app-probate-record-collection-detail',
  templateUrl: './probate-record-collection-detail.component.html',
  styleUrls: ['./probate-record-collection-detail.component.sass'],
})
export class ProbateRecordCollectionDetailComponent implements OnInit {
  probateRecordCollection$: Observable<ProbateRecordCollection | null>;
  probateRecords$?: Observable<(ProbateRecord | null)[]>;
  probateRecords: ProbateRecord[] = [];
  loading$: Observable<boolean>;
  user?: AmplifyUser;
  displayedColumns = ["thumbnail", "title"];
  collectionId = '';
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    public authenticator: AuthenticatorService,
    private dialog: MatDialog
  ) {
    this.probateRecordCollection$ = this.store.pipe(
      select(selectProbateRecordCollection)
    );

    this.probateRecordCollection$.subscribe((collection) => {
      this.probateRecords = (collection) ? collection!.probateRecords!.items.map(c => c!.probateRecord) || [] : [];
    });
    // this.probateRecords$ = this.probateRecordCollection$.pipe(
    //   map((collection) => collection!.probateRecords!.items.map(c => c!.probateRecord) || [])
    // );

    // this.probateRecords$.subscribe((records) => {
    //   this.probateRecords = (records) ? records.map(r => r as ProbateRecord) : [];
    // })

    this.loading$ = this.store.pipe(
      select(selectProbateRecordCollectionLoading)
    );
  }

  ngOnInit() {
    

    this.collectionId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.collectionId) {
      this.store.dispatch(loadProbateRecordCollection({ id: this.collectionId }));
    }
  }

  ngAfterViewInit() {
    this.user = this.authenticator.user;  
  }

  openSelectProbateRecordsDialog() {
    const dialogRef: MatDialogRef<SelectProbateRecordsDialogComponent> = this.dialog.open(SelectProbateRecordsDialogComponent, {
      width: '100%',
    });
  
    dialogRef.afterClosed().subscribe((selectedRecords: ProbateRecord[]) => {
      console.log('dialog closed');
      if (selectedRecords) {
        // Handle the selected records
        console.log('Selected Records:', selectedRecords);
        this.store.dispatch(
          associateProbateRecords({
            collectionId: this.collectionId,
            recordIds: selectedRecords.map(record => record.id)
          })
        );
      }
    });
  }
  
}