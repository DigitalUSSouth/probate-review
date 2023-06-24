import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProbateRecord } from '../API.service';

@Component({
  selector: 'app-select-probate-records-dialog',
  templateUrl: './select-probate-records-dialog.component.html',
  styleUrls: ['./select-probate-records-dialog.component.sass']
})
export class SelectProbateRecordsDialogComponent {
  selectedRecords: ProbateRecord[] = [];
  constructor(public dialogRef: MatDialogRef<SelectProbateRecordsDialogComponent>){}

  onProbateRecordsSelected(records: ProbateRecord[]) {
    this.selectedRecords = records;
    console.log('records selection changed');
    console.log(this.selectedRecords);

  }

  selectRecords() {
    console.log('select records button pressed');
    return this.selectedRecords;
  }

  cancelDialog() {
    this.dialogRef.close()
  }

}
