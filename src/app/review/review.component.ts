import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// import { RecordService } from '../record.service';
// import { ProbateRecord } from '../probate-record';
import * as dragon from 'openseadragon'
import data from './categories.json';
import { ProbateRecord, UpdateLineItemInput, APIService, GetProbateRecordQuery, UpdateProbateRecordInput, LineItem, LineItemByProbateRecordQuery} from '../API.service';
import { identifierName } from '@angular/compiler';
import { from } from 'rxjs';
// import { LineItem } from 'src/models';

interface SubcategoryOptionValue {
  value: string,
  text: string
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.sass']
})
export class ReviewComponent implements OnInit {
  @Input() record?: ProbateRecord;
  @ViewChild('viewer') viewer!: ElementRef;  
  osd?: dragon.Viewer;  
  categoryMap: Map<string, Array<SubcategoryOptionValue>> = this.objToStrMap(data); 
  imageSize?: dragon.Point;
  aspectRatio = 1.0;
  updatedLineItems = new Map<number, UpdateLineItemInput> ();
  constructor(private route: ActivatedRoute, private location: Location, private probateRecordService: APIService, private renderer: Renderer2) { 
  }

  objToStrMap(obj: any) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      let props = Object.getOwnPropertyNames(obj[k]);
      strMap.set(props[0], obj[k][props[0]]);
    }
    return strMap;
  }

  ngOnInit(): void {
    
  }

  

  ngAfterViewInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    
    let record$ = from(this.probateRecordService.GetProbateRecord(id));
    record$.subscribe(record => {
      this.record = record as ProbateRecord;
      
      console.log(this.record);
      this.getRecord(id);
      

    })
    


  }

  updateLineItem(lineIndex: number, field: string, value: string) {
    let updateLineItemInput: UpdateLineItemInput;
    if(this.updatedLineItems.has(lineIndex)) {
      updateLineItemInput = this.updatedLineItems.get(lineIndex)!;
    }
    else {
      let lineItem = this.record!.lineItems!.items[lineIndex]!;
      let id = lineItem.id;
      updateLineItemInput = {
        id
      }
      this.updatedLineItems.set(lineIndex, updateLineItemInput);
    }
    switch(field) {
      case "category":
        updateLineItemInput.category = value;
        break;
      case "subcategory":
        updateLineItemInput.subcategory = value;
        break;
    }
  }

  populateSubcategory(lineIndex: number): void {
    const selectObject = document.getElementById("category-" + lineIndex) as HTMLInputElement;
    const category = selectObject?.value;
    let subcategories = this.categoryMap.get(category);
    console.log(subcategories);
    let subcategorySelect = document.getElementById("subcategory-" + lineIndex) as HTMLInputElement;
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
    this.updateLineItem(lineIndex, "category", category);
  }

  onSubcategoryChanged(lineIndex: number): void {
    const selectObject = document.getElementById("category-" + lineIndex) as HTMLInputElement;
    const category = selectObject?.value;
    let subcategorySelect = document.getElementById("subcategory-" + lineIndex) as HTMLInputElement;

    // update our object
    if(this.record != undefined) {
     
      this.updateLineItem(lineIndex, "subcategory", subcategorySelect.value);
    }
  }

  highlightText(index: number): void {
    this.imageSize = this.osd!.world.getItemAt(0).getContentSize();

    this.aspectRatio = this.imageSize!.x / this.imageSize!.y;
    console.log(`aspect ratio is ${this.aspectRatio}`);
    console.log(`line ${index} highlighted`);
    const OVERLAY_ID = 'highlighted-line';
    const boundingBox = this.record!.lineItems!.items[index]!.boundingBox;
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
    const point = new dragon.Point(boundingBox?.left, boundingBox?.top);
    const rect = new dragon.Rect(boundingBox?.left, boundingBox?.top, boundingBox?.width, boundingBox?.height);
    console.log(rect);
    rect.y /= this.aspectRatio;
    rect.height /= this.aspectRatio;
    this.osd?.addOverlay({element: overlay!, location: rect});
    // width: boundingBox?.Width, height: boundingBox?.Height, checkResize: true
    // this.osd?.viewport.panTo(new dragon.Point(rect.x + rect.width / 2, rect.y - rect.height / 2));
    this.osd?.viewport.fitBoundsWithConstraints(rect);
    // console.log('zoom is ' + this.osd?.viewport.getZoom());
  }

  async getRecord(id: string): Promise<void> {
    console.log('getting records');
    
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
    console.log('records received');
  }

  async updateLineItems() {
    console.log('updating line items');
    console.log(this.updatedLineItems);
    for(const lineItem of Array.from(this.updatedLineItems.values())) {
      console.log(lineItem);
      let response = await this.probateRecordService.UpdateLineItem(lineItem);
      console.log(response);
    }
  }

  async updateRecord() {
    let item = {id: this.record!.id, reviewCount: ++this.record!.reviewCount};
    console.log(item);
    let input:UpdateProbateRecordInput = item;
    console.log(input);
    let response = await this.probateRecordService.UpdateProbateRecord(input as unknown as UpdateProbateRecordInput);
    console.log('response');
    console.log(response);
    await this.updateLineItems();
    this.updatedLineItems.clear();
    alert('record updated');
  }

}
