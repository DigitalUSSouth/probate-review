import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProbateRecordCollection } from '../API.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { deleteProbateRecordCollections } from 'src/state/probate-record-collection.actions';

@Component({
  selector: 'app-selectable-collection-list-view',
  templateUrl: './selectable-collection-list-view.component.html',
  styleUrls: ['./selectable-collection-list-view.component.sass']
})
export class SelectableCollectionListViewComponent {
  dataSource: MatTableDataSource<ProbateRecordCollection> = new MatTableDataSource<ProbateRecordCollection>();
  selection: SelectionModel<ProbateRecordCollection> = new SelectionModel<ProbateRecordCollection>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren('checkbox') checkBoxes?: QueryList<MatCheckbox>;
  @Output() selectedCollections = new EventEmitter<ProbateRecordCollection[]>();
  @Input() showCheckBoxes = false;
  @Input() showActions = false;
  @Input() collections?: ProbateRecordCollection[];

  displayedColumns = ['title', 'description','createdAt']; // Customize the displayed columns as needed

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    if (this.showCheckBoxes) {
      this.displayedColumns = ['checked', ...this.displayedColumns];
    }

    if(this.showActions) {
      this.displayedColumns.push('actions');
    }
    
    if (this.collections) {
      this.dataSource = new MatTableDataSource<ProbateRecordCollection>(this.collections.map(r => r as ProbateRecordCollection));
      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    let recordChange = changes['collections'];

    if (recordChange) {      
      this.dataSource = new MatTableDataSource<ProbateRecordCollection>(this.collections?.map(r => r as ProbateRecordCollection));
      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
    }
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
