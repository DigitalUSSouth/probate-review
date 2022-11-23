import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.sass']
})
export class HelpDialogComponent implements OnInit {
  doNotShowAgain = false;
  constructor(public dialogRef: MatDialogRef<HelpDialogComponent>, @Inject(MAT_DIALOG_DATA) public text: string) {
  }

  ngOnInit(): void {
  }

  closeDialog() {
    
    this.dialogRef.close(this.doNotShowAgain);
  }

}
