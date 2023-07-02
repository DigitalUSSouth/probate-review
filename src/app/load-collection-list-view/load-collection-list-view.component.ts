import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProbateRecordCollection } from '../API.service';
import { Store, select } from '@ngrx/store';
import { loadProbateRecordCollections } from 'src/state/probate-record-collection.actions';
import { AppState } from '../app.state';
import { selectProbateRecordCollections, selectProbateRecordCollectionsLoading, selectProbateRecordCollectionsError } from 'src/state/probate-record-collection.selectors';

@Component({
  selector: 'app-load-collection-list-view',
  templateUrl: './load-collection-list-view.component.html',
  styleUrls: ['./load-collection-list-view.component.sass']
})
export class LoadCollectionListViewComponent {
  probateRecordCollections$?: Observable<ProbateRecordCollection[]>;
  collections?: ProbateRecordCollection[];
  loading$?: Observable<boolean>;
  error$?: Observable<string | null>;
  selection: SelectionModel<ProbateRecordCollection> = new SelectionModel<ProbateRecordCollection>(true, []);

  @Output() selectedCollections = new EventEmitter<ProbateRecordCollection[]>();
  @Input() showCheckBoxes = false;
  @Input() showActions = false;

  constructor(private store: Store<AppState>){
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
      this.collections = collections;
    });
    
    this.loading$.subscribe((loading) => {
      console.log('loading ' + loading);
    });
  }
  
  
  loadMoreCollections() {
    this.store.dispatch(
      loadProbateRecordCollections({
        pageSize: 10, // Set your desired page size
        filter: undefined, // Set your filter if needed
        nextToken: undefined, // Set your next token if needed
      })
    );
  }

  onSelectedCollectionsChanged(selectedCollections: ProbateRecordCollection[]) {
    this.selectedCollections.emit(selectedCollections);
  }
}
