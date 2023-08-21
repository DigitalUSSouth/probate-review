import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-reviewed-list',
  templateUrl: './reviewed-list.component.html',
  styleUrls: ['./reviewed-list.component.sass']
})
export class ReviewedListComponent implements OnInit {
  filter = { reviewCount: { ge: 2 }, markedForDeletion: {ne: true}};
  pageSizeCookie = 'reviewedPageSize';

  constructor() {}

  ngOnInit(): void {
    
  }
}
