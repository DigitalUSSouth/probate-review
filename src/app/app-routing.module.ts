import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { RecordsComponent } from './records/records.component';
import { ReviewComponent } from './review/review.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {path: 'records', component: RecordsComponent},
  {path: 'record/:id', component: RecordDetailComponent},
  {path: 'review/:id', component: ReviewComponent, canActivate: [AuthGuard]},
  {path: 'upload', component: UploadComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
