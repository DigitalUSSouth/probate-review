import { Component } from '@angular/core';

@Component({
  selector: 'app-deleted-record-list-view',
  templateUrl: './deleted-record-list-view.component.html',
  styleUrls: ['./deleted-record-list-view.component.sass']
})
export class DeletedRecordListViewComponent {
  filter = { markedForDeletion: { eq: true } };
  pageSizeCookie = 'unreviewedPageSize';  
  constructor() {}
}
