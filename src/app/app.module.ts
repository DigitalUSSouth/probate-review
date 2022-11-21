import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecordsComponent } from './records/records.component';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { UploadComponent } from './upload/upload.component';
import { AuthComponent } from './auth/auth.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UnreviewedComponent } from './unreviewed/unreviewed.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { SearchResultsComponent } from './search-results/search-results.component';
import { UnreviewedDetailComponent } from './unreviewed-detail/unreviewed-detail.component';
import { AngularSplitModule } from 'angular-split';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    RecordsComponent,
    RecordDetailComponent,
    UploadComponent,
    AuthComponent,
    ContextMenuComponent,
    UnreviewedComponent,
    SearchComponent,
    SearchResultsComponent,
    UnreviewedDetailComponent,
    ConfirmDeleteDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAuthenticatorModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatToolbarModule,
    FormsModule,
    AngularSplitModule,
    DragDropModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
