import { Component, OnInit, QueryList, ViewChild, ViewChildren, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { loadProbateRecordCollections } from '../../state/probate-record-collection.actions';
import {
  selectProbateRecordCollections,
  selectProbateRecordCollectionsLoading,
  selectProbateRecordCollectionsError,
} from '../../state/probate-record-collection.selectors';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProbateRecordCollection, ModelProbateRecordCollectionFilterInput } from '../API.service';
import { Observable, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AmplifyUser } from '@aws-amplify/ui';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-probate-record-collection-list',
  templateUrl: './probate-record-collection-list.component.html',
  styleUrls: ['./probate-record-collection-list.component.sass'],
})
export class ProbateRecordCollectionListComponent implements OnInit {
  probateRecordCollections$?: Observable<ProbateRecordCollection[]>;
  loading$?: Observable<boolean>;
  error$?: Observable<string | null>;
  dataSource: MatTableDataSource<ProbateRecordCollection> = new MatTableDataSource<ProbateRecordCollection>();
  selection: SelectionModel<ProbateRecordCollection> = new SelectionModel<ProbateRecordCollection>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('checkbox') checkBoxes?: QueryList<MatCheckbox>;
  @Output() selectedCollections = new EventEmitter<ProbateRecordCollection[]>();


  displayedColumns = ['title', 'description', 'actions']; // Customize the displayed columns as needed

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.probateRecordCollections$ = this.store.pipe(
      select(selectProbateRecordCollections),
      tap((collections) => {
        if (collections.length === 0) {
          this.store.dispatch(
            loadProbateRecordCollections({
              pageSize: 10, // Set your desired page size
              filter: undefined, // Set your filter if needed
              nextToken: undefined, // Set your next token if needed
            })
          );
        }
      })
    );
    this.loading$ = this.store.pipe(select(selectProbateRecordCollectionsLoading));
    this.error$ = this.store.pipe(select(selectProbateRecordCollectionsError));
    
    this.probateRecordCollections$.subscribe((collections) => {
      console.log('collections loaded');
      console.log(collections);
      this.dataSource.data = collections;
    });
    
    this.loading$.subscribe((loading) => {
      console.log('loading ' + loading);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleAllChecks(event: MatCheckboxChange): void {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
    } else {
      this.selection.clear();
    }
  }

  toggleCheck(collection: ProbateRecordCollection): void {
    this.selection.toggle(collection);
  }
  
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selectCollections(): void {
    const selectedCollections = this.selection.selected;
    this.selectedCollections.emit(selectedCollections);
  }
  
}