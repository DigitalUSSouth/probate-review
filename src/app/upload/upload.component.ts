import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { interval } from 'rxjs';
import {
  ProbateRecord,
  APIService,
  ProbateRecordCollection,
} from '../API.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectProbateRecordCollectionDialogComponent } from '../select-probate-record-collection-dialog/select-probate-record-collection-dialog.component';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';
import { associateProbateRecords } from 'src/state/probate-record-collection.actions';

const POLL_INTERVAL = 20000;

@Component({
  selector: 'app-upload',
  encapsulation: ViewEncapsulation.None, // https://stackoverflow.com/questions/43631587/angular-4-css-on-document-createelement
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass'],
})
export class UploadComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;
  fileMap = new Map<string, File>();
  filesInProcessing = Array<string>();
  checkFileProcessedInterval = interval(POLL_INTERVAL);
  selectedProbateRecordCollections: ProbateRecordCollection[] = [];

  constructor(
    public authenticator: AuthenticatorService,
    private probateRecordService: APIService,
    public dialog: MatDialog,
    private store: Store<AppState>
  ) {
    let timer = this.checkFileProcessedInterval.subscribe(async () => {
      if (this.filesInProcessing.length > 0) {
        for (let i = 0; i < this.filesInProcessing.length; i++) {
          const docid = this.filesInProcessing[i];
          try {
            let record = (await this.probateRecordService.GetProbateRecord(
              docid
            )) as ProbateRecord;
            if (record && typeof record === 'object') {
              // add to any checked collections
              for (const collection of this.selectedProbateRecordCollections) {
                this.store.dispatch(
                  associateProbateRecords({
                    collectionId: collection.id,
                    recordIds: [docid],
                  })
                );
              }
              // check if lines have been added
              console.log(record);

              console.log('record has been processed');
              // remove looking for file
              this.filesInProcessing = this.filesInProcessing.filter(
                (id) => id != docid
              );
              let anchorElement = document.getElementById(
                `a-${docid}`
              ) as HTMLAnchorElement;
              if (anchorElement) {
                anchorElement.className = 'processed';
                anchorElement.innerHTML = 'review';
                anchorElement.href = `review/${docid}`;
                anchorElement.target = '_blank';
              }
            }
          } catch (error) {
            console.log(error);
            this.filesInProcessing = this.filesInProcessing.filter(
              (id) => id != docid
            );
            timer.unsubscribe();
            break;
          }
        }
      }
    });
  }

  selectCollections(): void {
    const dialogRef = this.dialog.open(
      SelectProbateRecordCollectionDialogComponent,
      {
        height: '90%',
        panelClass: 'custom-dialog',
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedProbateRecordCollections = result;
        console.log('selected the following collections');
        console.log(this.selectedProbateRecordCollections);
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.fileInputRef) {
      const fileInputElement = this.fileInputRef.nativeElement;
      fileInputElement?.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        const files = target!.files;
        if (files) {
          for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            this.addFile(file!);
          }
        }
      });
    } else {
      console.log('no file input elem found');
    }
  }

  addFile(file: File) {
    let listElement = document.getElementById('filesToBeUploaded');
    let docid = uuidv4() as string;
    this.fileMap.set(docid, file);
    // add it to the UI
    let fileElement = document.createElement('li');
    fileElement.id = `li-${docid}`;
    let anchorElement = document.createElement('a');
    anchorElement.id = `a-${docid}`;
    anchorElement.innerText = 'ready to upload';
    anchorElement.className = 'unprocessed';

    let progressElement = document.createElement('progress');
    progressElement.id = `progress-${docid}`;
    progressElement.value = 0;
    progressElement.max = 100;

    fileElement.innerHTML = `${file.name}&nbsp;`;
    fileElement.appendChild(anchorElement);
    fileElement.appendChild(progressElement);
    listElement!.appendChild(fileElement);
  }

  /**
   * on file drop handler
   */
  dropHandler(event: Event) {
    event.preventDefault();
    const dragEvent = event as DragEvent;
    if (dragEvent.dataTransfer?.items) {
      const length = dragEvent.dataTransfer.items.length;
      console.log('length is ' + length);
      console.log(dragEvent.dataTransfer?.items);

      for (let i = 0; i < length; i++) {
        const item = dragEvent.dataTransfer.items[i];
        // console.log(item);
        const file = dragEvent.dataTransfer.items[i].getAsFile();
        if (file) {
          this.addFile(file);
        }
      }
    }
  }

  dragOverHandler(event: Event) {
    event.preventDefault();
    const dragEvent = event as DragEvent;
    // don't try to process non-images
    var imageType = /image.*/;
    if (dragEvent.dataTransfer?.items) {
      const file = dragEvent.dataTransfer.items[0];
      dragEvent.dataTransfer.dropEffect = file.type.match(imageType)
        ? 'copy'
        : 'none';
    }
  }

  async uploadFiles() {
    for (const docid of this.fileMap.keys()) {
      let anchorElement = document.getElementById(
        `a-${docid}`
      ) as HTMLAnchorElement;
      if (anchorElement) {
        anchorElement.innerText = 'uploading';
      }
      let file = this.fileMap.get(docid);
      console.log(`uploading file ${file!.name}`);
      // let re = new RegExp(/(?:\.([^.]+))?$/);
      // let ext = re.exec(file!.name);
      let metadata = {
        docid,
        uploader: this.authenticator.user.username!,
      };
      this.filesInProcessing.push(docid);
      await Storage.put(file!.name, file, {
        metadata,
        progressCallback: (progress) => {
          // console.log(`Uploaded: ${progress.loaded}/${progress.total} for ${docid}`);
          let progressElement = document.getElementById(
            `progress-${docid}`
          ) as HTMLInputElement;
          if (progressElement) {
            progressElement.value = `${
              (progress.loaded / progress.total) * 100
            }`;
          }
        },
      });
      anchorElement.innerText = 'processing';
    }
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      this.addFile(file!);
    }
  }
}
