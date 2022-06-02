import { Component, OnInit } from '@angular/core';
import { RecordService } from '../record.service';
import { ProbateRecord } from '../probate-record';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.sass']
})
export class ReviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
