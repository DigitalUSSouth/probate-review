import { Component, OnInit, QueryList, ViewChild, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { deleteProbateRecordCollections, loadProbateRecordCollections } from '../../state/probate-record-collection.actions';
import {
  selectProbateRecordCollections,
  selectProbateRecordCollectionsLoading,
  selectProbateRecordCollectionsError,
  selectProbateRecordCollectionsUpdating,
} from '../../state/probate-record-collection.selectors';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProbateRecordCollection, ModelProbateRecordCollectionFilterInput } from '../API.service';
import { Observable, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

@Component({
  selector: 'app-probate-record-collection-list',
  templateUrl: './probate-record-collection-list.component.html',
  styleUrls: ['./probate-record-collection-list.component.sass'],
})
export class ProbateRecordCollectionListComponent implements OnInit {
  probateRecordCollections$?: Observable<ProbateRecordCollection[]>;
  loading$?: Observable<boolean>;
  updating$: Observable<boolean>;
  updating = false;
  error$?: Observable<string | null>;
  dataSource: MatTableDataSource<ProbateRecordCollection> = new MatTableDataSource<ProbateRecordCollection>();
  selection: SelectionModel<ProbateRecordCollection> = new SelectionModel<ProbateRecordCollection>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('checkbox') checkBoxes?: QueryList<MatCheckbox>;
  @Output() selectedCollections = new EventEmitter<ProbateRecordCollection[]>();
  @Input() showCheckBoxes = false;

  displayedColumns = ['title', 'description', 'actions']; // Customize the displayed columns as needed

  constructor(private store: Store<AppState>, private router: Router) {
    this.updating$ = this.store.pipe(
      select(selectProbateRecordCollectionsUpdating)
    );
    this.updating$.subscribe((updating) => {
      this.updating = updating;
    });
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

  ngOnInit() {
    if (this.showCheckBoxes) {
      this.displayedColumns = ['checked', ...this.displayedColumns];
    }

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
    this.selectionChanged();
  }

  toggleCheck(collection: ProbateRecordCollection): void {
    this.selection.toggle(collection);
    this.selectionChanged();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selectionChanged(): void {
    const selectedCollections = this.selection.selected;
    this.selectedCollections.emit(selectedCollections);
  }

  createNewRecord(): void {
    this.router.navigateByUrl('probate-record-collections/create')
  }

  deleteSelected(): void {
    const ids = this.selection.selected.map(c => c.id);
    this.selection.clear();
    this.store.dispatch(deleteProbateRecordCollections({ids}));
  }
}
