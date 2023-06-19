import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { selectProbateRecordCollections } from '../../state/probate-record-collection.selectors';
import { ProbateRecordCollection } from '../API.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-probate-record-collection-selection',
  templateUrl: './probate-record-collection-selection.component.html',
  styleUrls: ['./probate-record-collection-selection.component.sass'],
})
export class ProbateRecordCollectionSelectionComponent {
  constructor(private store: Store<AppState>) { }
  selectedCollections: ProbateRecordCollection[] = [];

  ngOnInit() {
  
  }

  onProbateRecordCollectionsSelected(collections: ProbateRecordCollection[]) {
    // Handle the selected probate record collections
    console.log('Selected collections:', collections);
    this.selectedCollections = collections;
  }
  
  saveSelections() {
    console.log('record associated with collections');
    console.log(this.selectedCollections);
  }

}
