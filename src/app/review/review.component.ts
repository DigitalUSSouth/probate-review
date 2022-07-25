import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import OpenSeadragon, { pointInElement } from 'openseadragon';
import data from './categories.json';
import {
  ProbateRecord,
  UpdateLineItemInput,
  APIService,
  GetProbateRecordQuery,
  UpdateProbateRecordInput,
  LineItem,
  LineItemByProbateRecordQuery,
  Word,
  WordInput,
  Rect,
  CreateLineItemInput,
} from '../API.service';
import { from } from 'rxjs';
import { ContextMenuModel } from '../interfaces/context-menu-model';
import { v4 as uuidv4 } from 'uuid';
import { BoundingBox, QuadTree } from '../quad-tree';
import { input } from 'aws-amplify';
import { ConsoleLogger } from '@aws-amplify/core';

interface SubcategoryOptionValue {
  value: string;
  text: string;
}

interface DragSelect {
  overlayElement: HTMLElement;
  startPos: OpenSeadragon.Point;
  isDragging: boolean;
  selectionMode: SelectionMode;
  editMode: EditMode;
}

const OVERLAY_ID = 'highlighted-line';
enum DragMode {
  None,
  Select,
  Extend,
  Shorten,
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
}

const InputBoxHeight = 20;
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.sass'],
})
export class ReviewComponent implements OnInit {
  @Input() record?: ProbateRecord;
  @ViewChild('viewer') viewer!: ElementRef;
  osd?: OpenSeadragon.Viewer;
  selectionRect?: OpenSeadragon.Rect;
  categoryMap: Map<string, Array<SubcategoryOptionValue>> =
    this.objToStrMap(data);
  imageSize?: OpenSeadragon.Point;
  aspectRatio = 0.0;
  updatedLineItemsByIndex = new Map<number, UpdateLineItemInput>();
  updatedLineItemsById = new Map<string, UpdateLineItemInput>();
  updatedWordsById = new Map<string, WordInput>();
  dragMode = false;
  selectTracker?: OpenSeadragon.MouseTracker;
  dragSelect = {
    overlayElement: null as unknown as HTMLDivElement,
    startPos: new OpenSeadragon.Point(0, 0),
    isDragging: false,
    dragMode: DragMode.Select,
    selectionMode: SelectionMode.None,
    editMode: EditMode.None,
  };
  isDisplayContextMenu = false;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX = 0;
  rightClickMenuPositionY = 0;
  selectedLines: LineItem[] = [];
  wordMap = new Map<string, Word>();
  linesItemsToAdd = new Array<CreateLineItemInput>();
  linesItemIdsToDelete = new Array<string>();
  // wordQuadTree = new QuadTree();
  // lineQuadTree = new QuadTree();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private probateRecordService: APIService,
    private renderer: Renderer2
  ) {}

  displayContextMenu(event: any) {
    this.isDisplayContextMenu = true;

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
            menuText: 'Correct Text',
            menuEvent: 'correct',
          },
        ];
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
  }

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`,
    };
  }

  getRowsOfText(words: Word[]): Array<Array<Word>> {
    const rows = new Array<Array<Word>>();
    // get average word height
    const totalHeight = words
      .map((w) => w.boundingBox!.height)
      .reduce((previousValue, currentValue) => previousValue + currentValue);

    const avgHeight = totalHeight / words.length;

    // find the top most word
    // let topMostWord = words.reduce((p, c) => {
    //   return c.boundingBox!.top < p.boundingBox!.top ? c : p;
    // });

    let currentRow = 0;
    let copyOfWords = [...words];
    while (copyOfWords.length > 0) {
      const topMostWord = copyOfWords.reduce((p, c) => {
        return c.boundingBox!.top < p.boundingBox!.top ? c : p;
      });
      const currentTop = topMostWord.boundingBox!.top;
      let rowOfWords = copyOfWords.filter(
        (w) => w.boundingBox!.top < currentTop + avgHeight
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

  updateLineItemText(line: LineItem): void {
    // update line text
    let updatedWords = this.record!.words.filter((w) =>
      line.wordIds.includes(w!.id)
    ) as Word[];

    let rows = this.getRowsOfText(updatedWords);
    console.log('rows: ');
    console.log(rows);

    let updatedText = '';
    for (const row of rows) {
      for (const word of row) {
        updatedText += word.text;
        updatedText += ' ';
      }
      updatedText.trim();
      updatedText += '\n';
    }

    updatedText = updatedText.trim();
    this.updateLineItemById(this.selectedLines[0].id, 'title', updatedText);

    const lineIndex = this.record!.lineItems!.items.indexOf(line);
    let lineElem = document.getElementById(
      `line-${lineIndex}`
    ) as HTMLInputElement;
    if (lineElem) {
      console.log('updating line value');
      lineElem.value = updatedText;
      console.log('line value is ' + lineElem.value);
    }
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
          'select'
        );
        const rect = this.texRect2osdRect(word.boundingBox!);
        console.log('word rect');
        console.log(rect);

        this.osd!.addOverlay(selectElem, rect);
  
        // check if the element exists
        const inputId = `wordInput-${word.id}`;
  
        let inputElem = document.getElementById(inputId);
  
        if (!inputElem) {
          inputElem = this.renderer.createElement('input');
          this.renderer.setProperty(inputElem, 'id', inputId);
          this.renderer.listen(inputElem, 'input', () => {
            word.text = (inputElem! as HTMLInputElement).value;
            this.updateLineItemText(this.selectedLines[0]);
          });
          this.renderer.listen(inputElem, 'keyup.enter', () => {
            this.clearSelection();
          });
          this.renderer.appendChild(document.body, inputElem);
        }
  
        // this.renderer.setProperty(inputElem, 'className', className);
        this.renderer.setAttribute(inputElem, 'value', word.text);
  
        rect.y = top;
        if(isInputAbove) {
          rect.y -= inputHeight;
        }
        rect.height = inputHeight;
        console.log('input rect');
        console.log(rect);
        this.osd!.addOverlay(inputElem!, rect);
      }
    }
   

    
  }

  createLine(): void {
    // get selection bounding box
    let selectionBox = this.osd!.getOverlayById(OVERLAY_ID)!.getBounds(
      this.osd!.viewport
    );
    let boundingBox = this.osdRect2texRect(selectionBox);
    let newCreateLineItem = {
      id: uuidv4() as string,
      probateId: this.record!.id,
      description: '',
      title: '',
      category: '',
      subcategory: '',
      value: 0.0,
      quantity: 1,
      attributeForId: '',
      wordIds: [],
      boundingBox: {
        left: boundingBox.left,
        top: boundingBox.top,
        width: boundingBox.width,
        height: boundingBox.height,
      },
    };
    this.linesItemsToAdd.push(newCreateLineItem);

    let createdAt = new Date();
    const newLineItem = {
      ...newCreateLineItem,
      __typename: 'LineItem',
      boundingBox: boundingBox,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    } as LineItem;

    this.record?.lineItems?.items.push(newLineItem);
    this.highlightLine(newLineItem);
  }

  correctText(): void {
    // this.osd!.clearOverlays();
    let words = this.getWordsOfLine(this.selectedLines[0]);
    if (words.length > 0) {
      this.showInputsForWords(words);
    }
    this.dragMode = true;
    this.osd!.setMouseNavEnabled(false);
    this.dragSelect!.isDragging = true;
    this.dragSelect.dragMode = DragMode.Select;
    this.dragSelect.selectionMode = SelectionMode.Word;
    this.dragSelect.editMode = EditMode.Word;
  }

  handleMenuItemClick(event: any) {
    switch (event.data) {
      case 'create':
        console.log('To handle create');
        this.createLine();
        break;
      case 'combine':
        console.log('To handle combine');
        // mark lines for deletion
        const highestLowest = new Array<LineItem>();
        let minMax = this.selectedLines.reduce((acc, val) => {
          acc[0] =
            acc[0] === undefined ||
            val.boundingBox!.top < acc[0].boundingBox!.top
              ? val
              : acc[0];
          acc[1] =
            acc[1] === undefined ||
            val.boundingBox!.top + val.boundingBox!.height >
              acc[1].boundingBox!.top + acc[1].boundingBox!.height
              ? val
              : acc[1];
          return acc;
        }, highestLowest);

        const top = minMax[0].boundingBox!.top;
        const height =
          minMax[1].boundingBox!.top -
          minMax[0].boundingBox!.top +
          minMax[1].boundingBox!.height;

        const leftMostRightMost = new Array<LineItem>();
        minMax = this.selectedLines.reduce((acc, val) => {
          acc[0] =
            acc[0] === undefined ||
            val.boundingBox!.left < acc[0].boundingBox!.left
              ? val
              : acc[0];
          acc[1] =
            acc[1] === undefined ||
            val.boundingBox!.left + val.boundingBox!.width >
              acc[1].boundingBox!.left + acc[1].boundingBox!.width
              ? val
              : acc[1];
          return acc;
        }, leftMostRightMost);

        const left = minMax[0].boundingBox!.left;
        const width =
          minMax[1].boundingBox!.left +
          minMax[1].boundingBox!.width -
          minMax[0].boundingBox!.left;

        this.selectedLines[0].boundingBox = {
          __typename: 'Rect',
          left,
          top,
          width,
          height,
        };
        this.updateLineItemById(this.selectedLines[0].id, 'boundingBox', this.selectedLines[0].boundingBox);
        // Aggregate all word ids and make largest bounding box
        const wordIds = Array<string>();
        (this.selectedLines as LineItem[]).map((id) =>
          wordIds.push(...(id.wordIds as string[]))
        );
        this.selectedLines[0].wordIds = wordIds;
        this.updateLineItemById(this.selectedLines[0].id, 'wordIds', wordIds);

        // update text and mark as updated
        this.updateLineItemText(this.selectedLines[0]);

        // mark items for deletion and remove from record
        for (let i = 1; i < this.selectedLines.length; i++) {
          const line = this.selectedLines[i];
          this.linesItemIdsToDelete.push(line.id);
          const index = this.record!.lineItems!.items.indexOf(line);
          if (index > -1) {
            // only splice array when item is found
            this.record!.lineItems!.items.splice(index, 1); // 2nd parameter means remove one item only
          }
        }

        this.osd!.clearOverlays();
        let combinedOverlayElement = this.createOverlayElement(
          `boundingBox-${this.selectedLines[0].id}`,
          'select'
        );
        this.osd!.addOverlay(combinedOverlayElement, this.texRect2osdRect(this.selectedLines[0].boundingBox));
        this.selectedLines = [this.selectedLines[0]];
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

        this.osd!.updateOverlay(
          `boundingBox-${line.id}`,
          this.texRect2osdRect(texRect)
        );

        // create our second rect
        texRect.left += texRect.width;
        let overlayElement = this.createOverlayElement(
          `boundingBox-${line.id}-2`,
          'select'
        );
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
      case 'correct':
        this.correctText();
        break;
      default:
        alert('not implemented');
        break;
    }

    this.clearSelectionBox();
  }

  createInputBoxForWord(word: Word, line: LineItem) {
    // clear all other overlays
    // this.osd!.clearOverlays();

    // check if the element exists
    const inputId = `wordInput-${word.id}`;

    let inputElem = document.getElementById(inputId);

    if (!inputElem) {
      inputElem = this.renderer.createElement('input');
      this.renderer.setProperty(inputElem, 'id', inputId);
      this.renderer.listen(inputElem, 'input', () => {
        word.text = (inputElem! as HTMLInputElement).value;
        if (!this.updatedWordsById.has(word.id)) {
          this.updatedWordsById.set(word.id, {
            id: word.id,
            text: word.text,
            boundingBox: {
              left: word.boundingBox!.left,
              top: word.boundingBox!.top,
              width: word.boundingBox!.width,
              height: word.boundingBox!.height,
            },
          });
        }

        // get the other words of this word's line
        let words = (this.record!.words as Word[]).filter((w) =>
          line.wordIds.includes(w!.id)
        );

        // update line text
        let updatedWords = words;
        updatedWords.sort(
          (a, b) =>
            a.boundingBox!.left +
            a.boundingBox!.width -
            (b.boundingBox!.left + b.boundingBox!.width)
        );
        console.log('sorted array of words');
        console.log(updatedWords);
        let updatedText = '';
        for (const word of updatedWords) {
          updatedText += word.text;
          updatedText += ' ';
        }
        updatedText = updatedText.trim();
        this.updateLineItemById(this.selectedLines[0].id, 'title', updatedText);
        this.updateLineItemById(
          this.selectedLines[0].id,
          'wordIds',
          words.map((w) => w.id)
        );
        // update our html
        // get line index
        const lineIndex = this.record!.lineItems!.items.indexOf(
          this.selectedLines[0]
        );
        let lineElem = document.getElementById(
          `line-${lineIndex}`
        ) as HTMLInputElement;
        if (lineElem) {
          console.log('updating line value');
          lineElem.value = updatedText;
          console.log('line value is ' + lineElem.value);
        }
      });
      this.renderer.listen(inputElem, 'keyup.enter', () => {
        // this.clearSelection();
        this.correctText();
      });
      this.renderer.appendChild(document.body, inputElem);
    }

    // this.renderer.setProperty(inputElem, 'className', className);

    this.renderer.setAttribute(inputElem, 'value', word.text);
    const osdInputRect = this.texRect2osdRect(word.boundingBox!);
    const pixel = this.osd!.viewport.pixelFromPoint(
      new OpenSeadragon.Point(osdInputRect.x, osdInputRect.y)
    );
    pixel.y -= InputBoxHeight; // give input box height of 20 pixels
    const osdInputPoint = this.osd!.viewport.pointFromPixel(pixel);

    let inputHeight = osdInputRect.y - osdInputPoint.y;
    let inputTop: number;
    if (word.boundingBox!.top < 0.5) {
      inputTop =
        word.boundingBox!.top / this.aspectRatio +
        word.boundingBox!.height / this.aspectRatio;
    } else {
      inputTop = word.boundingBox!.top / this.aspectRatio - inputHeight;
    }
    const rect = this.texRect2osdRect(word.boundingBox!);
    rect.y = inputTop;
    rect.height = inputHeight;
    this.osd!.addOverlay(inputElem!, rect);
    inputElem!.focus();
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
    record$.subscribe((record) => {
      this.record = record as ProbateRecord;
      for (const word of this.record.words) {
        if (word) {
          this.wordMap.set(word.id, word);
          // this.wordQuadTree.insert(
          //   new BoundingBox(
          //     word.boundingBox!.left,
          //     word.boundingBox!.top,
          //     word.boundingBox!.width,
          //     word.boundingBox!.height
          //   ),
          //   word.id
          // );
        }
      }

      // for (const line of this.record.lineItems!.items) {
      //   if (line) {
      //     this.lineQuadTree.insert(
      //       new BoundingBox(
      //         line.boundingBox!.left,
      //         line.boundingBox!.top,
      //         line.boundingBox!.width,
      //         line.boundingBox!.height
      //       ),
      //       line.id
      //     );
      //   }
      // }

      // get our
      console.log(this.record);
      this.getRecord(id);
    });
  }

  updateLineItemById(id: string, field: string, value: any) {
    let updateLineItemInput: UpdateLineItemInput;
    if (this.updatedLineItemsById.has(id)) {
      updateLineItemInput = this.updatedLineItemsById.get(id)!;
    } else {
      updateLineItemInput = {
        id,
      };
      this.updatedLineItemsById.set(id, updateLineItemInput);
    }

    switch (field) {
      case 'category':
        updateLineItemInput.category = value;
        break;
      case 'subcategory':
        updateLineItemInput.subcategory = value;
        break;
      case 'title':
        updateLineItemInput.title = value;
        break;
      case 'boundingBox':
        updateLineItemInput.boundingBox = {
          left: value.left,
          top: value.top,
          width: value.width,
          height: value.height,
        };
        break;
      case 'value':
        updateLineItemInput.value = value;
        break;

      case 'quantity':
        updateLineItemInput.quantity = value;
        break;
      case 'wordIds':
        updateLineItemInput.wordIds = value;
        break;
    }
  }

  updateLineItemByIndex(lineIndex: number, field: string, value: any) {
    let id: string;
    if (this.updatedLineItemsByIndex.has(lineIndex)) {
      id = this.updatedLineItemsByIndex.get(lineIndex)!.id;
    } else {
      id = this.record!.lineItems!.items[lineIndex]!.id;
    }
    this.updateLineItemById(id, field, value);
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
    this.updateLineItemByIndex(lineIndex, 'category', category);
  }

  onSubcategoryChanged(lineIndex: number): void {
    let subcategorySelect = document.getElementById(
      'subcategory-' + lineIndex
    ) as HTMLInputElement;

    // update our object
    if (this.record != undefined) {
      this.updateLineItemByIndex(
        lineIndex,
        'subcategory',
        subcategorySelect.value
      );
    }
  }

  onTextChanged(lineIndex: number): void {
    const titleElement = document.getElementById(
      'line-' + lineIndex
    ) as HTMLInputElement;
    console.log(titleElement);
    this.updateLineItemByIndex(lineIndex, 'title', titleElement.value);
  }

  onValueChanged(lineIndex: number): void {
    const valueElement = document.getElementById(
      'total-value-' + lineIndex
    ) as HTMLInputElement;
    console.log(valueElement);
    this.updateLineItemByIndex(lineIndex, 'value', valueElement.value);
  }

  onQuantityChanged(lineIndex: number): void {
    const quantityElement = document.getElementById(
      'quantity-' + lineIndex
    ) as HTMLInputElement;
    console.log(quantityElement);
    this.updateLineItemByIndex(lineIndex, 'quantity', quantityElement.value);
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
      'select'
    );
    this.osd!.addOverlay(selectElem, this.texRect2osdRect(line.boundingBox!));
    this.selectedLines = [];
    this.selectedLines.push(line);
  }

  highlightText(index: number): void {
    if (this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }
    this.clearSelection();

    console.log(`line ${index} highlighted`);
    const boundingBox = this.record!.lineItems!.items[index]!.boundingBox;
    // check if overlay exists
    const point = new OpenSeadragon.Point(boundingBox?.left, boundingBox?.top);
    const rect = this.texRect2osdRect(boundingBox!);
    this.selectionRect = rect;
    let overlay = this.createOverlayElement();
    this.osd?.addOverlay({ element: overlay!, location: rect });
    this.osd?.viewport.fitBoundsWithConstraints(rect);
    this.selectedLines = [];
    this.selectedLines.push(this.record!.lineItems!.items[index]!);
  }

  selectRect() {
    this.clearSelection();
    console.log('selecting now');
    this.dragMode = true;
    this.osd!.setMouseNavEnabled(false);
    this.dragSelect!.isDragging = true;
    this.dragSelect!.dragMode = DragMode.Select;
    this.dragSelect.selectionMode = SelectionMode.Line;
    this.dragSelect.editMode = EditMode.Line;
  }

  clearSelectedElems() {
    this.clearSelectionBox();

    let selectionElems = document.querySelectorAll('.highlight');
    selectionElems.forEach((selectedLine) => {
      selectedLine.remove();
    });
  }

  clearSelection() {
    this.osd!.clearOverlays();
    this.clearSelectedElems();
    this.dragSelect.selectionMode = SelectionMode.None;
    this.dragSelect.editMode = EditMode.None;
    this.dragSelect.dragMode = DragMode.None;
    this.dragSelect.isDragging = false;
    this.osd!.setMouseNavEnabled(true);

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

  rectanglesIntersect(
    minAx: number,
    minAy: number,
    maxAx: number,
    maxAy: number,
    minBx: number,
    minBy: number,
    maxBx: number,
    maxBy: number
  ): boolean {
    return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy;
  }

  texRectangleContainsTexRectangle(a: Rect, b: Rect) {
    return (
      a.left <= b.left &&
      a.top <= b.top &&
      a.left + a.width >= b.left + b.width &&
      a.top + a.height >= b.top + b.height
    );
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

  osdRectangleContainsOsdRectangle(a: OpenSeadragon.Rect, b: OpenSeadragon.Rect) {
    return (
      a.x <= b.x &&
      a.y <= b.y &&
      a.x + a.width >= b.x + b.width &&
      a.y + a.height >= b.y + b.height
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

  // A line
  // B selection rect
  verticallyOverlapped(
    minAy: number,
    maxAy: number,
    minBy: number,
    maxBy: number
  ) {
    const threshold = 0.6;
    let heightA = maxAy - minAy;
    let allowedAmount = (1.0 - threshold) * heightA;
    let isOverlapped = false;
    if (minBy <= minAy) {
      isOverlapped = maxBy > minAy && maxAy - maxBy < allowedAmount;
    } else {
      isOverlapped =
        (minBy < maxAy && maxBy < maxAy) || minBy - minAy < allowedAmount;
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

      const lineRect = this.texRect2osdRect(boundingBox!);
      if (
        line &&
        this.rectanglesIntersect(
          lineRect.x,
          lineRect.y,
          lineRect.x + lineRect.width,
          lineRect.y + lineRect.height,
          selectRect.x,
          selectRect.y,
          selectRect.x + selectRect.width,
          selectRect.y + selectRect.height
        ) &&
        this.verticallyOverlapped(
          lineRect.y,
          lineRect.y + lineRect.height,
          selectRect.y,
          selectRect.y + selectRect.height
        )
      ) {
        lines.push(line);
      }
    }

    return lines;
  }
  // getSelectedLines(selectRect: OpenSeadragon.Rect): LineItem[] {
  //   if (this.aspectRatio === 0.0) {
  //     this.calculateAspectRatio();
  //   }
  //   let boundingBox = this.osdRect2BoundingBox(selectRect);
  //   let lineIds = this.lineQuadTree.retrieve(boundingBox);
  //   let lines: LineItem[] = this.record!.lineItems!.items.filter((l) =>
  //     lineIds.includes(l!.id)
  //   ) as LineItem[];
  //   lines = lines.filter((l) =>
  //     this.verticallyOverlapped(
  //       l.boundingBox!.top,
  //       l.boundingBox!.top + l.boundingBox!.height,
  //       boundingBox.y,
  //       boundingBox.y + boundingBox.height
  //     )
  //   );

  //   return lines;
  // }

  // getWordsInBoundingBox(boundingBox: BoundingBox) {
  //   let ids = this.wordQuadTree.retrieve(boundingBox);
  //   let selectedWords = this.record!.words.filter((w) => ids.includes(w!.id));
  //   return selectedWords;
  // }

  filterLinesInBox(words: Word[], boundingBox: BoundingBox): Word[] {
    return words.filter((w) =>
      boundingBox.contains(this.texRect2BoundingBox(w!.boundingBox!))
    );
  }

  getWordsInBoundingBox(boundingBox: BoundingBox) {
    return this.filterLinesInBox(this.record!.words as Word[], boundingBox);
  }

  getWordsOfLine(line: LineItem): Word[] {
    return (this.record!.words as Word[]).filter((w) =>
      line.wordIds.includes(w!.id)
    );
  }

  getWordsInLineBoundingBox(line: LineItem): Word[] {
    let boundingBox = this.texRect2BoundingBox(line.boundingBox!);

    let words = this.getWordsOfLine(line);
    words = this.filterLinesInBox(words, boundingBox);
    return words;
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
      prefixUrl: '//openseadragon.github.io/openseadragon/images/',
      tileSources: infoUrl,
    });

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
      },
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
            overlayElement = this.createOverlayElement();
            this.dragSelect.overlayElement = overlayElement as HTMLDivElement;

            this.osd!.addOverlay(
              overlayElement,
              new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0)
            );
            break;
          case DragMode.Split:
            console.log('splitting overlay');

            break;
        }
      },
      dragHandler: (event) => {
        if (!this.dragSelect!.isDragging) {
          return;
        }

        var viewportPos = this.osd!.viewport.pointFromPixel(
          (event as unknown as OpenSeadragon.CanvasDragEvent).position
        );
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
            
            if(this.dragSelect.editMode === EditMode.Word) {
              // do not allow user to select word bounds outside line item bounds
              let selectedLineBoundingBox = this.osd!.getOverlayById(`boundingBox-${this.selectedLines[0].id}`).getBounds(this.osd!.viewport);
              if(!this.osdRectangleContainsOsdRectangle(selectedLineBoundingBox, location)) {
                break;
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

        let mouseNavEnabled = true;
        // highlight selected lines
        switch (this.dragSelect.dragMode) {
          case DragMode.Select:
            switch (this.dragSelect.selectionMode) {
              case SelectionMode.Line:
                this.selectedLines = this.getSelectedLines(location);
                for (const line of this.selectedLines) {
                  const selectElem = this.createOverlayElement(
                    `boundingBox-${line.id}`,
                    'select'
                  );
                  this.osd!.addOverlay(
                    selectElem,
                    this.texRect2osdRect(line.boundingBox!)
                  );
                }
                break;
              case SelectionMode.Word:
                if (this.selectedLines.length == 1) {
                  // check if we have clicked on an existing input box
                  let existingWords = this.getWordsOfLine(
                    this.selectedLines[0]
                  ) as Word[];

                  // check inputs
                  let isClickInExisting = false;
                  for (const existingWord of existingWords) {
                    const overlay = this.osd!.getOverlayById(
                      `wordInput-${existingWord.id}`
                    );
                    if (
                      this.osdRect2BoundingBox(
                        overlay.getBounds(this.osd!.viewport)
                      ).contains(this.osdRect2BoundingBox(location))
                    ) {
                      isClickInExisting = true;
                      break;
                    }
                  }

                  if (isClickInExisting) {
                    break;
                  }

                  console.log('creating word');
                  // create new word
                  let word = {
                    __typename: 'Word',
                    text: '',
                    id: uuidv4(),
                    boundingBox: this.osdRect2texRect(location),
                  } as unknown as Word;
                  console.log('word created');
                  console.log(word);
                  this.record?.words.push(word);
                  this.selectedLines[0].wordIds.push(word.id);
                  // create input box above boundingBox
                  this.createInputBoxForWord(word, this.selectedLines[0]);
                  mouseNavEnabled = false;
                }
                break;
            }
            if (this.selectedLines.length > 0) {
              this.clearSelectionBox();
            }

            break;
          case DragMode.Shorten:
          case DragMode.Extend:
            // update bounding box
            let line = this.selectedLines[0];
            let selectedLineOverlay = this.osd!.getOverlayById(
              `boundingBox-${line.id}`
            );
            line.boundingBox = this.osdRect2texRect(
              selectedLineOverlay.getBounds(this.osd!.viewport)
            );
            this.updateLineItemById(line.id, 'boundingBox', line.boundingBox);
            console.log('bounding box updated');
            break;
          case DragMode.Split:
            let lineToSplit = this.selectedLines[0];
            let selectedSplitLineOverlay = this.osd!.getOverlayById(
              `boundingBox-${lineToSplit.id}`
            );
            // update our first bounding box
            lineToSplit.boundingBox = this.osdRect2texRect(
              selectedSplitLineOverlay.getBounds(this.osd!.viewport)
            );
            this.updateLineItemById(
              lineToSplit.id,
              'boundingBox',
              lineToSplit.boundingBox
            );
            let wordIdsToKeep = [];
            let wordIdsToRemove = [];
            let textToAdd = '';

            for (const id of lineToSplit.wordIds) {
              const word = this.wordMap.get(id!);
              if (
                this.texRectangleContainsTexRectangle(
                  lineToSplit.boundingBox,
                  word!.boundingBox!
                )
              ) {
                wordIdsToKeep.push(word!.id);
              } else {
                textToAdd += `${word!.text} `;
                wordIdsToRemove.push(word!.id);
              }
            }
            this.updateLineItemById(lineToSplit.id, 'wordIds', wordIdsToKeep);

            // update our second bounding box
            let newLineOverlay = this.osd!.getOverlayById(
              `boundingBox-${lineToSplit.id}-2`
            );
            textToAdd = textToAdd.trim();
            let newBoundingBox = this.osdRect2texRect(
              newLineOverlay.getBounds(this.osd!.viewport)
            );

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
                height: newBoundingBox.height,
              },
            };
            this.linesItemsToAdd.push(newLineItem);

            this.record?.lineItems?.items.push({
              ...newLineItem,
              __typename: 'LineItem',
              boundingBox: newBoundingBox,
              createdAt: lineToSplit.createdAt,
              updatedAt: lineToSplit.updatedAt,
            });
            break;
        }

        console.log('release handler called');
        this.dragSelect!.isDragging = false;
        this.dragMode = false;
        this.osd!.setMouseNavEnabled(mouseNavEnabled);
      },
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

    for (const lineItemId of this.linesItemIdsToDelete) {
      let item = {
        id: lineItemId,
      };
      let response = await this.probateRecordService.DeleteLineItem(item);
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
      let lineResponse = await this.probateRecordService.CreateLineItem(
        newLineItem
      );
      console.log('new line item created');
      console.log(lineResponse);
    }
    this.linesItemsToAdd = [];
    let updatedWords = (Array.from(this.record!.words) as Word[]).map((w) => ({
      id: w.id,
      text: w.text,
      boundingBox: {
        left: w.boundingBox!.left,
        top: w.boundingBox!.top,
        width: w.boundingBox!.width,
        height: w.boundingBox!.height,
      },
    }));

    let item = { id: this.record!.id, reviewCount, words: updatedWords };
    console.log(item);
    let input: UpdateProbateRecordInput = item;
    console.log(input);
    let response = await this.probateRecordService.UpdateProbateRecord(
      input as unknown as UpdateProbateRecordInput
    );
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
