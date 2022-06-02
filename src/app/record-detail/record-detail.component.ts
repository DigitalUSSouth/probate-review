import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RecordService } from '../record.service';
import { ProbateRecord } from '../probate-record';
import * as dragon from 'openseadragon'
import data from './categories.json';

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
  private categoryMap: Map<string, Array<SubcategoryOptionValue>> = this.objToStrMap(data); 
  
  osd?: dragon.Viewer;
  constructor(private route: ActivatedRoute, private location: Location, private recordService: RecordService, private renderer: Renderer2) { 
  }

  objToStrMap(obj: any) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      let props = Object.getOwnPropertyNames(obj[k]);
      strMap.set(props[0], obj[k][props[0]]);
    }
    // console.log(strMap);
    return strMap;
  }
  

  populateSubcategory(lineIndex: number): void {
    const selectObject = document.getElementById("category-" + lineIndex) as HTMLInputElement;
    let subcategories = this.categoryMap.get(selectObject?.value);
    console.log(subcategories);
    let subcategorySelect = document.getElementById("subcategory-" + lineIndex);
    while(subcategorySelect?.firstChild) {
      subcategorySelect.removeChild(subcategorySelect.firstChild);
    }
    if(subcategories) {
      for(let i = 0; i < subcategories.length; i++) {
        let optionJSON = subcategories[i];
        console.log(optionJSON);
        let optionElement = document.createElement("option");
        optionElement.setAttribute("value", optionJSON.value);
        let textNode = document.createTextNode(optionJSON.text);
        optionElement.appendChild(textNode);
        subcategorySelect?.appendChild(optionElement);
      } 
    }
  }

  highlightText(index: number): void {
    console.log(`line ${index} highlighted`);
    const OVERLAY_ID = 'highlighted-line';
    const boundingBox = this.record?.lines[index].boundingBox;
    console.log(boundingBox);
    // check if overlay exists
    let overlay = document.getElementById(OVERLAY_ID);
    if(overlay) {
      this.osd?.removeOverlay(OVERLAY_ID);
    }

    overlay = this.renderer.createElement('div');
    this.renderer.setProperty(overlay, 'id', OVERLAY_ID);
    this.renderer.setProperty(overlay, 'className', 'highlight');
    this.renderer.appendChild(document.body, overlay);
    const rect = new dragon.Rect(boundingBox?.Left, boundingBox?.Top, boundingBox?.Width, boundingBox?.Height);
    rect.y /= 2;
    rect.height /= 2;
    this.osd?.addOverlay({element: overlay!, location: rect});
    // this.osd?.viewport.panTo(new dragon.Point(rect.x + rect.width / 2, rect.y - rect.height / 2));
    this.osd?.viewport.fitBoundsWithConstraints(rect);
    console.log('zoom is ' + this.osd?.viewport.getZoom());
  }

  async getRecord(id: string): Promise<void> {
    console.log('getting records');
    // this.record = await this.recordService.getProbateRecord(id);
    this.recordService.getRecord(id).subscribe(record => {
      this.record = {id, ...record};
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
    });

    console.log('records received');
  }

  ngOnInit(): void {
    
    
  }

  ngAfterViewInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.getRecord(id);
    

  }

}
