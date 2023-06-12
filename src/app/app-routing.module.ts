import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RecordDetailComponent } from './record-detail/record-detail.component';
// import { RecordsComponent } from './records/records.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchComponent } from './search/search.component';
// import { UnreviewedComponent } from './unreviewed/unreviewed.component';
import { UploadComponent } from './upload/upload.component';
import { UnreviewedDetailComponent } from './unreviewed-detail/unreviewed-detail.component';
import { ProbateRecordListComponent } from './probate-record-list/probate-record-list.component';
import { ReviewedListComponent } from './reviewed-list/reviewed-list.component';

const routes: Routes = [
  {path: 'records', component: ReviewedListComponent},
  {path: 'record/:id', component: RecordDetailComponent},
  {path: 'review/:id', component: UnreviewedDetailComponent, canActivate: [AuthGuard]},
  {path: 'unreviewed', component: ProbateRecordListComponent, canActivate: [AuthGuard ]},
  {path: 'upload', component: UploadComponent, canActivate: [AuthGuard]},
  {path: '', component: SearchComponent},
  {path: 'search/:q', component: SearchResultsComponent},
  // {path: 'r', component: ProbateRecordListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
