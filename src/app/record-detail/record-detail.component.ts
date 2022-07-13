import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProbateRecord, LineItem, APIService} from '../API.service';
import * as dragon from 'openseadragon'
import { CollectionViewer, DataSource } from '@angular/cdk/collections';


interface SubcategoryOptionValue {
  value: string,
  text: string
}

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.sass']
})
export class RecordDetailComponent implements OnInit {
  @Input() record?: ProbateRecord;
  @ViewChild('viewer') viewer!: ElementRef;  
  
  osd?: dragon.Viewer;
  displayedColumns: string[] = ['title', 'category', 'subcategory', 'quantity', 'value'];

  

  

  constructor(private route: ActivatedRoute, private location: Location, private recordService: APIService, private renderer: Renderer2) { 

  }


  async getRecord(id: string): Promise<void> {
    console.log('getting records');
    // this.record = await this.recordService.getProbateRecord(id);
    console.log('fetching query result');
    let queryResult = await this.recordService.GetProbateRecord(id);

    console.log(queryResult);
    this.record = queryResult as ProbateRecord;
    // this.recordService.GetProbateRecord(id).subscribe(record => {
    //   this.record = {id, ...record};
      // console.log(record);
    const infoUrl = `https://d2ai2qpooo3jtj.cloudfront.net/iiif/2/${id}/info.json`;
    this.osd = new dragon.Viewer({
      element: this.viewer.nativeElement,
      showRotationControl: true,
      // Enable touch rotation on tactile devices
      gestureSettingsTouch: {
          pinchToZoom: true,            
      },
      maxZoomLevel: 5.0,
      prefixUrl: "//openseadragon.github.io/openseadragon/images/",
      tileSources: infoUrl
    });
    // });

    console.log('records received');
  }

  ngOnInit(): void {
    
    
  }

  ngAfterViewInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.getRecord(id);
    

  }

}
