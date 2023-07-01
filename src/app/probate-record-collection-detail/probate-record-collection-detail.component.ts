import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import {
  loadProbateRecordCollection,
  updateProbateRecordCollection,
} from '../../state/probate-record-collection.actions';
import {
  selectProbateRecordCollection,
  selectProbateRecordCollectionLoading,
} from '../../state/probate-record-collection.selectors';
import { ProbateRecordCollection, ProbateRecord } from '../API.service';
import { AmplifyUser } from '@aws-amplify/ui';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectProbateRecordsDialogComponent } from '../select-probate-records-dialog/select-probate-records-dialog.component';
import { selectSelectedRecords } from 'src/state/probte-record.selectors';
import { loadSelectedRecordsById } from 'src/state/probate-record.actions';

@Component({
  selector: 'app-probate-record-collection-detail',
  templateUrl: './probate-record-collection-detail.component.html',
  styleUrls: ['./probate-record-collection-detail.component.sass'],
})
export class ProbateRecordCollectionDetailComponent implements OnInit {
  probateRecordCollection$: Observable<ProbateRecordCollection | null>;
  probateRecordCollection: ProbateRecordCollection | null = null;
  probateRecords$?: Observable<(ProbateRecord | null)[]>;
  probateRecords: ProbateRecord[] = [];
  selectedProbateRecords: ProbateRecord[] = [];
  loading$: Observable<boolean>;
  user?: AmplifyUser;
  displayedColumns = ['thumbnail', 'title'];
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
      this.probateRecordCollection = collection;
      console.log('collection loaded');
      console.log('collection detail');
      console.log(collection);
      // this.probateRecords = (collection) ? collection!.probateRecords!.items.map(c => c!.probateRecord) || [] : [];
      if (collection) {
        if (
          collection.probateRecordIds &&
          collection.probateRecordIds.length > 0
        ) {
          console.log('loading associated records');
          this.store.dispatch(
            loadSelectedRecordsById({
              ids: collection.probateRecordIds as string[],
            })
          );
          this.probateRecords$ = this.store.pipe(select(selectSelectedRecords));
          this.probateRecords$.subscribe((selectedRecords) => {
            this.probateRecords = selectedRecords as ProbateRecord[];
            console.log('probate records loaded');
            console.log(this.probateRecords);
          });
        } else {
          this.probateRecords = [];
        }
      }
    });

    this.loading$ = this.store.pipe(
      select(selectProbateRecordCollectionLoading)
    );
  }

  ngOnInit() {
    this.collectionId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.collectionId) {
      this.store.dispatch(
        loadProbateRecordCollection({ id: this.collectionId })
      );
    }
  }

  ngAfterViewInit() {
    this.user = this.authenticator.user;
  }

  openSelectProbateRecordsDialog() {
    const dialogRef: MatDialogRef<SelectProbateRecordsDialogComponent> =
      this.dialog.open(SelectProbateRecordsDialogComponent, {
        width: '100%',
      });

    dialogRef.afterClosed().subscribe((selectedRecords: ProbateRecord[]) => {
      console.log('dialog closed');
      if (selectedRecords && selectedRecords.length > 0) {
        // Handle the selected records
        console.log('Selected Records:', selectedRecords);
        const selectedIds = selectedRecords.map((record) => record.id);
        let updatedCollection = { ...this.probateRecordCollection };
        delete updatedCollection['__typename'];
        delete updatedCollection['createdAt'];
        delete updatedCollection['updatedAt'];
        if (!updatedCollection.probateRecordIds) {
          updatedCollection.probateRecordIds = [];
        }
        let updatedNeeded = false;
        if (!updatedCollection.probateRecordIds) {
          updatedCollection.probateRecordIds = [];
        }
        for (const selectedId of selectedIds) {
          if (
            !updatedCollection.probateRecordIds.includes(
              selectedId
            )
          ) {
            updatedCollection.probateRecordIds = [...updatedCollection.probateRecordIds, selectedId];
            updatedNeeded = true;
          }
        }

        if (updatedNeeded) {
          this.store.dispatch(
            updateProbateRecordCollection({
              probateRecordCollection: updatedCollection as ProbateRecordCollection,
            })
          );
          this.store.dispatch(
            loadSelectedRecordsById({
              ids: updatedCollection.probateRecordIds as string[],
            })
          );
        }
      }
    });
  }

  onSelectedProbateRecords(selectedProbateRecords: ProbateRecord[]) {
    console.log('records selected', selectedProbateRecords);
    this.selectedProbateRecords = selectedProbateRecords;
  }

  removeSelected() {
    const selectedIds = this.selectedProbateRecords.map((record) => record.id);

    let updatedCollection = { ...this.probateRecordCollection };
    if (!updatedCollection.probateRecordIds) {
      updatedCollection.probateRecordIds = [];
    }
    updatedCollection.probateRecordIds =
      updatedCollection.probateRecordIds!.filter(
        (id) => !selectedIds.includes(id!)
      );
    delete updatedCollection['__typename'];
    delete updatedCollection['createdAt'];
    delete updatedCollection['updatedAt'];
    this.store.dispatch(
      updateProbateRecordCollection({
        probateRecordCollection: updatedCollection as ProbateRecordCollection,
      })
    );
  }
}
