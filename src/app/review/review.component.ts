
import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import OpenSeadragon from 'openseadragon';
import data from './categories.json';
import { ProbateRecord, UpdateLineItemInput, APIService, GetProbateRecordQuery, UpdateProbateRecordInput, LineItem, LineItemByProbateRecordQuery, Word, Rect, CreateLineItemInput } from '../API.service';
import { from } from 'rxjs';
import { ContextMenuModel } from '../interfaces/context-menu-model';
import { v4 as uuidv4 } from 'uuid';

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
enum DragMode {
  Select = 1,
  Extend,
  Shorten,
  Split
}


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
  updatedLineItemsByIndex = new Map<number, UpdateLineItemInput>();
  updatedLineItemsById = new Map<string, UpdateLineItemInput>();
  dragMode = false;
  selectTracker?: OpenSeadragon.MouseTracker;
  dragSelect = {
    overlayElement: null as unknown as HTMLDivElement,
    startPos: new OpenSeadragon.Point(0, 0),
    isDragging: false,
    dragMode: DragMode.Select
  };
  isDisplayContextMenu = false;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX = 0;
  rightClickMenuPositionY = 0;
  selectedLines: LineItem[] = [];
  wordMap = new Map<string, Word>();
  linesItemsToAdd = new Array<CreateLineItemInput>();
  

  constructor(private route: ActivatedRoute, private location: Location, private probateRecordService: APIService, private renderer: Renderer2) {
  }

  displayContextMenu(event: any) {

    this.isDisplayContextMenu = true;

    switch (this.selectedLines.length) {
      case 0:
        this.rightClickMenuItems = [
          {
            menuText: 'Create',
            menuEvent: 'create'
          }
        ];
        break;

      case 1:
        this.rightClickMenuItems = [
          {
            menuText: 'Split',
            menuEvent: 'split',
          },
          {
            menuText: 'Extend',
            menuEvent: 'extend',
          },
          {
            menuText: 'Shorten',
            menuEvent: 'shorten',
          },
        ];
        break;
      default:
        this.rightClickMenuItems = [
          {
            menuText: 'Combine',
            menuEvent: 'combine',
          },
        ]
    }
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
      case 'create':
        console.log('To handle create');
        break;
      case 'combine':
        console.log('To handle combine');
        break;
      case 'split':
        console.log('To handle split');
        this.dragSelect.dragMode = DragMode.Split;
        this.dragMode = true;
        this.osd!.setMouseNavEnabled(false);
        this.dragSelect!.isDragging = true;
        let line = this.selectedLines[0];
        let texRect = line.boundingBox!;
        texRect.width /= 2;

        this.osd!.updateOverlay(`boundingBox-${line.id}`, this.texRect2osdRect(texRect));

        // create our second rect
        texRect.left += texRect.width;
        let overlayElement = this.createOverlayElement(`boundingBox-${line.id}-2`, 'select');
        this.osd!.addOverlay(overlayElement, this.texRect2osdRect(texRect));
        break;
      case 'extend':
        console.log('To handle extend');
        this.dragSelect.dragMode = DragMode.Extend;
        this.dragMode = true;
        this.osd!.setMouseNavEnabled(false);
        this.dragSelect!.isDragging = true;
        break;
      case 'shorten':
        console.log('To handle shorten');
        this.dragSelect.dragMode = DragMode.Shorten;
        this.dragMode = true;
        this.osd!.setMouseNavEnabled(false);
        this.dragSelect!.isDragging = true;
        break;
    }

    this.clearSelectionBox();
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
      for (const word of this.record.words) {
        this.wordMap.set(word!.id, word!);
      }

     
      // get our 
      console.log(this.record);
      this.getRecord(id);
    })



  }

  updateLineItemById(id: string, field: string, value: any) {
    let updateLineItemInput: UpdateLineItemInput;
    if (this.updatedLineItemsById.has(id)) {
      updateLineItemInput = this.updatedLineItemsById.get(id)!;
    }
    else {
      updateLineItemInput = {
        id
      }
      this.updatedLineItemsById.set(id, updateLineItemInput);
    }

    switch (field) {
      case "category":
        updateLineItemInput.category = value;
        break;
      case "subcategory":
        updateLineItemInput.subcategory = value;
        break;
      case "line":
        updateLineItemInput.title = value;
        break;
      case "boundingBox":
        updateLineItemInput.boundingBox = {
          left: value.left,
          top: value.top,
          width: value.width,
          height: value.height
        };
        break;
      case "value":
        updateLineItemInput.value = value;
        break;

      case "quantity":
        updateLineItemInput.quantity = value;
        break;
    }


  }

  updateLineItemByIndex(lineIndex: number, field: string, value: any) {
    let id: string;
    if (this.updatedLineItemsByIndex.has(lineIndex)) {
      id = this.updatedLineItemsByIndex.get(lineIndex)!.id;
    }
    else {
      id = this.record!.lineItems!.items[lineIndex]!.id;

    }
    this.updateLineItemById(id, field, value);
  }

  populateSubcategory(lineIndex: number): void {
    const selectObject = document.getElementById("category-" + lineIndex) as HTMLInputElement;
    const category = selectObject?.value;
    let subcategories = this.categoryMap.get(category);
    console.log(subcategories);
    let subcategorySelect = document.getElementById("subcategory-" + lineIndex) as HTMLInputElement;
    while (subcategorySelect?.firstChild) {
      subcategorySelect.removeChild(subcategorySelect.firstChild);
    }
    if (subcategories) {
      for (let i = 0; i < subcategories.length; i++) {
        let optionJSON = subcategories[i];
        console.log(optionJSON);
        let optionElement = document.createElement("option");
        optionElement.setAttribute("value", optionJSON.value);
        let textNode = document.createTextNode(optionJSON.text);
        optionElement.appendChild(textNode);
        subcategorySelect?.appendChild(optionElement);
      }
    }
    this.updateLineItemByIndex(lineIndex, "category", category);
  }

  onSubcategoryChanged(lineIndex: number): void {
    let subcategorySelect = document.getElementById("subcategory-" + lineIndex) as HTMLInputElement;

    // update our object
    if (this.record != undefined) {

      this.updateLineItemByIndex(lineIndex, "subcategory", subcategorySelect.value);
    }
  }

  onTextChanged(lineIndex: number): void {
    const titleElement = document.getElementById("line-" + lineIndex) as HTMLInputElement;
    console.log(titleElement);
    this.updateLineItemByIndex(lineIndex, "line", titleElement.value);
  }

  onValueChanged(lineIndex: number): void {
    const valueElement = document.getElementById("total-value-" + lineIndex) as HTMLInputElement;
    console.log(valueElement);
    this.updateLineItemByIndex(lineIndex, "value", valueElement.value);
  }

  onQuantityChanged(lineIndex: number): void {
    const quantityElement = document.getElementById("quantity-" + lineIndex) as HTMLInputElement;
    console.log(quantityElement);
    this.updateLineItemByIndex(lineIndex, "quantity", quantityElement.value);
  }

  createOverlayElement(id = OVERLAY_ID, className = 'highlight'): HTMLElement {

    let overlay = document.getElementById(id);
    if (overlay) {
      this.osd?.removeOverlay(id);
    }

    overlay = this.renderer.createElement('div');
    this.renderer.setProperty(overlay, 'id', id);
    this.renderer.setProperty(overlay, 'className', className);
    this.renderer.appendChild(document.body, overlay);

    return overlay!;
  }

  calculateAspectRatio() {
    this.imageSize = this.osd!.world.getItemAt(0).getContentSize();

    this.aspectRatio = this.imageSize!.x / this.imageSize!.y;
    console.log(`aspect ratio is ${this.aspectRatio}`);
  }

  highlightText(index: number): void {
    if (this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }
    this.clearSelection();

    console.log(`line ${index} highlighted`);
    const boundingBox = this.record!.lineItems!.items[index]!.boundingBox;
    console.log(boundingBox);
    // check if overlay exists
    const point = new OpenSeadragon.Point(boundingBox?.left, boundingBox?.top);
    const rect = this.texRect2osdRect(boundingBox!);
    this.selectionRect = rect;
    let overlay = this.createOverlayElement();
    this.osd?.addOverlay({ element: overlay!, location: rect });
    this.osd?.viewport.fitBoundsWithConstraints(rect);

  }

  selectRect() {
    this.clearSelection();
    console.log('selecting now');
    this.dragMode = true;
    this.osd!.setMouseNavEnabled(false);
    this.dragSelect!.isDragging = true;
    this.dragSelect!.dragMode = DragMode.Select;
  }

  clearSelectedElems() {
    this.clearSelectionBox();

    let selectionElems = document.querySelectorAll('.highlight');
    selectionElems.forEach(selectedLine => {
      selectedLine.remove();
    });
  }

  clearSelection() {
    this.osd!.clearOverlays();
    this.clearSelectedElems();
    this.selectedLines = [];
  }

  clearSelectionBox() {
    // we do this otherwise the selection overlay will show up
    this.osd!.updateOverlay(OVERLAY_ID, new OpenSeadragon.Rect(0, 0, 0, 0));

    let selectionElem = document.getElementById(OVERLAY_ID);
    if (selectionElem) {
      // selectionElem.remove();
      selectionElem.parentElement?.removeChild(selectionElem);
      console.log('selection box removed');
    }

    this.osd!.removeOverlay(OVERLAY_ID);

  }

  rectanglesIntersect(minAx: number, minAy: number, maxAx: number, maxAy: number,
    minBx: number, minBy: number, maxBx: number, maxBy: number): boolean {
    return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy;
  }

  texRectangleContainsTexRectangle(a: Rect, b: Rect) {
    return a.left <= b.left && a.top <= b.top && a.left + a.width >= b.left + b.width && a.top + a.height >= b.top + b.height;
  }

  texRect2osdRect(rect: Rect): OpenSeadragon.Rect {
    if (this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }
    return new OpenSeadragon.Rect(rect.left, rect.top / this.aspectRatio, rect.width, rect.height / this.aspectRatio);
  }

  osdRect2texRect(rect: OpenSeadragon.Rect): Rect {
    if (this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }
    return {
      __typename: 'Rect',
      left: rect.x,
      top: rect.y * this.aspectRatio,
      width: rect.width,
      height: rect.height * this.aspectRatio
    };
  }

  // A line
  // B selection rect
  verticallyOverlapped(minAy: number, maxAy: number, minBy: number, maxBy: number) {
    const threshold = 0.6;
    let heightA = maxAy - minAy;
    let allowedAmount = (1.0 - threshold) * heightA;
    let isOverlapped = false;
    if (minBy <= minAy) {
      isOverlapped = maxBy > minAy && maxAy - maxBy < allowedAmount;
    }
    else {
      isOverlapped = minBy < maxAy && maxBy < maxAy || minBy - minAy < allowedAmount;
    }

    return isOverlapped;
  }


  getSelectedLines(selectRect: OpenSeadragon.Rect): LineItem[] {
    if (this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }

    let lines = new Array<LineItem>();
    for (const line of this.record!.lineItems!.items) {
      const boundingBox = line!.boundingBox;
      // const lineRect = new OpenSeadragon.Rect(boundingBox?.left, boundingBox?.top, boundingBox?.width, boundingBox?.height);
      // lineRect.y /= this.aspectRatio;
      // lineRect.height /= this.aspectRatio;
      const lineRect = this.texRect2osdRect(boundingBox!);
      if (line && this.rectanglesIntersect(lineRect.x, lineRect.y,
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
        if (!this.dragMode) {
          return;
        }

        var viewportPos = this.osd!.viewport.pointFromPixel(event.position);
        this.dragSelect!.startPos = viewportPos;

        let overlayElement: HTMLElement;
        let line: LineItem;
        let texRect: Rect;
        let osdRect: OpenSeadragon.Rect;

        switch (this.dragSelect.dragMode) {
          case DragMode.Select:
            console.log('adding selection overlay');
            overlayElement = this.createOverlayElement()
            this.dragSelect.overlayElement = overlayElement as HTMLDivElement;

            this.osd!.addOverlay(overlayElement, new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0));
            break;
          case DragMode.Split:
            console.log('splitting overlay');

            break;
        }




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

        let location: OpenSeadragon.Rect;
        let line: LineItem;

        switch (this.dragSelect.dragMode) {
          case DragMode.Select:
            location = new OpenSeadragon.Rect(
              Math.min(this.dragSelect!.startPos.x, this.dragSelect!.startPos.x + diffX),
              Math.min(this.dragSelect!.startPos.y, this.dragSelect!.startPos.y + diffY),
              Math.abs(diffX),
              Math.abs(diffY)
            );
            
            // console.log(lines);
            this.osd!.updateOverlay(this.dragSelect!.overlayElement!, location);
            break;
          case DragMode.Shorten:
            line = this.selectedLines[0];
            location = this.texRect2osdRect(line.boundingBox!);
            if (diffX > 0) {
              location.x += diffX;
            }
            location.width -= Math.abs(diffX);
            this.osd!.updateOverlay(`boundingBox-${line.id}`, location);
            break;
          case DragMode.Extend:
            line = this.selectedLines[0];
            location = this.texRect2osdRect(line.boundingBox!);
            if (diffX < 0) {
              location.x += diffX;
            }
            location.width += Math.abs(diffX);
            this.osd!.updateOverlay(`boundingBox-${line.id}`, location);
            break;
          case DragMode.Split:
            line = this.selectedLines[0];
            let boundingBox1Id = `boundingBox-${line.id}`;
            let boundingBox2Id = `boundingBox-${line.id}-2`;
            location = this.osd!.getOverlayById(boundingBox1Id).getBounds(this.osd!.viewport);
            let location2 = this.osd!.getOverlayById(boundingBox2Id).getBounds(this.osd!.viewport);
            location.width += diffX;
            location2.width -= diffX;
            location2.x += diffX;
            this.osd!.updateOverlay(boundingBox1Id, location);
            this.osd!.updateOverlay(boundingBox2Id, location2);
            this.dragSelect!.startPos.x = viewportPos.x;
            this.dragSelect!.startPos.y = viewportPos.y;
            break;

        }
      },
      releaseHandler: (event) => {
        var viewportPos = this.osd!.viewport.pointFromPixel((event as unknown as OpenSeadragon.CanvasDragEvent).position);
        var diffX = viewportPos.x - this.dragSelect!.startPos.x;
        var diffY = viewportPos.y - this.dragSelect!.startPos.y;
        let location = new OpenSeadragon.Rect(
          Math.min(this.dragSelect!.startPos.x, this.dragSelect!.startPos.x + diffX),
          Math.min(this.dragSelect!.startPos.y, this.dragSelect!.startPos.y + diffY),
          Math.abs(diffX),
          Math.abs(diffY)
        );        
        
        // highlight selected lines
        switch (this.dragSelect.dragMode) {
          case DragMode.Select:
            this.selectedLines = this.getSelectedLines(location);
            for (const line of this.selectedLines) {
              const selectElem = this.createOverlayElement(`boundingBox-${line.id}`, 'select');
              this.osd!.addOverlay(selectElem, this.texRect2osdRect(line.boundingBox!));
            }

            if (this.selectedLines.length > 0) {
              this.clearSelectionBox();
            }
            break;
          case DragMode.Shorten:
          case DragMode.Extend:
            // update bounding box
            let line = this.selectedLines[0];
            let selectedLineOverlay = this.osd!.getOverlayById(`boundingBox-${line.id}`);
            line.boundingBox = this.osdRect2texRect(selectedLineOverlay.getBounds(this.osd!.viewport));
            this.updateLineItemById(line.id, 'boundingBox', line.boundingBox);
            console.log('bounding box updated');
            break;
          case DragMode.Split:
            let lineToSplit = this.selectedLines[0];
            let selectedSplitLineOverlay = this.osd!.getOverlayById(`boundingBox-${lineToSplit.id}`);
            // update our first bounding box
            lineToSplit.boundingBox = this.osdRect2texRect(selectedSplitLineOverlay.getBounds(this.osd!.viewport));
            this.updateLineItemById(lineToSplit.id, 'boundingBox', lineToSplit.boundingBox);
            let wordIdsToKeep = [];
            let wordIdsToRemove = []
            let textToAdd = '';

            for (const id of lineToSplit.wordIds) {
              const word = this.wordMap.get(id!);
              if (this.texRectangleContainsTexRectangle(lineToSplit.boundingBox, word!.boundingBox!)) {
                wordIdsToKeep.push(word!.id);
              }
              else {
                textToAdd += `${word!.text} `;
                wordIdsToRemove.push(word!.id);
              }
            }
            lineToSplit.wordIds = wordIdsToKeep;


            // update our second bounding box
            let newLineOverlay = this.osd!.getOverlayById(`boundingBox-${lineToSplit.id}-2`);
            textToAdd = textToAdd.trim();
            let newBoundingBox = this.osdRect2texRect(newLineOverlay.getBounds(this.osd!.viewport));


            let newLineItem = {
              id: uuidv4() as string,
              probateId: lineToSplit.probateId,
              description: lineToSplit.description,
              title: textToAdd,
              category: lineToSplit.category,
              subcategory: lineToSplit.subcategory,
              value: lineToSplit.value,
              quantity: lineToSplit.quantity,
              attributeForId: lineToSplit.attributeForId,
              wordIds: wordIdsToRemove,
              boundingBox: {
                left: newBoundingBox.left,
                top: newBoundingBox.top,
                width: newBoundingBox.width,
                height: newBoundingBox.height
              }
            }
            this.linesItemsToAdd.push(newLineItem);

            this.record?.lineItems?.items.push({ ...newLineItem, __typename: 'LineItem', boundingBox: newBoundingBox, createdAt: lineToSplit.createdAt, updatedAt: lineToSplit.updatedAt });
            break;
        }

        console.log('release handler called');
        this.dragSelect!.isDragging = false;
        this.dragMode = false;
        this.osd!.setMouseNavEnabled(true);
      }
    });
    console.log('records received');
  }

  async updateLineItems() {
    console.log('updating line items');
    console.log(this.updatedLineItemsByIndex);
    for (const lineItem of Array.from(this.updatedLineItemsById.values())) {
      console.log(lineItem);
      let response = await this.probateRecordService.UpdateLineItem(lineItem);
      console.log(response);
    }
  }

  async updateRecord(isReviewed = false) {
    let reviewCount = this.record!.reviewCount;
    if (isReviewed) {
      reviewCount++;
    }

    // create a new line items
    for (const newLineItem of this.linesItemsToAdd) {
      let lineResponse = await this.probateRecordService.CreateLineItem(newLineItem);
      console.log('new line item created');
      console.log(lineResponse);
    }
    this.linesItemsToAdd = [];

    let item = { id: this.record!.id, reviewCount };
    console.log(item);
    let input: UpdateProbateRecordInput = item;
    console.log(input);
    let response = await this.probateRecordService.UpdateProbateRecord(input as unknown as UpdateProbateRecordInput);
    console.log('response');
    console.log(response);
    await this.updateLineItems();
    this.updatedLineItemsByIndex.clear();
    alert('record updated');
  }

  public loadScript(url: string): void {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

}
