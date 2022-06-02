import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { RecordsComponent } from './records/records.component';

const routes: Routes = [
  {path: 'records', component: RecordsComponent},
  {path: 'record/:id', component: RecordDetailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
