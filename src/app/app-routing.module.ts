import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { RecordsComponent } from './records/records.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchComponent } from './search/search.component';
import { UnreviewedComponent } from './unreviewed/unreviewed.component';
import { UploadComponent } from './upload/upload.component';
import { UnreviewedDetailComponent } from './unreviewed-detail/unreviewed-detail.component';

const routes: Routes = [
  {path: 'records', component: RecordsComponent},
  {path: 'record/:id', component: RecordDetailComponent},
  {path: 'review/:id', component: UnreviewedDetailComponent, canActivate: [AuthGuard]},
  {path: 'unreviewed', component: UnreviewedComponent, canActivate: [AuthGuard ]},
  {path: 'upload', component: UploadComponent, canActivate: [AuthGuard]},
  {path: '', component: SearchComponent},
  {path: 'search/:q', component: SearchResultsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
