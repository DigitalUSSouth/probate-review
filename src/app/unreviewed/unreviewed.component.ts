import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unreviewed',
  templateUrl: './unreviewed.component.html',
  styleUrls: ['./unreviewed.component.sass'],
})
export class UnreviewedComponent implements OnInit {
  filter = { reviewCount: { lt: 2 } };
  pageSizeCookie = 'unreviewedPageSize';  
  constructor() {}

  ngOnInit(): void {}
}
