import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {
  searchTerm = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  search(): void {
    this.router.navigate(['/search', encodeURIComponent(this.searchTerm)])
  }
}
