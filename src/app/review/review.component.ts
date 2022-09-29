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
  DeleteProbateRecordInput,
  Line,
  RectInput,
} from '../API.service';
import { from } from 'rxjs';
import { ContextMenuModel } from '../interfaces/context-menu-model';
import { v4 as uuidv4 } from 'uuid';
import { BoundingBox, QuadTree } from '../quad-tree';
import { input } from 'aws-amplify';
import { ConsoleLogger } from '@aws-amplify/core';
import { deleteWord } from 'src/graphql/mutations';

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

enum CommandType {
  CreateLine = 1,
  DeleteLine,
  ResizeLineBoundingBox,
  CreateWord,
  DeleteWord,
  ResizeWordBoundingBox,
}

interface BoundingBoxChange {
  newVal?: Rect;
  oldVal?: Rect;
}

interface WordResult {
  word?: Word;
  lineItemIds?: string[];
}

interface LineItemResult {
  lineItem?: LineItem;
  rect?: Rect;
}

interface Command {
  type: CommandType;
  input: LineItem | Word | BoundingBoxChange;
  ids?: string[];
  rect?: Rect;
  result?: LineItemResult | WordResult | BoundingBoxChange;
}

const OVERLAY_ID = 'highlighted-line';
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
}

const InputBoxHeight = 20;
const CommandQueueLength = 20;

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
  activeWord: Word | undefined;

  commands: Command[] = [];
  redoCommands: Command[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private probateRecordService: APIService,
    private renderer: Renderer2
  ) {
    this.setupListeners();
  }

  setupListeners(): void {
    window.addEventListener('keyup', (ev) => {
      console.log('keyup');
      if (ev.ctrlKey) {
        switch (ev.key) {
          case 'z':
            console.log('undo has been called');
            this.undo();
            break;

          case 'y': {
            console.log('redo has been called');
            this.redo();
          }
        }
      }
      ev.preventDefault();
    });
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

  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`,
    };
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

  updateLineItemText(line: LineItem): void {
    // update line text
    let updatedWords = this.record!.words.filter((w) =>
      line.wordIds.includes(w!.id)
    ) as Word[];

    let rows = this.getRowsOfText(updatedWords);
    console.log('rows: ');
    console.log(rows);

    let wordIdsToRemove = [] as string[];

    let updatedText = '';
    for (const row of rows) {
      for (const word of row) {
        if (!word.text) {
          wordIdsToRemove.push(word.id);
          continue;
        }
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
      lineElem.innerText = updatedText;
      console.log('line value is ' + lineElem.innerText);
    }

    // Remove blank words
    this.record!.words = this.record!.words.filter(
      (w) => !wordIdsToRemove.includes(w!.id)
    ) as Word[];
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
          inputElem = this.renderer.createElement('input');
          this.renderer.setProperty(inputElem, 'id', inputId);
          this.renderer.listen(inputElem, 'input', () => {
            word.text = (inputElem! as HTMLInputElement).value;
            this.updateLineItemText(this.selectedLines[0]);
          });
          this.renderer.listen(inputElem, 'keyup.enter', () => {
            console.log('keyup.enter fired');
            this.clearSelection();
          });
          this.renderer.listen(inputElem, 'focus', () => {
            this.osd?.viewport.fitBoundsWithConstraints(rect);
            this.activeWord = word;
          });
          this.renderer.appendChild(document.body, inputElem);
        }

        this.renderer.setAttribute(inputElem, 'value', word.text);

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
        console.log('create line clicked');
        let selectionBox = this.osd!.getOverlayById(OVERLAY_ID)!.getBounds(
          this.osd!.viewport
        );
        let boundingBox = this.osdRect2texRect(selectionBox);
        this.callCreateLineItem(null, boundingBox).then((command) => {
          this.highlightLine(
            (command.result as LineItemResult).lineItem as LineItem
          );
        });

        break;
      case 'combine':
        console.log('combine lines clicked');
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
        this.updateLineItemById(
          this.selectedLines[0].id,
          'boundingBox',
          this.selectedLines[0].boundingBox
        );
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
        this.osd!.addOverlay(
          combinedOverlayElement,
          this.texRect2osdRect(this.selectedLines[0].boundingBox)
        );
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
        let words = (this.record!.words as Word[]).filter((w) =>
          this.selectedLines[0].wordIds.includes(w.id)
        );
        if (words.length > 0) {
          this.showInputsForWords(words);
        }
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
      case 'expand':
        this.dragSelect.dragMode = DragMode.Expand;
        this.dragMode = true;
        this.osd!.setMouseNavEnabled(false);
        this.dragSelect!.isDragging = true;
        break;
      case 'correct':
        this.correctText();
        break;

      case 'delete line':
        this.callDeleteLineItem(this.selectedLines[0]);
        break;

      case 'delete word':
        {
          console.log('deleting word');
          console.log(this.activeWord);
          this.callDeleteWord(this.activeWord!);
          this.activeWord = undefined;
          let lineItem = this.selectedLines[0];
          this.clearSelection();
          this.selectedLines[0] = lineItem;
          // remove overlay and input for deleted word
          this.highlightLine(lineItem);
          this.correctText();
        }
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
            // confidence: word.confidence,
            // lowerText: word.lowerText
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
          lineElem.innerText = updatedText;
          console.log('line value is ' + lineElem.innerText);
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

        console.log("rec'd line items");
        console.log(lineItems);
      });

      // get our
      console.log(this.record);
      this.getRecord(id);
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
    this.osd?.viewport.fitBoundsWithConstraints(rect);
  }

  highlightText(index: number): void {
    if (this.aspectRatio === 0.0) {
      this.calculateAspectRatio();
    }
    this.clearSelection();

    // this.selectedLines.push(this.record!.lineItems!.items[index]!);
    const line = this.record!.lineItems!.items[index] as LineItem;
    // console.log(`line ${index} highlighted`);
    // const boundingBox = line.boundingBox;
    // // check if overlay exists
    // const point = new OpenSeadragon.Point(boundingBox?.left, boundingBox?.top);
    const rect = this.texRect2osdRect(line.boundingBox!);
    // this.selectionRect = rect;
    // let overlay = this.createOverlayElement();
    // this.osd?.addOverlay({ element: overlay!, location: rect });
    this.osd?.viewport.fitBoundsWithConstraints(rect);
    // this.selectedLines = [];
    this.highlightLine(line);
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

            if (this.dragSelect.editMode === EditMode.Word) {
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
                if (this.selectedLines.length == 1) {
                  // scroll element into view
                  let lineIndex = (
                    this.record!.lineItems!.items as LineItem[]
                  ).findIndex((l) => l.id == this.selectedLines[0].id);
                  let lineElem = document.getElementById(`line-${lineIndex}`);
                  if (lineElem) {
                    lineElem.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }
                }
                break;
              case SelectionMode.Word:
                if (this.selectedLines.length == 1) {
                  // check if we clicked outside of the bounds
                  let selectedLineBoundingBox = this.osd!.getOverlayById(
                    `boundingBox-${this.selectedLines[0].id}`
                  ).getBounds(this.osd!.viewport);

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

                  // do not create a new word if clicking outside of line bounding box
                  if (
                    !this.osdRectangleContainsOsdRectangle(
                      selectedLineBoundingBox,
                      location
                    )
                  ) {
                    // done editing
                    this.clearSelection();

                    return;
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
          case DragMode.Expand:
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
          case DragMode.Expand:
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
            lineToSplit.wordIds = wordIdsToKeep;
            this.updateLineItemText(lineToSplit);
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
              confidence: 1.0,
              lowerTitle: textToAdd.toLocaleLowerCase(),
            };
            this.linesItemsToAdd.push(newLineItem);

            this.record?.lineItems?.items.push({
              ...newLineItem,
              __typename: 'LineItem',
              boundingBox: newBoundingBox,
              createdAt: lineToSplit.createdAt,
              updatedAt: lineToSplit.updatedAt,
            });

            // highlight our new split off line
            this.highlightLine(lineToSplit);
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
      // confidence: w.confidence,
      // lowerText: w.lowerText
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

  async deleteLineItem(lineItem: LineItem): Promise<LineItemResult> {
    if (this.record && this.record.lineItems) {
      if (lineItem) {
        this.record.lineItems.items = this.record.lineItems.items.filter(
          (r) => r!.id != lineItem.id
        );
        console.log('deleting record ' + lineItem.id);
        let response = await this.probateRecordService.DeleteLineItem({
          id: lineItem.id,
        });
        console.log(response);
      }
    }
    let rect = lineItem.boundingBox || undefined;
    return { lineItem, rect };
  }

  deleteLineItemByIndex(index: number): void {
    let lineItem = null;
    if (this.record && this.record.lineItems) {
      lineItem = this.record.lineItems.items[index];
    }

    if (!lineItem) {
      throw 'Invalid line index';
    }

    this.callDeleteLineItem(lineItem);
  }

  editLineItemByIndex(index: number): void {
    let lineItem = null;
    if (this.record && this.record.lineItems) {
      lineItem = this.record.lineItems.items[index];
    }

    if (!lineItem) {
      throw 'Invalid line index';
    }

    this.highlightLine(lineItem);
    this.correctText();
  }

  async createLineItem(
    lineItem: LineItem | null | undefined = undefined,
    rect: Rect | undefined = undefined
  ): Promise<LineItemResult> {
    let defaultLineItemToAdd = {
      probateId: this.record!.id,
      wordIds: [],
      title: '',
      description: '',
      category: '',
      subcategory: '',
      quantity: 0,
      value: 0,
      attributeForId: '',
      boundingBox: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      },
    };

    let lineItemInput: CreateLineItemInput;
    if (lineItem) {
      let lineItemToAdd: Partial<LineItem> = lineItem;
      delete lineItemToAdd['__typename'];
      delete lineItemToAdd['createdAt'];
      delete lineItemToAdd['updatedAt'];
      lineItemInput = lineItemToAdd as CreateLineItemInput;
    } else {
      lineItemInput = defaultLineItemToAdd;
    }

    if (rect) {
      let boundingBox = {
        left: rect.left,
        top: rect.top,
        height: rect.height,
        width: rect.width,
      };

      lineItemInput.boundingBox = boundingBox;
    }

    let addedLineItem = await this.probateRecordService.CreateLineItem(
      lineItemInput
    );
    console.log(addedLineItem);
    this.record!.lineItems?.items.push(addedLineItem);
    this.sortLineItems();
    return { lineItem: addedLineItem, rect };
  }

  createWord(
    word: Word | null | undefined,
    lineItemIds: string[] | undefined = undefined
  ): WordResult {
    let defaultWord = {
      __typename: 'Word',
      id: uuidv4(),
      text: '',
      boundingBox: {
        __typename: 'Rect',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      },
    };

    let wordToAdd = word ? word : defaultWord;
    this.record!.words.push(wordToAdd as Word);
    if (lineItemIds) {
      for (const lineItem of this.record!.lineItems!.items as LineItem[]) {
        if (lineItemIds.includes(lineItem.id)) {
          lineItem.wordIds.push(wordToAdd.id);
        }
      }
    }

    return { word: wordToAdd as Word, lineItemIds };
  }

  deleteWord(word: Word): WordResult {
    console.log('deleting word');
    const id = word.id;
    // remove it from the record
    this.record!.words = this.record!.words.filter((w) => w!.id != id);

    // remove it from all lines
    let lineItemIds = (this.record!.lineItems!.items as LineItem[])
      .filter((l) => l.wordIds.includes(id))
      .map((l) => l.id);

    for (const lineItem of this.record!.lineItems!.items as LineItem[]) {
      if (lineItemIds.includes(lineItem.id)) {
        console.log('found word');
        lineItem.wordIds = lineItem.wordIds.filter((w) => w != id);
        this.updateLineItemText(lineItem);
      }
    }

    return { word, lineItemIds };
  }

  async undoCommand(command: Command) {
    console.log('undoing command');
    console.log(command);
    switch (command.type) {
      case CommandType.CreateLine:
        command.result = await this.getCommandResult({
          type: CommandType.DeleteLine,
          input: (command.result! as LineItemResult).lineItem!,
        });

        break;
      case CommandType.DeleteLine:
        command.result = await this.getCommandResult({
          type: CommandType.CreateLine,
          input: (command.result! as LineItemResult).lineItem!,
          rect:
            (command.result! as LineItemResult).lineItem!.boundingBox ||
            undefined,
        });
        break;
      case CommandType.ResizeLineBoundingBox:
        command.result = await this.getCommandResult({
          ...command,
          input: {
            oldVal: (command.input as BoundingBoxChange).newVal,
            newVal: (command.input as BoundingBoxChange).oldVal,
          },
        });
        break;
      case CommandType.CreateWord:
        command.result = await this.getCommandResult({
          type: CommandType.DeleteWord,
          input: (command.result! as WordResult).word!,
        });
        break;
      case CommandType.DeleteWord:
        {
          let word = (command.result! as WordResult).word!;
          command.result = await this.getCommandResult({
            type: CommandType.CreateWord,
            input: word,
            ids: (command.result! as WordResult).lineItemIds,
          });
          let lineItem = this.record!.lineItems!.items.find(
            (l) => l!.wordIds.includes(word.id)
          );
          if(lineItem === this.selectedLines[0]) {
            this.updateLineItemText(lineItem);
            this.correctText();
          }

        }
        break;
      case CommandType.ResizeWordBoundingBox:
        command.result = await this.getCommandResult({
          ...command,
          input: {
            oldVal: (command.input as BoundingBoxChange).newVal,
            newVal: (command.input as BoundingBoxChange).oldVal,
          },
        });
        break;
    }
  }

  async getCommandResult(
    command: Command
  ): Promise<LineItemResult | WordResult | BoundingBoxChange> {
    let result: LineItemResult | WordResult | BoundingBoxChange | undefined;

    switch (command.type) {
      case CommandType.CreateLine:
        result = await this.createLineItem(
          command.input as LineItem,
          command.rect
        );
        this.highlightLine((result as LineItemResult).lineItem!);
        break;
      case CommandType.DeleteLine:
        result = await this.deleteLineItem(command.input as LineItem);
        this.clearSelection();
        break;
      case CommandType.ResizeLineBoundingBox:
        {
          let lineItem = (this.record!.lineItems!.items as LineItem[]).find(
            (l) => l.id == command.ids![0]
          );
          if (lineItem) {
            let oldVal = lineItem.boundingBox || undefined;
            lineItem.boundingBox = (command.input as BoundingBoxChange).newVal;
            result = { newVal: lineItem!.boundingBox, oldVal };
          } else {
            throw 'Invalid line item';
          }
        }
        break;
      case CommandType.CreateWord:
        result = this.createWord(command.input as Word, command.ids);
        break;
      case CommandType.DeleteWord:
        result = this.deleteWord(command.input as Word);
        break;
      case CommandType.ResizeWordBoundingBox:
        let word = this.record!.words.find((w) => w!.id === command.ids![0]);
        if (word) {
          let oldVal = word.boundingBox || undefined;
          word.boundingBox = (command.input as BoundingBoxChange).newVal;

          result = { newVal: word.boundingBox, oldVal };
        }
        break;
    }

    if (result === undefined) {
      throw 'Command not supported';
    }

    return result;
  }

  async redoCommand(command: Command): Promise<Command> {
    command.result = await this.getCommandResult(command);
    return command;
  }

  async executeCommand(command: Command): Promise<Command> {
    command.result = await this.getCommandResult(command);
    return command;
  }

  async callCommand(command: Command): Promise<Command> {
    // check our command length
    if (this.commands.length === CommandQueueLength) {
      this.commands.shift();
    }
    this.commands.push(command);

    return this.executeCommand(command);
  }

  async callCreateLineItem(
    lineItem: LineItem | undefined | null = undefined,
    rect: Rect | undefined
  ): Promise<Command> {
    let command = {
      type: CommandType.CreateLine,
      input: lineItem,
    };

    if (rect) {
      (command as Command).rect = rect;
    }
    console.log(command);
    return await this.callCommand(command as Command);
  }

  async callDeleteLineItem(lineItem: LineItem): Promise<Command> {
    let command = {
      type: CommandType.DeleteLine,
      input: lineItem,
      rect: lineItem.boundingBox,
    };
    return await this.callCommand(command as Command);
  }

  async callCreateWord(word: Word): Promise<Command> {
    let command = {
      type: CommandType.CreateWord,
      input: word,
    };
    return await this.callCommand(command);
  }

  async callDeleteWord(word: Word): Promise<Command> {
    let ids: string[] = [];
    for (const lineItem of this.record!.lineItems!.items as LineItem[]) {
      if (lineItem.wordIds.includes(word.id)) {
        ids.push(lineItem.id);
      }
    }

    let command = {
      type: CommandType.DeleteWord,
      input: word,
      ids,
    };
    return await this.callCommand(command as Command);
  }

  async callAdjustBoundingBoxForLine(
    id: string,
    oldVal: Rect,
    newVal: Rect
  ): Promise<Command> {
    let command = {
      type: CommandType.ResizeLineBoundingBox,
      input: {
        oldVal,
        newVal,
      },
      ids: [id],
    };

    return await this.callCommand(command as Command);
  }

  async callAdjustBoundingBoxForWord(
    id: string,
    oldVal: Rect,
    newVal: Rect
  ): Promise<Command> {
    let command = {
      type: CommandType.ResizeWordBoundingBox,
      input: {
        oldVal,
        newVal,
      },
      ids: [id],
    };

    return await this.callCommand(command as Command);
  }

  undo() {
    if (this.commands.length > 0) {
      let command = this.commands.pop() as Command;
      this.redoCommands.push(command);
      this.undoCommand(command).then(() => {
        console.log('undo called');
        console.log(command);
      });
    }
  }

  redo() {
    if (this.redoCommands.length > 0) {
      let command = this.redoCommands.pop() as Command;
      this.commands.push(command);
      this.redoCommand(command);
    }
  }
}
