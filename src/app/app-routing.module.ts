import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { RecordsComponent } from './records/records.component';
import { ReviewComponent } from './review/review.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchComponent } from './search/search.component';
import { UnreviewedComponent } from './unreviewed/unreviewed.component';
import { UploadComponent } from './upload/upload.component';
import { UnreviewedDetailComponent } from './unreviewed-detail/unreviewed-detail.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

const routes: Routes = [
  {path: 'records', component: MaintenanceComponent},
  {path: 'record/:id', component: MaintenanceComponent},
  {path: 'review/:id', component: MaintenanceComponent, canActivate: [AuthGuard]},
  {path: 'unreviewed', component: MaintenanceComponent, canActivate: [AuthGuard ]},
  {path: 'upload', component: MaintenanceComponent, canActivate: [AuthGuard]},
  {path: '', component: MaintenanceComponent},
  {path: 'search/:q', component: MaintenanceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
