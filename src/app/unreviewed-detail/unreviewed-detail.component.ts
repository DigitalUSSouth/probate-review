import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
  ViewChildren,
  QueryList
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import OpenSeadragon from 'openseadragon';
import {
  ProbateRecord,
  UpdateLineItemInput,
  APIService,
  UpdateProbateRecordInput,
  LineItem,
  Word,
  WordInput,
  Rect,
  CreateLineItemInput,
} from '../API.service';
import data from '../categories.json';
import { from } from 'rxjs';
import { ContextMenuModel } from '../interfaces/context-menu-model';
import { v4 as uuidv4 } from 'uuid';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { BoundingBox } from '../quad-tree';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { deleteLine } from 'src/graphql/mutations';
import { MatButton } from '@angular/material/button';

interface SubcategoryOptionValue {
  value: string;
  text: string;
}

interface Command {
  type: CommandType;
  wasDirtyBeforeCommand: boolean;
}

interface BulkLineItemCommand extends Command {
  lineItems: LineItem[];
  wordMap: Map<string, Word[]>;
  lineItemIndexMap: Map<string, number>;
  operation: OperationType;
}

interface LineItemCommand extends Command {
  lineItem: LineItem;
  words: Word[];
  operation: OperationType;
}

interface WordCommand extends Command {
  word: Word;
  lineItemId: string;
  operation: OperationType;
}

interface DragSelect {
  overlayElement: HTMLElement;
  startPos: OpenSeadragon.Point;
  isDragging: boolean;
  selectionMode: SelectionMode;
  editMode: EditMode;
}

enum DragMode {
  None,
  Select,
  Extend,
  Shorten,
  Expand,
  Split,
}


enum SelectionMode {
  None,
  Line,
  Word,
}

enum EditMode {
  None,
  Line,
  Word,
  AdjustWord,
}

enum CommandType {
  BulkDelete,
  DeleteLine,
  DeleteWord,
  CreateWord,
  CreateLine,
  AdjustBounds,
  Unknown
}

enum OperationType {
  Create,
  Delete,
  Unknown
}

const InputBoxHeight = 20;

@Component({
  selector: 'app-unreviewed-detail',
  templateUrl: './unreviewed-detail.component.html',
  styleUrls: ['./unreviewed-detail.component.sass']
})
export class UnreviewedDetailComponent implements OnInit {
  @Input() record?: ProbateRecord;
  @ViewChild('viewer') viewer!: ElementRef;
  @ViewChild('table') table!: MatTable<LineItem>;
  @ViewChildren('checkbox') checkBoxes?: QueryList<MatCheckbox>;
  
  // Image
  osd?: OpenSeadragon.Viewer;
  selectTracker?: OpenSeadragon.MouseTracker;
  imageSize?: OpenSeadragon.Point;
  aspectRatio = 0.0;
  isNavigatorVisible = false;
  dragSelect = {
    overlayElement: null as unknown as HTMLDivElement,
    startPos: new OpenSeadragon.Point(0, 0),
    isDragging: false,
    dragMode: DragMode.Select,
    selectionMode: SelectionMode.None,
    editMode: EditMode.None,
  };

  // Data table
  displayedColumns: string[] = ['checked', 'title'];

  // Context Menu
  isDisplayContextMenu = false;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX = 0;
  rightClickMenuPositionY = 0;

  // Data  
  isLineChecked = false;
  isDirty = false;
  isReviewed = false;
  
  wordMap = new Map<string, Word>();

  // Deleted data
  deletedLines: LineItem[] = [];
  deletedLineWordsMap = new Map<string, Word[]>();

  // Categories
  categoryMap: Map<string, Array<SubcategoryOptionValue>> =
    this.objToStrMap(data);

  // Commands
  commands: Array<BulkLineItemCommand | LineItemCommand | WordCommand>  = [];

  // Lines, Words
  selectedLine: LineItem | null = null;
  selectedWord: Word | null = null;
  selectedLines: LineItem[] = [];

  // UI mode
  

  constructor(
    private route: ActivatedRoute,
    private probateRecordService: APIService,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  recordsChecked(): number {
    return this.checkBoxes ? (this.checkBoxes as QueryList<MatCheckbox>).filter((c: MatCheckbox) => c.checked == true).length : 0;
  }

  checkRow() {
    this.isLineChecked = this.recordsChecked() > 0;
  }

  checkedCheckBoxesFilterFunction(checkBox: MatCheckbox): boolean {
    return checkBox.checked;
  }

  isSelecting() {
    return this.dragSelect.dragMode === DragMode.Select;
  } 

  toggleAllChecks(event: MatCheckboxChange): void {
    if (this.checkBoxes) {
      for (const checkBox of this.checkBoxes) {
        checkBox.checked = event.checked;
      }
      this.isLineChecked = event.checked;
    }
  }

  toggleNav() {
    if (this.isNavigatorVisible)
      this.osd!.navigator.element.style.display = "none";
    else
      this.osd!.navigator.element.style.display = "inline-block";
    this.isNavigatorVisible = !this.isNavigatorVisible;
  }

  showNav() {
    this.osd!.navigator.element.style.display = "inline-block";
    this.isNavigatorVisible = true;
  }

  hideNav() {
    this.osd!.navigator.element.style.display = "none";
    this.isNavigatorVisible = false;
  }

  enterEditMode() {
    this.showNav();
    this.osd!.setControlsEnabled(true);
    let toolbarElem = document.getElementById('toolbarDiv');
    if (toolbarElem) {
      toolbarElem.style.display = "inline-block";
    }
    this.osd!.setMouseNavEnabled(false);
  }

  saveEdit() {
    this.exitEditMode();
  }

  cancelEdit() {
    this.exitEditMode();
  }

  exitEditMode() {
    this.hideNav();
    let toolbarElem = document.getElementById('toolbarDiv');
    if (toolbarElem) {
      toolbarElem.style.display = "none";
    }
    this.dragSelect.dragMode = DragMode.None;
    this.dragSelect.isDragging = false;    
    this.resetView();
  }

  enterSelectionMode() {    
    this.exitEditMode();
    this.osd!.setMouseNavEnabled(false);
    this.dragSelect.dragMode = DragMode.Select;
    this.dragSelect.selectionMode = SelectionMode.Line;
    this.dragSelect.editMode = EditMode.None;
  }

  exitSelectionMode() {    
    this.dragSelect.dragMode = DragMode.None;
    this.dragSelect.selectionMode = SelectionMode.None;
    this.dragSelect.isDragging = false;    
    this.resetView();
  }

  toggleSelectionMode() {
    if(this.isSelecting()) {
      this.exitSelectionMode();
    }
    else {
      this.enterSelectionMode();  
    }
  }

  ngAfterViewInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    let record$ = from(this.probateRecordService.GetProbateRecord(id));
    let lineItems$ = from(
      this.probateRecordService.LineItemByProbateRecord(
        id,
        undefined,
        undefined,
        1000
      )
    );

    record$.subscribe((record) => {
      console.log(record);
      this.record = record as ProbateRecord;
      for (const word of this.record.words) {
        if (word) {
          this.wordMap.set(word.id, word);
        }
      }

      lineItems$.subscribe((lineItems) => {
        this.record!.lineItems!.items =
          lineItems.items as unknown as LineItem[];
        this.sortLineItems();
      });

      // get our associated image     
      this.getImage(id);
    });
  }

  getRelativeMousePosition = function (event: PointerEvent, target: HTMLElement | null | undefined = undefined) {
    let pointTarget = target || event.target;
    let rect = (pointTarget! as HTMLElement).getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  async getImage(id: string): Promise<void> {
    console.log('getting records');

    const infoUrl = `https://d2ai2qpooo3jtj.cloudfront.net/iiif/2/${id}/info.json`;

    let options = {
      element: this.viewer.nativeElement,
      showRotationControl: true,
      // Enable touch rotation on tactile devices
      gestureSettingsTouch: {
        pinchToZoom: true,
      },
      autoHideControls: false,
      showNavigator: true,
      navigatorAutoFade: false,
      maxZoomLevel: 5.0,
      prefixUrl: '//openseadragon.github.io/openseadragon/images/',
      tileSources: infoUrl,
    };


    this.osd = new OpenSeadragon.Viewer(options);
    this.osd.addControl("toolbarDiv", { anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT, autoFade: false });    
    this.exitEditMode();    
    this.selectTracker = new OpenSeadragon.MouseTracker({
      element: this.osd?.element as Element,
      clickHandler: (event) => {
        var target = (event as any).originalTarget as HTMLElement;
        console.log('click handler fired');
        console.log(event);
        if (target!.matches('input')) {
          this.dragSelect.selectionMode = SelectionMode.None;
          console.log('focus on ');
          console.log(target);
          target.style.display = 'block';
          target.focus();
          this.osd!.setMouseNavEnabled(false);
        }
        else if(target!.matches('button') || target!.matches('span.mat-button-wrapper')) {
          target.click();
        }
      },
      pressHandler: (event) => {
        let pos = this.getRelativeMousePosition(event.originalEvent as PointerEvent, this.osd!.canvas);        
        let viewportPos = this.osd!.viewport.viewerElementToViewportCoordinates(new OpenSeadragon.Point(pos.x, pos.y));
        
        // check if we are in edit mode

        this.dragSelect!.startPos = viewportPos;
        
        let overlayElement: HTMLElement;
        let line: LineItem;
        let texRect: Rect;
        let osdRect: OpenSeadragon.Rect;

        
        this.dragSelect.isDragging = true;
        
        overlayElement = this.createOverlayElement('select');
        this.dragSelect.overlayElement = overlayElement as HTMLDivElement;
        if(this.dragSelect.editMode === EditMode.Line) {
          let selectedLineBoundingBox = this.osd!.getOverlayById(
            `boundingBox-${this.selectedLines[0].id}`
          ).getBounds(this.osd!.viewport);
          if (
            !this.osdRectangleContainsOsdPoint(
              selectedLineBoundingBox,
              viewportPos
            )
          ) {
            return;
          }
          else {
            console.log('press in bounding box');
          } 
        }

        this.osd!.addOverlay(
          overlayElement,
          new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0)
        );
        
      },
      dragHandler: (event) => {
        let pos = this.getRelativeMousePosition(event.originalEvent as PointerEvent, this.osd!.canvas);
        let viewportPos = this.osd!.viewport.viewerElementToViewportCoordinates(new OpenSeadragon.Point(pos.x, pos.y));
        // console.log(viewportPos);
        var diffX = viewportPos.x - this.dragSelect!.startPos.x;
        var diffY = viewportPos.y - this.dragSelect!.startPos.y;

        let location: OpenSeadragon.Rect;
        let line: LineItem;

        switch (this.dragSelect.dragMode) {
          case DragMode.Select:
            location = new OpenSeadragon.Rect(
              Math.min(
                this.dragSelect!.startPos.x,
                this.dragSelect!.startPos.x + diffX
              ),
              Math.min(
                this.dragSelect!.startPos.y,
                this.dragSelect!.startPos.y + diffY
              ),
              Math.abs(diffX),
              Math.abs(diffY)
            );
            
            if (this.dragSelect.editMode === EditMode.Line) {
              // do not allow user to select word bounds outside line item bounds
              let selectedLineBoundingBox = this.osd!.getOverlayById(
                `boundingBox-${this.selectedLines[0].id}`
              ).getBounds(this.osd!.viewport);
              if (
                !this.osdRectangleContainsOsdRectangle(
                  selectedLineBoundingBox,
                  location
                )
              ) {
                break;
              }
              else {
                console.log('drag inside of bounding box');
              }
            }
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
          case DragMode.Expand:
            line = this.selectedLines[0];
            location = this.texRect2osdRect(line.boundingBox!);
            if (diffX < 0) {
              location.x += diffX;
            }
            location.width += Math.abs(diffX);
            if (diffY < 0) {
              location.y += diffY;
            }
            location.height += Math.abs(diffY);
            this.osd!.updateOverlay(`boundingBox-${line.id}`, location);
            break;
          case DragMode.Split:
            line = this.selectedLines[0];
            let boundingBox1Id = `boundingBox-${line.id}`;
            let boundingBox2Id = `boundingBox-${line.id}-2`;
            location = this.osd!.getOverlayById(boundingBox1Id).getBounds(
              this.osd!.viewport
            );
            let location2 = this.osd!.getOverlayById(boundingBox2Id).getBounds(
              this.osd!.viewport
            );
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
        var viewportPos = this.osd!.viewport.pointFromPixel(
          (event as unknown as OpenSeadragon.CanvasDragEvent).position
        );
        var diffX = viewportPos.x - this.dragSelect!.startPos.x;
        var diffY = viewportPos.y - this.dragSelect!.startPos.y;
        let location = new OpenSeadragon.Rect(
          Math.min(
            this.dragSelect!.startPos.x,
            this.dragSelect!.startPos.x + diffX
          ),
          Math.min(
            this.dragSelect!.startPos.y,
            this.dragSelect!.startPos.y + diffY
          ),
          Math.abs(diffX),
          Math.abs(diffY)
        );

       
      },
    });
  }

  sortLineItems(): void {
    if (this.record?.lineItems?.items) {
      let items: Array<LineItem> = Array.from(
        this.record.lineItems.items as LineItem[]
      );
      let sortedLineItems = items.sort(
        (a, b) => a!.boundingBox!.top - b!.boundingBox!.top
      );
      this.record.lineItems.items = sortedLineItems;
    }
  }

  displayContextMenu(event: any): void {
    this.isDisplayContextMenu = true;
    console.log(event);
    switch (this.selectedLines.length) {
      case 0:
        this.rightClickMenuItems = [
          {
            menuText: 'Create',
            menuEvent: 'create',
          },
        ];
        break;

      case 1:
        if (event.target.id.startsWith('wordInput-')) {
          let inputElem = document.getElementById(
            event.target.id
          ) as HTMLInputElement;
          if (inputElem === document.activeElement) {
            this.rightClickMenuItems = [
              {
                menuText: 'Delete Word',
                menuEvent: 'delete word',
              },
              {
                menuText: 'Adjust Box',
                menuEvent: 'adjust word box',
              },
            ];
          }
        } else {
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
            {
              menuText: 'Expand',
              menuEvent: 'expand',
            },
            {
              menuText: 'Correct Text',
              menuEvent: 'correct',
            },
            {
              menuText: 'Delete Line',
              menuEvent: 'delete line',
            },
          ];
        }
        break;
      default:
        this.rightClickMenuItems = [
          {
            menuText: 'Combine',
            menuEvent: 'combine',
          },
        ];
    }
    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;
    event.preventDefault();
    event.stopPropagation();
  }

  objToStrMap(obj: any) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      let props = Object.getOwnPropertyNames(obj[k]);
      strMap.set(props[0], obj[k][props[0]]);
    }
    return strMap;
  }

  populateSubcategory(lineIndex: number): void {
    const selectObject = document.getElementById(
      'category-' + lineIndex
    ) as HTMLInputElement;
    const category = selectObject?.value;
    let subcategories = this.categoryMap.get(category);
    console.log(subcategories);
    let subcategorySelect = document.getElementById(
      'subcategory-' + lineIndex
    ) as HTMLInputElement;
    while (subcategorySelect?.firstChild) {
      subcategorySelect.removeChild(subcategorySelect.firstChild);
    }
    if (subcategories) {
      for (let i = 0; i < subcategories.length; i++) {
        let optionJSON = subcategories[i];
        console.log(optionJSON);
        let optionElement = document.createElement('option');
        optionElement.setAttribute('value', optionJSON.value);
        let textNode = document.createTextNode(optionJSON.text);
        optionElement.appendChild(textNode);
        subcategorySelect?.appendChild(optionElement);
      }
    }
    // this.updateLineItemByIndex(lineIndex, 'category', category);
  }

  getWordsOfLine(line: LineItem): Word[] {
    return (this.record!.words as Word[]).filter((w) =>
      line.wordIds.includes(w!.id)
    );
  }

  getRowsOfText(words: Word[]): Array<Array<Word>> {
    const rows = new Array<Array<Word>>();
    if (!words || words.length == 0) {
      return rows;
    }

    // get average word height
    const totalHeight = words
      .map((w) => w.boundingBox!.height)
      .reduce((previousValue, currentValue) => previousValue + currentValue);

    const avgHeight = totalHeight / words.length;

    let currentRow = 0;
    let copyOfWords = [...words];
    while (copyOfWords.length > 0) {
      const topMostWord = copyOfWords.reduce((p, c) => {
        return c.boundingBox!.top < p.boundingBox!.top ? c : p;
      });
      const currentTop = topMostWord.boundingBox!.top;
      let rowOfWords = copyOfWords.filter(
        (w) => w.boundingBox!.top < currentTop + avgHeight / 2
      );
      rowOfWords.sort(
        (a, b) =>
          a.boundingBox!.left +
          a.boundingBox!.width -
          (b.boundingBox!.left + b.boundingBox!.width)
      );
      rows[currentRow++] = [...rowOfWords];
      // filter out words just added to row
      copyOfWords = copyOfWords.filter(
        (w) => !rowOfWords.map((w) => w.id).includes(w.id)
      );
    }

    return rows;
  }

  createInputForWord(word: Word): HTMLInputElement {
    let inputElem = this.renderer.createElement('input');
    const inputId = `wordInput-${word.id}`;
    this.renderer.setProperty(inputElem, 'id', inputId);
    this.renderer.setAttribute(inputElem, 'value', word.text);
    this.renderer.listen(inputElem, 'input', () => {
      word.text = (inputElem! as HTMLInputElement).value;
      // if (!this.updatedWordsById.has(word.id)) {
      //   this.updatedWordsById.set(word.id, {
      //     id: word.id,
      //     text: word.text,
      //     boundingBox: {
      //       left: word.boundingBox!.left,
      //       top: word.boundingBox!.top,
      //       width: word.boundingBox!.width,
      //       height: word.boundingBox!.height,
      //     },
      //     // confidence: word.confidence,
      //     // lowerText: word.lowerText
      //   });
      // }
    });

    this.renderer.listen(inputElem, 'keyup.enter', () => {
      console.log('keyup handler called');
      // if we don't have a value
      console.log(inputElem);
      let value = console.log((inputElem as HTMLInputElement).value);
      console.log(value);
      // if (!inputElem.value) {
      //   this.callDeleteWord(word);
      // } else {
      //   this.updateLineItemText(this.selectedLines[0]);
      //   this.correctText();
      // }
    });

    this.renderer.listen(inputElem, 'focus', () => {
      // this.activeWord = word;
    });

    this.renderer.appendChild(document.body, inputElem);
    return inputElem;
  }

  showInputsForWords(words: Word[]): void {
    const isInputAbove = words[0].boundingBox!.top > 0.5;

    // calculate height of input element
    const osdAnyWordRect = this.texRect2osdRect(words[0].boundingBox!);
    const pixel = this.osd!.viewport.pixelFromPoint(
      new OpenSeadragon.Point(osdAnyWordRect.x, osdAnyWordRect.y)
    );
    pixel.y -= InputBoxHeight; // give input box height of 20 pixels
    const osdInputPoint = this.osd!.viewport.pointFromPixel(pixel);
    let inputHeight = osdAnyWordRect.y - osdInputPoint.y;

    const rows = this.getRowsOfText(words);
    let top: number;

    for (const row of rows) {
      if (isInputAbove) {
        const topMostWord = row.reduce((p, c) => {
          return c.boundingBox!.top < p.boundingBox!.top ? c : p;
        });
        top = topMostWord.boundingBox!.top;
      } else {
        const tallest = words.reduce((p, c) =>
          c.boundingBox!.height > p.boundingBox!.height ? c : p
        );
        const lowestWord = row.reduce((p, c) =>
          c.boundingBox!.top > p.boundingBox!.top ? c : p
        );

        top = lowestWord.boundingBox!.top + tallest.boundingBox!.height;
      }
      top /= this.aspectRatio;

      for (const word of row) {
        const selectElem = this.createOverlayElement(
          `wordBoundingBox-${word.id}`,
          'word-select'
        );
        const rect = this.texRect2osdRect(word.boundingBox!);
        console.log('word rect');
        console.log(rect);

        this.osd!.addOverlay(selectElem, rect);

        // check if the element exists
        const inputId = `wordInput-${word.id}`;

        let inputElem = document.getElementById(inputId);
        if (!inputElem) {
          inputElem = this.createInputForWord(word);
        }

        rect.y = top;
        if (isInputAbove) {
          rect.y -= inputHeight;
        }
        rect.height = inputHeight;
        console.log('input rect');
        console.log(rect);
        this.osd!.addOverlay(inputElem!, rect);
      }
    }
  }

  correctText(): void {
    let words = this.getWordsOfLine(this.selectedLines[0]);
    console.log(words);
    if (words.length > 0) {
      this.showInputsForWords(words);
    }

    this.osd!.setMouseNavEnabled(false);
  }

  editLineItemByIndex(index: number): void {
    let lineItem = null;
    if (this.record && this.record.lineItems) {
      lineItem = this.record.lineItems.items[index];
    }

    if (!lineItem) {
      throw 'Invalid line index';
    }

    this.selectedLine = lineItem;
    this.selectedLines = [];
    this.selectedLines.push(lineItem);

    this.dragSelect.dragMode = DragMode.Select;
    this.dragSelect.selectionMode = SelectionMode.Word;
    this.dragSelect.editMode = EditMode.Line;

    this.highlightLine(lineItem);
    this.correctText();
    this.enterEditMode();
  }

  highlightLineItemByIndex(index: number): void {
    const line = this.record!.lineItems!.items[index] as LineItem;
    this.highlightLine(line);
  }

  deleteLineItemByIndex(index: number): void { }

  calculateAspectRatio() {
    this.imageSize = this.osd!.world.getItemAt(0).getContentSize();

    this.aspectRatio = this.imageSize!.x / this.imageSize!.y;
    console.log(`aspect ratio is ${this.aspectRatio}`);
  }

  clearSelection() {
    this.osd!.clearOverlays();
    this.osd!.setMouseNavEnabled(true);
    this.selectedLines = [];
  }

  createOverlayElement(id: string, className = 'highlighted-line'): HTMLElement {
    let overlay = document.getElementById(id);
    if (overlay) {
      this.osd?.removeOverlay(id);
      overlay.remove();
    }

    overlay = this.renderer.createElement('div');
    this.renderer.setProperty(overlay, 'id', id);
    this.renderer.setProperty(overlay, 'className', className);
    this.renderer.appendChild(document.body, overlay);

    return overlay!;
  }

  highlightLine(line: LineItem): void {
    if (this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }
    this.clearSelection();

    const boundingBox = line!.boundingBox;
    const rect = this.texRect2osdRect(boundingBox!);

    this.osd!.clearOverlays();
    const selectElem = this.createOverlayElement(
      `boundingBox-${line.id}`,
      'highlighted-line'
    );
    this.osd!.addOverlay(selectElem, this.texRect2osdRect(line.boundingBox!));
    this.selectedLines = [];
    this.selectedLines.push(line);
    this.osd?.viewport.fitBoundsWithConstraints(rect);
  }

  resetView() {
    this.osd!.viewport.goHome();
    this.osd!.clearOverlays();
    this.osd!.setControlsEnabled(false);
    this.osd!.setMouseNavEnabled(true);
  }


  onSubcategoryChanged(lineIndex: number): void { }

  drop(event: CdkDragDrop<LineItem[]>) {
    moveItemInArray(this.record!.lineItems!.items, event.previousIndex, event.currentIndex);
    this.isDirty = true;
    this.table.renderRows();
  }

  texRect2osdRect(rect: Rect): OpenSeadragon.Rect {
    if (this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }
    return new OpenSeadragon.Rect(
      rect.left,
      rect.top / this.aspectRatio,
      rect.width,
      rect.height / this.aspectRatio
    );
  }

  osdRectangleContainsOsdRectangle(
    a: OpenSeadragon.Rect,
    b: OpenSeadragon.Rect
  ) {
    return (
      a.x <= b.x &&
      a.y <= b.y &&
      a.x + a.width >= b.x + b.width &&
      a.y + a.height >= b.y + b.height
    );
  }

  osdRectangleContainsOsdPoint(
    a: OpenSeadragon.Rect,
    b: OpenSeadragon.Point
  ) {
    return (
      a.x <= b.x &&
      a.y <= b.y &&
      a.x + a.width >= b.x &&
      a.y + a.height >= b.y
    );
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
      height: rect.height * this.aspectRatio,
    };
  }

  osdRect2BoundingBox(rect: OpenSeadragon.Rect): BoundingBox {
    if (this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }
    return new BoundingBox(
      rect.x,
      rect.y * this.aspectRatio,
      rect.width,
      rect.height * this.aspectRatio
    );
  }

  texRect2BoundingBox(rect: Rect): BoundingBox {
    return new BoundingBox(rect.left, rect.top, rect.width, rect.height);
  }

  openDialog(): string {
    let dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      height: '400px',
      width: '600px',
    });

    let confirmation = "";
    dialogRef.afterClosed().subscribe(result => {
      confirmation = result;
    });

    return confirmation;
  }


  deleteLine(lineItem: LineItem) {
    this.isDirty = true;
    this.deletedLines.push(lineItem);
    let wordsToDelete = (this.record!.words as Word[]).filter(w => lineItem.wordIds.includes(w.id));
    this.deletedLineWordsMap.set(lineItem.id, wordsToDelete);
    this.record!.words = (this.record!.words as Word[]).filter(w => !lineItem.wordIds.includes(w.id));

  }

  // Commands
  undo() {
    if(this.commands.length > 0) {
      let command = this.commands.pop();
      switch(command!.type) {
        case CommandType.BulkDelete: {
          let bulkCommand = command as BulkLineItemCommand;
          for(const lineItem of bulkCommand.lineItems) {
            let index = bulkCommand.lineItemIndexMap.get(lineItem.id);            
            this.record!.lineItems!.items.splice(index!, 0, lineItem);
            this.record!.words = this.record!.words.concat(bulkCommand.wordMap.get(lineItem.id) as Word[]);
          }
        }
      }
      this.isDirty = command?.wasDirtyBeforeCommand!;
      this.table.renderRows();
    }
  }

  bulkDeleteLines(lineItemsToDelete: LineItem[]) {
    let lineItems: LineItem[] = [];
    let wordMap = new Map<string, Word[]>();
    let wordIds = new Array<string>();
    let lineItemIndexMap = new Map<string, number>();

    for(const lineItem of lineItemsToDelete) {
      lineItems.push({...lineItem});
      let words = (this.record!.words as Word[]).filter(w => lineItem.wordIds.includes(w.id));
      wordMap.set(lineItem.id, words);
      wordIds = wordIds.concat(words.map(w => w.id));
      const index = this.record!.lineItems!.items.indexOf(lineItem);
      lineItemIndexMap.set(lineItem.id, index);
    }
    this.commands.push({type: CommandType.BulkDelete, operation: OperationType.Delete, wasDirtyBeforeCommand: this.isDirty, lineItems, wordMap, lineItemIndexMap});
    
    // Remove LineItems and Words
    let lineIds = lineItemsToDelete.map(l => l.id);
    this.record!.lineItems!.items = (this.record!.lineItems!.items as LineItem[]).filter(l => !lineIds.includes(l.id));
    this.record!.words = (this.record!.words as Word[]).filter(w => !wordIds.includes(w.id));
    
    this.isDirty = true;
  }

  deleteCheckedLines() {
    let dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      height: '260px',
      width: '400px',
    });
    
    dialogRef.afterClosed().subscribe(result => {      
      if (result === "delete") {
        let lineIds: string[] = [];
        // get checked checkboxes
        let checkedBoxes = (this.checkBoxes as QueryList<MatCheckbox>).filter((c: MatCheckbox) => c.checked == true);
        for (const checkedBox of checkedBoxes) {
          let lineId = checkedBox.id.substring("check-".length);
          lineIds.push(lineId);          
        }

        let linesToDelete = (this.record!.lineItems!.items as LineItem[]).filter(l => lineIds.includes(l.id));
        this.bulkDeleteLines(linesToDelete);

        this.isLineChecked = false;
      }
    });
  }

}
