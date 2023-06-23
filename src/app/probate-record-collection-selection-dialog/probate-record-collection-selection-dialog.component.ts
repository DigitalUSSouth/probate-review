import { Component, EventEmitter, Output } from '@angular/core';
import { ProbateRecordCollection } from '../API.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-probate-record-collection-selection',
  templateUrl: './probate-record-collection-selection-dialog.component.html',
  styleUrls: ['./probate-record-collection-selection-dialog.component.sass'],
})
export class ProbateRecordCollectionSelectionDialogComponent {
  @Output() selectedCollectionsSaved = new EventEmitter<ProbateRecordCollection[]>();
  selectedCollections: ProbateRecordCollection[] = [];

  constructor(public dialogRef: MatDialogRef<ProbateRecordCollectionSelectionDialogComponent>) { }

  ngOnInit() {
  
  }

  onProbateRecordCollectionsSelected(collections: ProbateRecordCollection[]) {
    // Handle the selected probate record collections
    console.log('Selected collections:', collections);
    this.selectedCollections = collections;
  }
  
  saveSelections() {
    console.log('record associated with collections');
    this.selectedCollectionsSaved.emit(this.selectedCollections);
  }

  getSelected() {
    return this.selectedCollections;
  }

  cancelDialog() {
    this.dialogRef.close()
  }

}
