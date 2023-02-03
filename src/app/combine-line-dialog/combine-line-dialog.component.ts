import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LineItem } from '../API.service';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-combine-line-dialog',
  templateUrl: './combine-line-dialog.component.html',
  styleUrls: ['./combine-line-dialog.component.sass']
})
export class CombineLineDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: LineItem[], public dialogRef: MatDialogRef<CombineLineDialogComponent>){}
  @ViewChild('lines') lines!: MatSelectionList;
  
  getSelected() : LineItem[] {
    let selectedLines: LineItem[] = [];
    if(this.lines) {
      selectedLines = this.lines.selectedOptions.selected.map(s => s.value);
    }
    return selectedLines;
  }

  cancelDialog() {
    this.dialogRef.close()
  }
}
