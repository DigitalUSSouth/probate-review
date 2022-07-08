
import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, HostListener} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import OpenSeadragon from 'openseadragon';
import data from './categories.json';
import { ProbateRecord, UpdateLineItemInput, APIService, GetProbateRecordQuery, UpdateProbateRecordInput, LineItem, LineItemByProbateRecordQuery, Word} from '../API.service';
import { from } from 'rxjs';
import { ContextMenuModel } from '../interfaces/context-menu-model';


interface SubcategoryOptionValue {
  value: string,
  text: string
}

interface DragSelect {
  overlayElement: HTMLElement,
  startPos: OpenSeadragon.Point,
  isDragging: boolean
}

const OVERLAY_ID = 'highlighted-line';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.sass']
})
export class ReviewComponent implements OnInit {
  @Input() record?: ProbateRecord;
  @ViewChild('viewer') viewer!: ElementRef;  
  osd?: OpenSeadragon.Viewer;
  selectionRect?: OpenSeadragon.Rect;  
  categoryMap: Map<string, Array<SubcategoryOptionValue>> = this.objToStrMap(data); 
  imageSize?: OpenSeadragon.Point;
  aspectRatio = 0.0;
  updatedLineItems = new Map<number, UpdateLineItemInput> ();
  selectionMode = false;
  selectTracker?: OpenSeadragon.MouseTracker;
  dragSelect = {
    overlayElement: null as unknown as HTMLDivElement,
    startPos: new OpenSeadragon.Point(0, 0),
    isDragging: false
  };
  isDisplayContextMenu = false;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX = 0;
  rightClickMenuPositionY = 0;

  constructor(private route: ActivatedRoute, private location: Location, private probateRecordService: APIService, private renderer: Renderer2) {
  }

  displayContextMenu(event: any) {

    this.isDisplayContextMenu = true;

    this.rightClickMenuItems = [
      {
        menuText: 'Combine',
        menuEvent: 'Handle combine',
      },
      {
        menuText: 'Split',
        menuEvent: 'Handle split',
      },
    ];

    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;

  }

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`
    }
  }

  handleMenuItemClick(event: any) {
    switch (event.data) {
      case this.rightClickMenuItems[0].menuEvent:
           console.log('To handle combine');
           break;
      case this.rightClickMenuItems[1].menuEvent:
          console.log('To handle split');
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
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
    // this.loadScript("assets/js/openseadragonselection.js");
    
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
      case "line":
        updateLineItemInput.title = value;
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
    let subcategorySelect = document.getElementById("subcategory-" + lineIndex) as HTMLInputElement;

    // update our object
    if(this.record != undefined) {
     
      this.updateLineItem(lineIndex, "subcategory", subcategorySelect.value);
    }
  }

  onTextChanged(lineIndex: number): void {
    const titleElement = document.getElementById("line-" + lineIndex) as HTMLInputElement;
    console.log(titleElement);
    this.updateLineItem(lineIndex, "line", titleElement.value);
  }

  createOverlayElement(): HTMLElement
  {
    
    let overlay = document.getElementById(OVERLAY_ID);
    if(overlay) {
      this.osd?.removeOverlay(OVERLAY_ID);
    }

    overlay = this.renderer.createElement('div');
    this.renderer.setProperty(overlay, 'id', OVERLAY_ID);
    this.renderer.setProperty(overlay, 'className', 'highlight');
    this.renderer.appendChild(document.body, overlay);

    return overlay!;
  }

  calculateAspectRatio() {
    this.imageSize = this.osd!.world.getItemAt(0).getContentSize();

    this.aspectRatio = this.imageSize!.x / this.imageSize!.y;
    console.log(`aspect ratio is ${this.aspectRatio}`);
  }

  highlightText(index: number): void {
    if(this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }
    
    console.log(`line ${index} highlighted`);
    
    const boundingBox = this.record!.lineItems!.items[index]!.boundingBox;
    console.log(boundingBox);
    // check if overlay exists
    
    const point = new OpenSeadragon.Point(boundingBox?.left, boundingBox?.top);
    const rect = new OpenSeadragon.Rect(boundingBox?.left, boundingBox?.top, boundingBox?.width, boundingBox?.height);
    this.selectionRect = rect;
    rect.y /= this.aspectRatio;
    rect.height /= this.aspectRatio;
    let overlay = this.createOverlayElement();
    this.osd?.addOverlay({element: overlay!, location: rect});
    this.osd?.viewport.fitBoundsWithConstraints(rect);  
    
  }

  selectRect() {
    this.clearRect();
    console.log('selecting now');
    this.selectionMode = true;
    this.osd!.setMouseNavEnabled(false);
    this.dragSelect!.isDragging = true;
  }

  clearRect() {
    let overlay = document.getElementById(OVERLAY_ID);
    if(overlay) {
      this.osd?.removeOverlay(OVERLAY_ID);
    }
  }

  rectanglesIntersect(minAx: number, minAy: number, maxAx: number, maxAy: number,
    minBx: number, minBy:number, maxBx:number, maxBy:number): boolean {
      return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy;
  }

  // A line
  // B selection rect
  verticallyOverlapped(minAy: number, maxAy: number, minBy:number, maxBy:number) {
    const threshold = 0.6;
    let heightA = maxAy - minAy;
    let allowedAmount = (1.0 - threshold) * heightA;
    let isOverlapped = false;
    if(minBy <= minAy ) {
      isOverlapped = maxBy > minAy && maxAy - maxBy < allowedAmount;
    }
    else {
      isOverlapped = minBy < maxAy && maxBy < maxAy || minBy - minAy < allowedAmount;
    }
    
    return isOverlapped;
  }

  
  getSelectedLines(selectRect:OpenSeadragon.Rect): LineItem[] {
    if(this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }

    let lines = new Array<LineItem>();
    for(const line of this.record!.lineItems!.items) {
      const boundingBox = line!.boundingBox;
      const lineRect = new OpenSeadragon.Rect(boundingBox?.left, boundingBox?.top, boundingBox?.width, boundingBox?.height);
      lineRect.y /= this.aspectRatio;
      lineRect.height /= this.aspectRatio;

      if(line && this.rectanglesIntersect(lineRect.x, lineRect.y,
        lineRect.x + lineRect.width,
        lineRect.y + lineRect.height,
        selectRect.x,
        selectRect.y,
        selectRect.x + selectRect.width,
        selectRect.y + selectRect.height) 
        && (this.verticallyOverlapped(lineRect.y, lineRect.y + lineRect.height, selectRect.y, selectRect.y + selectRect.height))
        ) {
          
          lines.push(line);
        }
    }
    return lines;
  }

  async getRecord(id: string): Promise<void> {
    console.log('getting records');
    
    const infoUrl = `https://d2ai2qpooo3jtj.cloudfront.net/iiif/2/${id}/info.json`;
     
    this.osd = new OpenSeadragon.Viewer({
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

    this.selectTracker = new OpenSeadragon.MouseTracker({
      element: this.osd?.element as Element,
      pressHandler: (event) => {
        if (!this.selectionMode) {
          return;
        }
        // console.log('press handler');
        var overlayElement = this.createOverlayElement()
        // overlayElement.style.background = 'rgba(255, 0, 0, 0.3)'; 
        this.dragSelect.overlayElement = overlayElement as HTMLDivElement;
        var viewportPos = this.osd!.viewport.pointFromPixel(event.position);
        this.dragSelect!.startPos = viewportPos;
        this.osd!.addOverlay(overlayElement, new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0));
        
        
      },
      dragHandler: (event) => {
        // console.log('drag handler called');
        if (!this.dragSelect!.isDragging) {
          return;
        }
        
        var viewportPos = this.osd!.viewport.pointFromPixel((event as unknown as OpenSeadragon.CanvasDragEvent).position);
        // console.log(viewportPos);
        var diffX = viewportPos.x - this.dragSelect!.startPos.x;
        var diffY = viewportPos.y - this.dragSelect!.startPos.y;
        
        var location = new OpenSeadragon.Rect(
          Math.min(this.dragSelect!.startPos.x, this.dragSelect!.startPos.x + diffX), 
          Math.min(this.dragSelect!.startPos.y, this.dragSelect!.startPos.y + diffY), 
          Math.abs(diffX), 
          Math.abs(diffY)
        );
       
        let lines = this.getSelectedLines(location);
        console.log(lines);
        this.osd!.updateOverlay(this.dragSelect!.overlayElement!, location);
      },
      releaseHandler: (event) => {
        console.log('release handler called');
        this.dragSelect!.isDragging = false;
        this.selectionMode = false;
        this.osd!.setMouseNavEnabled(true);
      }
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

  async updateRecord(isReviewed = false) {
    let reviewCount = this.record!.reviewCount;
    if(isReviewed) {
      reviewCount++;
    }

    let item = {id: this.record!.id, reviewCount};
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

  public loadScript(url: string): void {
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = true;
    script.defer = true;
    body.appendChild(script);
}
  
}
