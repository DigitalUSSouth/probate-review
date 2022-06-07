import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Storage } from 'aws-amplify';
import {v4 as uuidv4} from 'uuid';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { RecordService } from '../record.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass']
})
export class UploadComponent implements OnInit {
  // @ViewChild("fileDropRef", { static: false }) fileDropEl?: ElementRef;
  // files: any[] = [];
  constructor(public authenticator: AuthenticatorService, private recordService: RecordService){}

  ngOnInit(): void {
  }


  /**
   * on file drop handler
  */
  dropHandler(event: Event) {
    event.preventDefault();
    const dragEvent = event as DragEvent;
    if(dragEvent.dataTransfer?.items) {
      const length = dragEvent.dataTransfer.items.length;
      console.log('length is ' + length);
      console.log(dragEvent.dataTransfer?.items);
      for(let i = 0; i < length; i++) {
        const item = dragEvent.dataTransfer.items[i]; 
        // console.log(item);
        const file = dragEvent.dataTransfer.items[i].getAsFile();
        if(file) {
          // console.log(file);
          let re = new RegExp(/(?:\.([^.]+))?$/);
          let ext = re.exec(file.name);
          let docid = uuidv4() as string;
          let metadata = {
            docid,
            uploader: this.authenticator.user.username!
          };
          Storage.put(file.name, file, {metadata});
        }
      }
    }
  }

  dragOverHandler(event: Event) {
    event.preventDefault();
    const dragEvent  = event as DragEvent;
    // don't try to process non-images
    var imageType = /image.*/;
    if(dragEvent.dataTransfer?.items) {
      
      const file = dragEvent.dataTransfer.items[0];
      dragEvent.dataTransfer.dropEffect = file.type.match(imageType) ? "copy" : "none";
    }
  }

 

}
