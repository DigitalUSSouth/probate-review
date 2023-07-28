import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  ModelSortDirection,
} from '../API.service';
import data from '../categories.json';
import { Subject, from, fromEvent, takeUntil } from 'rxjs';
import { ContextMenuModel } from '../interfaces/context-menu-model';
import { v4 as uuidv4 } from 'uuid';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
// import { BoundingBox } from '../quad-tree';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { deleteLine, deleteWord } from 'src/graphql/mutations';
import { MatButton } from '@angular/material/button';
import { CookieService } from 'ngx-cookie-service';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

import { CombineLineDialogComponent } from '../combine-line-dialog/combine-line-dialog.component';
import { AmplifyUser } from '@aws-amplify/ui';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import awsExports from 'src/aws-exports';
import { Amplify } from 'aws-amplify';
import { LocationStrategy } from '@angular/common';

class BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x = 0, y = 0, width = 1, height = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  intersects(rect: BoundingBox): boolean {
    // return !(rect.x > this.x + this.width ||
    //     rect.x + rect.width < this.x ||
    //     rect.y > this.y + this.height ||
    //     rect.y + rect.height < this.y);
    return (
      this.x + this.width >= rect.x &&
      this.x <= rect.x + rect.width &&
      this.y <= rect.y + rect.height &&
      this.y + this.height >= rect.y
    );
  }

  contains(rect: BoundingBox): boolean {
    return (
      this.x <= rect.x &&
      this.x + this.width >= rect.x + rect.width &&
      this.y <= rect.y &&
      this.y + this.height >= rect.y + rect.height
    );
  }
}

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
  words?: Word[];
  operation: OperationType;
  rowIndex?: number;
}

interface WordCommand extends Command {
  word: Word;
  lineItemId: string;
  operation: OperationType;
}

interface MoveLineItemCommand extends Command {
  lineItem: LineItem;
  oldIndex: number;
  newIndex: number;
}

interface AdjustLineItemBoundsCommand extends Command {
  lineItem: LineItem;
  oldBoundingBox: Rect;
  newBoundingBox: Rect;
}

interface SplitLineItemCommand extends Command {
  lineItem: LineItem;
  newLineItem: LineItem;
  oldBoundingBox: Rect;
  newBoundingBox: Rect;
}

interface CombineLineItemsCommand extends Command {
  lineItem: LineItem;
  oldLineItems: LineItem[];
  originalWordIds: string[];
  originalBoundingBox: Rect;
}

interface DragSelect {
  overlayElement: HTMLElement;
  startPos: OpenSeadragon.Point;
  isDragging: boolean;
  selectionMode: SelectionMode;
  editMode: EditMode;
}

interface LineItemResult {
  lineItem?: LineItem;
  rect?: Rect;
}

enum DragMode {
  None,
  Select,
  Extend,
  Shorten,
  Expand,
  Split,
  AdjustBox,
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
  AdjustWordBox,
  CreateLine,
  CreateWord,
}

enum CommandType {
  BulkDelete,
  DeleteLine,
  DeleteWord,
  CombineLineItems,
  CreateWord,
  CreateLine,
  AdjustLineItemBounds,
  MoveLine,
  MarkAsReviewed,
  SplitLine,
  UnmarkAsReviewed,
  Unknown,
}

enum OperationType {
  Create,
  Delete,
  Unknown,
}

const InputBoxHeight = 20;
const AdjustWordBox = 'adjust word box';
const CorrectText = 'correct text';
const DeleteLine = 'delete line';
const CreateLine = 'create line';
const DeleteWord = 'delete word';
const CreateWord = 'create word';

@Component({
  selector: 'app-unreviewed-detail',
  templateUrl: './unreviewed-detail.component.html',
  styleUrls: ['./unreviewed-detail.component.sass'],
})
export class UnreviewedDetailComponent implements OnInit {
  @Input() record?: ProbateRecord;
  @ViewChild('viewer') viewer!: ElementRef;
  @ViewChild('table') table!: MatTable<LineItem>;
  @ViewChildren('checkbox') checkBoxes?: QueryList<MatCheckbox>;

  // UI
  selectionButtonLabel: 'Select' | 'Exit' = 'Select';
  reviewedCheckBoxText: 'Reviewed' | 'Publish' = 'Reviewed';
  isSelecting = false;
  isAdjustingBoundingBox = false;
  isSplitting = false;

  // Image
  osd?: OpenSeadragon.Viewer;
  selectTracker?: OpenSeadragon.MouseTracker;
  imageSize?: OpenSeadragon.Point;
  aspectRatio = 0.0;
  isNavigatorVisible = false;
  dragSelect = {
    overlayElement: null as unknown as HTMLElement, //HTMLDivElement,
    startPos: new OpenSeadragon.Point(0, 0),
    isDragging: false,
    dragMode: DragMode.Select,
    selectionMode: SelectionMode.None,
    editMode: EditMode.None,
  };
  boundsBeforeEdit?: OpenSeadragon.Rect;

  // Data table
  displayedColumns: string[] = [
    'checked',
    'title',
    'category',
    'subcategory',
    'quantity',
    'value',
  ];

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
  commands: Array<
    | Command
    | BulkLineItemCommand
    | LineItemCommand
    | WordCommand
    | MoveLineItemCommand
    | AdjustLineItemBoundsCommand
    | SplitLineItemCommand
    | CombineLineItemsCommand
  > = [];

  // Lines, Words
  selectedLine: LineItem | null = null;
  selectedWord: Word | null | undefined = null;
  selectedLines: LineItem[] = [];
  newLineIds = new Set<string>();
  existingLineIds = new Set<string>();
  updatedLineIds = new Set<string>();
  deletedLineIds = new Set<string>();

  // User
  user?: AmplifyUser;
  lockedByOtherUser = true;

  // UI mode

  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    public authenticator: AuthenticatorService,
    private route: ActivatedRoute,
    private probateRecordService: APIService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private cookieService: CookieService,
    private router: Router,
    private location: LocationStrategy
  ) {
    Amplify.configure(awsExports);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  backToList() {
    this.router.navigateByUrl('/unreviewed');
  }

  onReviewedChange(event: Event) {
    const commandType = this.isReviewed
      ? CommandType.MarkAsReviewed
      : CommandType.UnmarkAsReviewed;
    this.commands.push({
      type: commandType,
      wasDirtyBeforeCommand: this.isDirty,
    });
    console.log('marked as reviewed change');
    this.isDirty = true;
  }

  recordsChecked(): number {
    return this.checkBoxes
      ? (this.checkBoxes as QueryList<MatCheckbox>).filter(
          (c: MatCheckbox) => c.checked == true
        ).length
      : 0;
  }

  checkRow() {
    this.isLineChecked = this.recordsChecked() > 0;
  }

  checkedCheckBoxesFilterFunction(checkBox: MatCheckbox): boolean {
    return checkBox.checked;
  }

  // isSelecting() {
  //   return this.dragSelect.dragMode === DragMode.Select;
  // }

  isEditing() {
    return this.dragSelect.editMode != EditMode.None;
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
      this.osd!.navigator.element.style.display = 'none';
    else this.osd!.navigator.element.style.display = 'inline-block';
    this.isNavigatorVisible = !this.isNavigatorVisible;
  }

  showNav() {
    this.osd!.navigator.element.style.display = 'inline-block';
    this.isNavigatorVisible = true;
  }

  hideNav() {
    this.osd!.navigator.element.style.display = 'none';
    this.isNavigatorVisible = false;
  }

  enterEditMode() {
    this.boundsBeforeEdit = this.osd!.viewport.getBounds();
    this.showNav();
    this.osd!.setControlsEnabled(true);
    let toolbarElem = document.getElementById('toolbarDiv');
    if (toolbarElem) {
      toolbarElem.style.display = 'inline-block';
    }
    this.osd!.setMouseNavEnabled(false);
    this.dragSelect.dragMode = DragMode.Select;
    this.dragSelect.editMode = EditMode.Line;
    this.dragSelect.selectionMode = SelectionMode.Word;
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
      toolbarElem.style.display = 'none';
    }
    this.dragSelect.dragMode = DragMode.None;
    this.dragSelect.editMode = EditMode.None;
    this.dragSelect.isDragging = false;
    this.selectedLines = [];
    this.resetView();
  }

  enterSelectionMode() {
    this.boundsBeforeEdit = this.osd!.viewport.getBounds();
    this.exitEditMode();
    this.showNav();
    this.selectionButtonLabel = 'Exit';
    this.isSelecting = true;
    this.osd!.setMouseNavEnabled(false);
    this.dragSelect.dragMode = DragMode.Select;
    this.dragSelect.selectionMode = SelectionMode.Line;
    this.dragSelect.editMode = EditMode.None;
  }

  exitSelectionMode() {
    this.hideNav();
    this.selectionButtonLabel = 'Select';
    this.isSelecting = false;
    this.dragSelect.dragMode = DragMode.None;
    this.dragSelect.selectionMode = SelectionMode.None;
    this.dragSelect.isDragging = false;
    this.selectedLines = [];
    this.resetView();
  }

  adjustLineItemBounds() {
    this.dragSelect.dragMode = DragMode.AdjustBox;
    this.dragSelect.editMode = EditMode.Line;
    this.isAdjustingBoundingBox = true;
  }

  splitLineItem() {
    this.dragSelect.dragMode = DragMode.Split;
    this.dragSelect.editMode = EditMode.Line;
    this.dragSelect.overlayElement = this.createOverlayElement(
      'split',
      'split-line'
    );
    let location = this.osd!.getOverlayById(
      `boundingBox-${this.selectedLines[0].id}`
    )
      .getBounds(this.osd!.viewport)
      .clone();
    location.x += location.width / 2;
    location.width /= 2;
    this.osd!.addOverlay('split');
    this.osd!.updateOverlay('split', location);
    this.isSplitting = true;
  }

  toggleSelectionMode() {
    if (this.isSelecting) {
      this.exitSelectionMode();
    } else {
      this.enterSelectionMode();
    }
  }

  ngAfterViewInit(): void {
    this.user = this.authenticator.user;
    const id = String(this.route.snapshot.paramMap.get('id'));

    let record$ = from(this.probateRecordService.GetProbateRecord(id));
    let lineItems$ = from(
      this.probateRecordService.LineItemByProbateRecord(
        id,
        undefined,
        ModelSortDirection.ASC,
        undefined,
        1000
      )
    );

    // get our associated image
    this.getImage(id);

    record$.subscribe((record) => {
      this.record = record as ProbateRecord;
      this.reviewedCheckBoxText =
        record.reviewCount > 0 ? 'Publish' : 'Reviewed';
      // check if we are allowed to update this item
      console.log('record');
      console.log(record);
      console.log('user');
      console.log(this.user!.username);
      this.lockedByOtherUser = (record.lockedBy ?? '').length > 0 && this.user!.username != record.lockedBy;
      console.log('locked by other user ', this.lockedByOtherUser);

      for (const word of this.record.words) {
        if (word) {
          this.wordMap.set(word.id, word);
        }
      }

      lineItems$.subscribe((lineItems) => {
        this.record!.lineItems!.items =
          lineItems.items as unknown as LineItem[];

        for (const lineItem of lineItems.items as LineItem[]) {
          this.existingLineIds.add(lineItem.id);
        }
        let lineItemIndex = (
          this.record!.lineItems!.items as LineItem[]
        ).findIndex((l) => l.rowIndex == -1);
        if (lineItemIndex >= 0) {
          this.sortLineItems();
        }
      });
    });
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

  getRelativeMousePosition = function (
    event: PointerEvent,
    target: HTMLElement | null | undefined = undefined
  ) {
    let pointTarget = target || event.target;
    let rect = (pointTarget! as HTMLElement).getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  async getImage(id: string): Promise<void> {
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
    this.osd.addControl('toolbarDiv', {
      anchor: OpenSeadragon.ControlAnchor.TOP_RIGHT,
      autoFade: false,
    });
    this.exitEditMode();
    this.selectTracker = new OpenSeadragon.MouseTracker({
      element: this.osd?.element as Element,
      clickHandler: (event) => {
        var target = (event as any).originalTarget as HTMLElement;
        console.log(target);
        if (target!.matches('input')) {
          target.style.display = 'block';
          target.focus();
          this.dragSelect.selectionMode = SelectionMode.None;
          this.dragSelect.editMode = EditMode.Word;
          this.dragSelect.dragMode = DragMode.None;
          this.osd!.removeOverlay('select');
          this.osd!.setMouseNavEnabled(false);
        } else if (
          target!.matches('button') ||
          target!.matches('span.mdc-button__label')
        ) {
          target.click();
        }
      },
      pressHandler: (event) => {
        let pos = this.getRelativeMousePosition(
          event.originalEvent as PointerEvent,
          this.osd!.canvas
        );
        let viewportPos = this.osd!.viewport.viewerElementToViewportCoordinates(
          new OpenSeadragon.Point(pos.x, pos.y)
        );

        // check if we are in edit mode

        this.dragSelect!.startPos = viewportPos;

        let overlayElement: HTMLElement;
        let line: LineItem;
        let texRect: Rect;
        let osdRect: OpenSeadragon.Rect;

        this.dragSelect.isDragging = true;

        overlayElement = this.createOverlayElement('select');
        this.dragSelect.overlayElement = overlayElement as HTMLElement;
        if (this.dragSelect.editMode === EditMode.Line) {
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
        }

        this.osd!.addOverlay(
          overlayElement,
          new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0)
        );
      },
      dragHandler: (event) => {
        let pos = this.getRelativeMousePosition(
          event.originalEvent as PointerEvent,
          this.osd!.canvas
        );
        let viewportPos = this.osd!.viewport.viewerElementToViewportCoordinates(
          new OpenSeadragon.Point(pos.x, pos.y)
        );
        var diffX = viewportPos.x - this.dragSelect!.startPos.x;
        var diffY = viewportPos.y - this.dragSelect!.startPos.y;

        let location: OpenSeadragon.Rect;
        let line: LineItem;
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

        switch (this.dragSelect.dragMode) {
          case DragMode.Select:
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
            }
            this.osd!.updateOverlay(this.dragSelect!.overlayElement!, location);
            break;

          case DragMode.AdjustBox:
            switch (this.dragSelect.editMode) {
              case EditMode.Line:
                {
                  console.log('adjusting line item box');
                  let selectedLineOverlayName = `boundingBox-${this.selectedLines[0].id}`;
                  let selectedLineBoundingBox = this.osd!.getOverlayById(
                    selectedLineOverlayName
                  ).getBounds(this.osd!.viewport);

                  if (
                    viewportPos.x <
                    selectedLineBoundingBox.x +
                      selectedLineBoundingBox.width / 2
                  ) {
                    selectedLineBoundingBox.width +=
                      selectedLineBoundingBox.x - viewportPos.x;
                    selectedLineBoundingBox.x = viewportPos.x;
                  } else {
                    selectedLineBoundingBox.width -=
                      selectedLineBoundingBox.x +
                      selectedLineBoundingBox.width -
                      viewportPos.x;
                  }

                  if (
                    viewportPos.y <
                    selectedLineBoundingBox.y +
                      selectedLineBoundingBox.height / 2
                  ) {
                    selectedLineBoundingBox.height +=
                      selectedLineBoundingBox.y - viewportPos.y;
                    selectedLineBoundingBox.y = viewportPos.y;
                  } else {
                    selectedLineBoundingBox.height -=
                      selectedLineBoundingBox.y +
                      selectedLineBoundingBox.height -
                      viewportPos.y;
                  }

                  this.osd!.updateOverlay(
                    selectedLineOverlayName,
                    selectedLineBoundingBox
                  );
                }
                break;
              case EditMode.AdjustWordBox:
                let selectedLineBoundingBox = this.osd!.getOverlayById(
                  `boundingBox-${this.selectedLines[0].id}`
                ).getBounds(this.osd!.viewport);
                if (
                  this.osdRectangleContainsOsdRectangle(
                    selectedLineBoundingBox,
                    location
                  )
                ) {
                  this.osd!.updateOverlay(
                    this.dragSelect!.overlayElement!,
                    location
                  );
                }
                break;
            }
            break;
          case DragMode.Split:
            {
              let selectedLineOverlayName = `boundingBox-${this.selectedLines[0].id}`;
              let selectedLineBoundingBox = this.osd!.getOverlayById(
                selectedLineOverlayName
              ).getBounds(this.osd!.viewport);
              if (
                viewportPos.x > selectedLineBoundingBox.x &&
                viewportPos.x <
                  selectedLineBoundingBox.x + selectedLineBoundingBox.width
              ) {
                let splitBox = this.osd!.getOverlayById('split').getBounds(
                  this.osd!.viewport
                );
                splitBox.x = viewportPos.x;
                splitBox.width =
                  selectedLineBoundingBox.width -
                  (splitBox.x - selectedLineBoundingBox.x);
                this.osd!.updateOverlay('split', splitBox);
              }
            }
            break;
        }
      },
      releaseHandler: (event) => {
        let pos = this.getRelativeMousePosition(
          event.originalEvent as PointerEvent,
          this.osd!.canvas
        );
        let viewportPos = this.osd!.viewport.viewerElementToViewportCoordinates(
          new OpenSeadragon.Point(pos.x, pos.y)
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

        switch (this.dragSelect.dragMode) {
          case DragMode.Select:
            switch (this.dragSelect.selectionMode) {
              case SelectionMode.Line:
                switch (this.dragSelect.editMode) {
                  case EditMode.CreateLine:
                    this.createLineItemAtLocationCommand(location);
                    break;
                  default:
                    this.selectedLines = this.getSelectedLines(location);
                    for (const line of this.selectedLines) {
                      const selectElem = this.createOverlayElement(
                        `boundingBox-${line.id}`,
                        'selected-line'
                      );
                      this.osd!.addOverlay(
                        selectElem,
                        this.texRect2osdRect(line.boundingBox!)
                      );
                    }
                }
                break;
              case SelectionMode.Word:
                switch (this.dragSelect.editMode) {
                  case EditMode.CreateWord:
                    this.dragSelect.selectionMode = SelectionMode.None;
                    this.dragSelect.editMode = EditMode.Line;
                    let snapToLocation = this.getSnapToLocation(location);
                    let word = this.createWordAtLocation(snapToLocation);
                    this.focusOnWord(word);
                    this.osd!.removeOverlay('select');
                    this.commands.push({
                      type: CommandType.CreateWord,
                      operation: OperationType.Create,
                      wasDirtyBeforeCommand: this.isDirty,
                      word,
                      lineItemId: this.selectedLines[0].id,
                    });
                    this.isDirty = true;
                    this.table.renderRows();
                    break;
                }
                break;
            }
            break;
          case DragMode.AdjustBox:
            switch (this.dragSelect.editMode) {
              case EditMode.Line:
                {
                  let selectedLineBoundingBox = this.osd!.getOverlayById(
                    `boundingBox-${this.selectedLines[0].id}`
                  ).getBounds(this.osd!.viewport);
                  console.log('updating bounding box');
                  let newBoundingBox = this.osdRect2texRect(
                    selectedLineBoundingBox
                  );
                  this.commands.push({
                    type: CommandType.AdjustLineItemBounds,
                    wasDirtyBeforeCommand: this.isDirty,
                    lineItem: this.selectedLines[0],
                    oldBoundingBox: this.selectedLines[0].boundingBox!,
                    newBoundingBox,
                  });
                  this.selectedLines[0].boundingBox = newBoundingBox;
                  this.updatedLineIds.add(this.selectedLines[0].id);
                  this.isDirty = true;
                }

                break;
            }
            break;
          case DragMode.Split:
            {
              const newLocation = this.osd!.getOverlayById('split').getBounds(
                this.osd!.viewport
              );
              // split line item
              this.splitLineItemAtNewLocation(
                this.selectedLines[0],
                newLocation
              );
            }
            break;
        }
        this.dragSelect.dragMode = DragMode.None;
        this.isAdjustingBoundingBox = false;
        this.isSplitting = false;
      },
    });
  }

  sortLineItems(): void {
    if (this.record?.lineItems?.items) {
      let items: Array<LineItem> = Array.from(
        this.record.lineItems.items as LineItem[]
      );
      let sortedLineItems = items.sort((a, b) => {
        if (a.rowIndex != -1 && b.rowIndex != -1) {
          return a.rowIndex - b.rowIndex;
        } else {
          return a.boundingBox!.top - b.boundingBox!.top;
        }
      });

      for (let i = 0; i < sortedLineItems.length; i++) {
        let lineItem = sortedLineItems[i];
        lineItem.rowIndex = i;
        this.updatedLineIds.add(lineItem.id);
      }

      this.record.lineItems.items = sortedLineItems;
      this.isDirty = true;
    }
  }

  displayContextMenu(event: any): void {
    this.isDisplayContextMenu = true;
    switch (this.selectedLines.length) {
      case 0:
        this.rightClickMenuItems = [
          {
            menuText: 'Create Line',
            menuEvent: CreateLine,
          },
        ];
        break;

      case 1:
        if (event.target.id.startsWith('wordInput-')) {
          let wordId = event.target.id.substring('wordInput-'.length);
          this.selectedWord = (this.record!.words as Word[])
            .filter((w) => w.id == wordId)
            .pop();
          let inputElem = document.getElementById(
            event.target.id
          ) as HTMLInputElement;
          if (inputElem === document.activeElement) {
            this.selectedWord = this.record!.words.find(
              (w) => w!.id === wordId
            );
            this.rightClickMenuItems = [
              {
                menuText: 'Delete Word',
                menuEvent: DeleteWord,
              },
              {
                menuText: 'Adjust Box',
                menuEvent: AdjustWordBox,
              },
              {
                menuText: 'Cancel',
                menuEvent: 'cancel',
              },
            ];
          }
        } else {
          // console.log('showing select lines context menu');
          this.rightClickMenuItems = [
            // {
            //   menuText: 'Split',
            //   menuEvent: 'split',
            // },
            // {
            //   menuText: 'Extend',
            //   menuEvent: 'extend',
            // },
            // {
            //   menuText: 'Shorten',
            //   menuEvent: 'shorten',
            // },
            // {
            //   menuText: 'Expand',
            //   menuEvent: 'expand',
            // },
            {
              menuText: 'Correct Text',
              menuEvent: CorrectText,
            },
            {
              menuText: 'Delete Line',
              menuEvent: DeleteLine,
            },
            {
              menuText: 'Cancel',
              menuEvent: 'cancel',
            },
          ];
        }
        break;
      // default:
      //   this.rightClickMenuItems = [
      //     {
      //       menuText: 'Combine',
      //       menuEvent: 'combine',
      //     },
      //   ];
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

  getOrderedWordsForLineItem(line: LineItem): Word[] {
    let words = (this.record!.words as Word[]).filter((w) =>
      this.selectedLines[0].wordIds.includes(w.id)
    );
    let rows = this.getRowsOfText(words);
    let orderedWords: Word[] = [];
    for (const row of rows) {
      orderedWords = orderedWords.concat(row);
    }

    return orderedWords;
  }

  createWordAtLocation(location: OpenSeadragon.Rect): Word {
    let word = {
      __typename: 'Word',
      text: '',
      id: uuidv4(),
      boundingBox: this.osdRect2texRect(location),
    } as unknown as Word;
    this.record!.words.push(word);
    this.selectedLines[0].wordIds.push(word.id);
    let words = (this.record!.words as Word[]).filter((w) =>
      this.selectedLines[0].wordIds.includes(w.id)
    );
    let rows = this.getRowsOfText(words);
    let orderedIds: string[] = [];
    for (const row of rows) {
      orderedIds = orderedIds.concat(row.map((w) => w.id));
    }
    this.selectedLines[0].wordIds = orderedIds;
    this.showInputsForWords(words);
    this.table.renderRows();
    return word;
  }

  deleteWord(word: Word) {
    this.record!.words = (this.record!.words as Word[]).filter(
      (w) => w.id != word.id
    );
    for (const line of this.record!.lineItems!.items as LineItem[]) {
      if (line.wordIds.includes(word.id)) {
        line.wordIds = line.wordIds.filter((id) => id != word.id);
        this.updateLineItemText(line);
      }
    }

    if (this.isEditing()) {
      // remove our existing overlay
      this.osd!.removeOverlay(`wordInput-${word.id}`);
      let words = (this.record!.words as Word[]).filter((w) =>
        this.selectedLines[0].wordIds.includes(w.id)
      );
      this.showInputsForWords(words);
    }

    this.table.renderRows();
  }

  focusOnWord(word: Word) {
    let inputElem = document.getElementById(`wordInput-${word.id}`);
    if (inputElem) {
      inputElem.focus();
    }
  }

  getSnapToLocation(location: OpenSeadragon.Rect): OpenSeadragon.Rect {
    let words = (this.record!.words as Word[]).filter((w) =>
      this.selectedLines[0].wordIds.includes(w.id)
    );
    // check the appropriate row
    let rows = this.getRowsOfText(words);
    let closestDistance = 2.0;
    let boundingBox = this.osdRect2texRect(location);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const totalTop = row
        .map((w) => w.boundingBox!.top)
        .reduce((previousValue, currentValue) => previousValue + currentValue);
      const avgTop = totalTop / row.length;

      // get average word height
      const totalHeight = row
        .map((w) => w.boundingBox!.height)
        .reduce((previousValue, currentValue) => previousValue + currentValue);

      const avgHeight = totalHeight / row.length;

      let verticalDistance = Math.abs(boundingBox.top - avgTop);
      if (verticalDistance < closestDistance) {
        boundingBox.top = avgTop;
        boundingBox.height = avgHeight;
        closestDistance = verticalDistance;
      }
    }
    return this.texRect2osdRect(boundingBox);
  }

  createLineItemAtLocation(rect: Rect | undefined): LineItem {
    // Use as const with __typename https://github.com/dotansimha/graphql-code-generator/issues/3610
    let newLineItem = {
      __typename: 'LineItem' as const,
      id: uuidv4() as string,
      probateId: '',
      wordIds: new Array<string>(),
      title: '',
      description: '',
      category: '',
      subcategory: '',
      quantity: 0,
      value: 0,
      confidence: 0,
      rowIndex: this.record!.lineItems?.items.length as number,
      lowerTitle: '',
      boundingBox: {
        __typename: 'Rect' as const,
        left: rect?.left || 0,
        top: rect?.top || 0,
        width: rect?.width || 0,
        height: rect?.height || 0,
      },
      attributeForId: '',
      createdAt: '0',
      updatedAt: '0',
    };

    this.newLineIds.add(newLineItem.id);
    return newLineItem;
  }

  showWordInputsForLine(lineItem: LineItem) {
    let words = (this.record!.words as Word[]).filter((w) =>
      lineItem.wordIds.includes(w.id)
    );
    this.showInputsForWords(words);
  }

  createLineItemAtLocationCommand(location: OpenSeadragon.Rect) {
    let lineItem = this.createLineItemAtLocation(
      this.osdRect2texRect(location)
    );
    this.record!.lineItems!.items.push(lineItem);
    this.commands.push({
      type: CommandType.CreateLine,
      operation: OperationType.Create,
      wasDirtyBeforeCommand: this.isDirty,
      lineItem,
    });
    this.isDirty = true;
    this.table.renderRows();
    this.exitSelectionMode();
    this.selectedLines = [];
    this.selectedLines.push(lineItem);
    this.highlightLine(lineItem);
    this.enterEditMode();
  }

  splitLineItemAtNewLocation(
    lineItem: LineItem,
    newLocation: OpenSeadragon.Rect
  ) {
    const newBoundingBox = this.osdRect2texRect(newLocation);
    const oldBoundingBox = { ...lineItem.boundingBox! };
    lineItem.boundingBox!.width =
      newBoundingBox.left - lineItem.boundingBox!.left;
    this.updatedLineIds.add(lineItem.id);

    let newLineItem = this.createLineItemAtLocation(newBoundingBox);

    // move word ids from existing line item to new line item
    let wordIdsToKeep: string[] = [];
    let wordIdsToRemove: string[] = [];
    const lineToSplit = this.selectedLines[0];
    for (const id of lineToSplit.wordIds) {
      const word = this.wordMap.get(id!);
      if (
        this.texRectangleContainsTexRectangle(
          lineToSplit.boundingBox!,
          word!.boundingBox!
        )
      ) {
        wordIdsToKeep.push(word!.id);
      } else {
        wordIdsToRemove.push(word!.id);
      }
    }
    lineItem.wordIds = lineItem.wordIds.filter((w) =>
      wordIdsToKeep.includes(w!)
    );
    lineItem.title = wordIdsToKeep
      .map((w) => this.wordMap.get(w))
      .map((w) => w!.text)
      .join(' ');
    lineItem.lowerTitle = lineItem.title.toLowerCase();
    newLineItem.wordIds = wordIdsToRemove;
    newLineItem.title = wordIdsToRemove
      .map((w) => this.wordMap.get(w))
      .map((w) => w!.text)
      .join(' ');
    newLineItem.lowerTitle = newLineItem.title.toLowerCase();

    this.record!.lineItems!.items.push(newLineItem);
    this.commands.push({
      type: CommandType.SplitLine,
      wasDirtyBeforeCommand: this.isDirty,
      lineItem,
      newLineItem,
      oldBoundingBox,
      newBoundingBox,
    });
    this.isDirty = true;
    this.table.renderRows();
    this.exitEditMode();
    this.selectedLines = [];
    this.selectedLines.push(newLineItem);
    this.highlightLine(newLineItem);
    this.correctText();
    this.enterEditMode();
  }

  handleMenuItemClick(event: any) {
    let selectOverlay = this.osd!.getOverlayById('select');
    let location = selectOverlay
      ? this.osd!.getOverlayById('select').getBounds(this.osd!.viewport)
      : new OpenSeadragon.Rect(0, 0, 0, 0);
    switch (event.data) {
      case CreateWord:
        let snapToLocation = this.getSnapToLocation(location);
        let word = this.createWordAtLocation(snapToLocation);
        this.focusOnWord(word);
        this.osd!.removeOverlay('select');
        this.commands.push({
          type: CommandType.CreateWord,
          operation: OperationType.Create,
          wasDirtyBeforeCommand: this.isDirty,
          word,
          lineItemId: this.selectedLines[0].id,
        });
        this.isDirty = true;
        this.table.renderRows();
        break;
      case DeleteWord:
        if (this.selectedWord) {
          this.deleteWord(this.selectedWord);
          this.commands.push({
            type: CommandType.DeleteWord,
            operation: OperationType.Delete,
            wasDirtyBeforeCommand: this.isDirty,
            word: this.selectedWord,
            lineItemId: this.selectedLines[0].id,
          });
          this.selectedWord = null;
          this.isDirty = true;
          this.table.renderRows();
        }
        break;
      case CreateLine:
        {
          this.createLineItemAtLocationCommand(location);
        }
        break;
      case DeleteLine:
        {
          this.bulkDeleteLines(this.selectedLines);
          this.osd!.clearOverlays();
        }
        break;
      case CorrectText:
        this.highlightLine(this.selectedLines[0]);
        this.showWordInputsForLine(this.selectedLines[0]);
        this.enterEditMode();
        break;

      case AdjustWordBox:
        let selectedWordBoundsElem = this.createOverlayElement(
          `boundingBox-${this.selectedWord!.id}`,
          'highlighted-word'
        );
        const rect = this.texRect2osdRect(this.selectedWord!.boundingBox!);
        this.osd!.addOverlay(selectedWordBoundsElem, rect);
        this.dragSelect.dragMode = DragMode.AdjustBox;
        this.dragSelect.editMode = EditMode.AdjustWordBox;
        this.dragSelect.selectionMode = SelectionMode.Word;
        this.dragSelect.overlayElement = selectedWordBoundsElem;
        break;
    }
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
      this.updateLineItemText(this.selectedLines[0]);
    });

    this.renderer.listen(inputElem, 'keyup.enter', () => {
      console.log('keyup handler called');
      // if we don't have a value
      console.log(inputElem);
      let value = console.log((inputElem as HTMLInputElement).value);
      console.log(value);
    });

    this.renderer.listen(inputElem, 'focus', () => {
      // this.activeWord = word;
    });

    this.renderer.appendChild(document.body, inputElem);
    return inputElem;
  }

  createInputBoxForWord(word: Word) {
    // clear all other overlays
    // this.osd!.clearOverlays();

    // check if the element exists
    const inputId = `wordInput-${word.id}`;

    let inputElem = document.getElementById(inputId);

    if (!inputElem) {
      inputElem = this.createInputForWord(word);
    }

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
    const selectedLineBoundingBox = this.osd!.getOverlayById(
      `boundingBox-${this.selectedLines[0].id}`
    ).getBounds(this.osd!.viewport);
    const rows = this.getRowsOfText(words);
    let top: number;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
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

        // rect.y = top;

        rect.y = selectedLineBoundingBox.y;
        if (isInputAbove) {
          rect.y -= inputHeight * (rows.length - rowIndex);
        } else {
          rect.y += selectedLineBoundingBox.height + inputHeight * rowIndex;
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
    line.title = updatedText;

    this.isDirty = true;
    this.updatedLineIds.add(line.id);
  }

  editLineItemByIndex(index: number): void {
    let lineItem: LineItem | null = null;
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

  deleteLineItemByIndex(index: number): void {}

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

  createOverlayElement(
    id: string,
    className = 'highlighted-line'
  ): HTMLElement {
    let overlay = document.getElementById(id);
    if (overlay) {
      this.osd?.removeOverlay(id);
      overlay.remove();
    }

    overlay = this.renderer.createElement('div') as HTMLElement;
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
    if (!this.boundsBeforeEdit) {
      this.osd!.viewport.goHome();
      this.boundsBeforeEdit = this.osd!.viewport.getBounds();
    } else {
      this.osd!.viewport.fitBounds(this.boundsBeforeEdit);
    }
    this.osd!.clearOverlays();
    this.osd!.setControlsEnabled(false);
    this.osd!.setMouseNavEnabled(true);
  }

  onUpdatedLineItem(lineItemId: string) {
    this.updatedLineIds.add(lineItemId);
    this.isDirty = true;
  }

  onCategoryChanged(event: Event): void {
    let selectElem = event.target as HTMLSelectElement;
    let lineItemId = selectElem.id.substring('category-'.length);
    const category = selectElem.value;
    let subcategories = this.categoryMap.get(category);
    console.log(subcategories);
    let subcategorySelect = document.getElementById(
      'subcategory-' + lineItemId
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
    let lineItem = (this.record!.lineItems!.items as LineItem[]).find(
      (l) => l.id === lineItemId
    );
    if (lineItem) {
      lineItem.category = category;
      this.onUpdatedLineItem(lineItemId);
    }
  }

  onSubcategoryChanged(event: Event): void {
    let selectElem = event.target as HTMLSelectElement;
    let lineItemId = selectElem.id.substring('subcategory-'.length);
    let lineItem = (this.record!.lineItems!.items as LineItem[]).find(
      (l) => l.id === lineItemId
    );
    if (lineItem) {
      lineItem!.subcategory = selectElem.value;
      this.onUpdatedLineItem(lineItemId);
    }
  }

  onQuantityChanged(event: Event): void {
    let inputElem = event.target as HTMLInputElement;
    let lineItemId = inputElem.id.substring('quantity-'.length);
    let lineItem = (this.record!.lineItems!.items as LineItem[]).find(
      (l) => l.id === lineItemId
    );
    if (lineItem) {
      lineItem!.quantity = Number.parseInt(inputElem.value);
      if (isNaN(lineItem!.quantity)) {
        lineItem!.quantity = 1;
      }
      this.onUpdatedLineItem(lineItemId);
    }
  }

  onValueChanged(event: Event): void {
    let inputElem = event.target as HTMLInputElement;
    let lineItemId = inputElem.id.substring('value-'.length);
    let lineItem = (this.record!.lineItems!.items as LineItem[]).find(
      (l) => l.id === lineItemId
    );
    if (lineItem) {
      lineItem.value = Number.parseFloat(inputElem.value);
      if (isNaN(lineItem.value)) {
        lineItem.value = 0.0;
      }
      this.onUpdatedLineItem(lineItemId);
    }
  }

  drop(event: CdkDragDrop<LineItem[]>) {
    let lineItem = this.record!.lineItems!.items[
      event.previousIndex
    ] as LineItem;
    lineItem.rowIndex = event.currentIndex;
    this.updatedLineIds.add(lineItem.id);
    moveItemInArray(
      this.record!.lineItems!.items,
      event.previousIndex,
      event.currentIndex
    );
    this.commands.push({
      type: CommandType.MoveLine,
      lineItem,
      wasDirtyBeforeCommand: this.isDirty,
      oldIndex: event.previousIndex,
      newIndex: event.currentIndex,
    });
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

  texRectangleContainsTexRectangle(a: Rect, b: Rect) {
    return (
      a.left <= b.left &&
      a.top <= b.top &&
      a.left + a.width >= b.left + b.width &&
      a.top + a.height >= b.top + b.height
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

  osdRectangleContainsOsdPoint(a: OpenSeadragon.Rect, b: OpenSeadragon.Point) {
    return (
      a.x <= b.x && a.y <= b.y && a.x + a.width >= b.x && a.y + a.height >= b.y
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

    let confirmation = '';
    dialogRef.afterClosed().subscribe((result) => {
      confirmation = result;
    });

    return confirmation;
  }

  deleteLine(lineItem: LineItem) {
    this.isDirty = true;
    this.deletedLines.push(lineItem);
    let wordsToDelete = (this.record!.words as Word[]).filter((w) =>
      lineItem.wordIds.includes(w.id)
    );
    this.deletedLineWordsMap.set(lineItem.id, wordsToDelete);
    this.record!.words = (this.record!.words as Word[]).filter(
      (w) => !lineItem.wordIds.includes(w.id)
    );
    if (this.newLineIds.has(lineItem.id)) {
      this.newLineIds.delete(lineItem.id);
    }
    if (this.updatedLineIds.has(lineItem.id)) {
      this.updatedLineIds.delete(lineItem.id);
    }
    this.deletedLineIds.add(lineItem.id);
  }

  // Commands
  undo() {
    if (this.commands.length > 0) {
      let command = this.commands.pop();
      switch (command!.type) {
        case CommandType.BulkDelete:
          {
            let bulkCommand = command as BulkLineItemCommand;
            for (const lineItem of bulkCommand.lineItems) {
              let index = bulkCommand.lineItemIndexMap.get(lineItem.id);
              this.record!.lineItems!.items.splice(index!, 0, lineItem);
              this.record!.words = this.record!.words.concat(
                bulkCommand.wordMap.get(lineItem.id) as Word[]
              );
              if (!this.existingLineIds.has(lineItem.id)) {
                this.newLineIds.add(lineItem.id);
              } else {
                this.updatedLineIds.add(lineItem.id);
              }
              if (this.deletedLineIds.has(lineItem.id)) {
                this.deletedLineIds.delete(lineItem.id);
              }
            }
          }
          break;
        case CommandType.CreateWord:
          {
            let wordCommand = command as WordCommand;
            this.record!.words = (this.record!.words as Word[]).filter(
              (w) => w.id != wordCommand.word.id
            );
            for (const lineItem of this.record!.lineItems!
              .items as LineItem[]) {
              if (lineItem.wordIds.includes(wordCommand.word.id)) {
                lineItem.wordIds = (lineItem.wordIds as string[]).filter(
                  (id) => id != wordCommand.word.id
                );
                this.updateLineItemText(lineItem);
              }
            }
            console.log('is editing is ' + this.isEditing());
            if (this.isEditing()) {
              console.log('removing ');
              console.log(wordCommand.word);
              this.osd!.removeOverlay(`wordInput-${wordCommand.word.id}`);
            }
          }
          break;
        case CommandType.DeleteWord:
          {
            let wordCommand = command as WordCommand;
            let word = wordCommand.word;
            this.record!.words.push(word);
            let lineItem = (this.record!.lineItems!.items as LineItem[]).find(
              (l) => l.id === wordCommand.lineItemId
            );
            if (lineItem) {
              lineItem.wordIds.push(word.id);
              let orderedWords = this.getOrderedWordsForLineItem(lineItem);
              lineItem.wordIds = orderedWords.map((w) => w.id);
              this.updateLineItemText(lineItem);

              if (this.isEditing()) {
                this.showInputsForWords(orderedWords);
              }
            }
          }
          break;

        case CommandType.CreateLine:
          {
            let lineItemCommand = command as LineItemCommand;
            let lineItem = lineItemCommand.lineItem;
            this.record!.words = (this.record!.words as Word[]).filter(
              (w) => !lineItem.wordIds.includes(w.id)
            );
            this.record!.lineItems!.items = (
              this.record!.lineItems!.items as LineItem[]
            ).filter((l) => l.id != lineItem.id);
            this.newLineIds.delete(lineItem.id);

            if (this.isEditing()) {
              this.osd!.removeOverlay(`boundingBox-${lineItem.id}`);
              this.exitEditMode();
            }
          }
          break;
        case CommandType.MoveLine:
          {
            let moveLineItemCommand = command as MoveLineItemCommand;
            let currentIndex = (
              this.record!.lineItems!.items as LineItem[]
            ).indexOf(moveLineItemCommand.lineItem);
            if (currentIndex >= 0) {
              moveItemInArray(
                this.record!.lineItems!.items,
                currentIndex,
                moveLineItemCommand.oldIndex
              );
            }
          }
          break;
        case CommandType.DeleteLine:
          {
          }
          break;

        case CommandType.MarkAsReviewed:
          {
            this.isReviewed = false;
          }
          break;

        case CommandType.UnmarkAsReviewed:
          {
            this.isReviewed = true;
          }
          break;
        case CommandType.AdjustLineItemBounds:
          {
            let adjustLineItemBoundsCommand =
              command as AdjustLineItemBoundsCommand;
            adjustLineItemBoundsCommand.lineItem.boundingBox =
              adjustLineItemBoundsCommand.oldBoundingBox;
            // update overlay
            this.osd!.updateOverlay(
              `boundingBox-${adjustLineItemBoundsCommand.lineItem.id}`,
              this.texRect2osdRect(
                adjustLineItemBoundsCommand.lineItem.boundingBox
              )
            );
            console.log('undoing box adjustment');
          }
          break;

        case CommandType.SplitLine:
          {
            let splitLineCommand = command as SplitLineItemCommand;
            // restore old bounding box
            splitLineCommand.lineItem.boundingBox =
              splitLineCommand.oldBoundingBox;
            this.osd!.updateOverlay(
              `boundingBox-${splitLineCommand.lineItem.id}`,
              this.texRect2osdRect(splitLineCommand.lineItem.boundingBox)
            );

            // move all words from new line item to old line item
            for (const id of splitLineCommand.newLineItem.wordIds) {
              splitLineCommand.lineItem.wordIds.push(id);
            }
            splitLineCommand.lineItem.title = splitLineCommand.lineItem.wordIds
              .map((w) => this.wordMap.get(w!))
              .map((w) => w!.text)
              .join(' ');
            splitLineCommand.lineItem.lowerTitle =
              splitLineCommand.lineItem.title.toLowerCase();

            // remove newly created line
            const newLineItem = splitLineCommand.newLineItem;
            this.record!.lineItems!.items = (
              this.record!.lineItems!.items as LineItem[]
            ).filter((l) => l.id != newLineItem.id);
            this.newLineIds.delete(newLineItem.id);

            // remove bounding box for new line
            if (this.isEditing()) {
              this.osd!.removeOverlay(`boundingBox-${newLineItem.id}`);
              this.exitEditMode();
            }
          }
          break;
        case CommandType.CombineLineItems:
          {
            let combineLineItemsCommand = command as CombineLineItemsCommand;
            const lineItem = combineLineItemsCommand.lineItem;
            lineItem.wordIds = combineLineItemsCommand.originalWordIds;
            lineItem.boundingBox = combineLineItemsCommand.originalBoundingBox;
            this.record!.lineItems!.items =
              this.record!.lineItems!.items.concat(
                combineLineItemsCommand.oldLineItems
              );
            lineItem.title = lineItem.wordIds
              .map((w) => this.wordMap.get(w!))
              .map((w) => w!.text)
              .join(' ');
            lineItem.lowerTitle = lineItem.title.toLowerCase();
            for (const deletedLineItem of combineLineItemsCommand.oldLineItems) {
              this.deletedLineIds.delete(deletedLineItem.id);
            }
          }
          break;
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
    console.log(lineItemsToDelete);
    for (const lineItem of lineItemsToDelete) {
      lineItems.push({ ...lineItem });
      let words = (this.record!.words as Word[]).filter((w) =>
        lineItem.wordIds.includes(w.id)
      );
      wordMap.set(lineItem.id, words);
      wordIds = wordIds.concat(words.map((w) => w.id));
      const index = this.record!.lineItems!.items.indexOf(lineItem);
      lineItemIndexMap.set(lineItem.id, index);
      this.deletedLineIds.add(lineItem.id);
    }
    this.commands.push({
      type: CommandType.BulkDelete,
      operation: OperationType.Delete,
      wasDirtyBeforeCommand: this.isDirty,
      lineItems,
      wordMap,
      lineItemIndexMap,
    });

    // Remove LineItems and Words
    let lineIds = lineItemsToDelete.map((l) => l.id);
    this.record!.lineItems!.items = (
      this.record!.lineItems!.items as LineItem[]
    ).filter((l) => !lineIds.includes(l.id));
    this.record!.words = (this.record!.words as Word[]).filter(
      (w) => !wordIds.includes(w.id)
    );

    this.isDirty = true;
  }

  deleteCheckedLines() {
    let dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      height: '260px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        let lineIds: string[] = [];
        // get checked checkboxes
        let checkedBoxes = (this.checkBoxes as QueryList<MatCheckbox>).filter(
          (c: MatCheckbox) => c.checked == true
        );
        for (const checkedBox of checkedBoxes) {
          let lineId = checkedBox.id.substring('check-'.length);
          lineIds.push(lineId);
        }

        let linesToDelete = (
          this.record!.lineItems!.items as LineItem[]
        ).filter((l) => lineIds.includes(l.id));
        this.bulkDeleteLines(linesToDelete);

        this.isLineChecked = false;
      }
    });
  }

  onCreateLineItem() {
    const doNotShowCreateLineHelp =
      this.cookieService.get('doNotShowCreateLineHelp')?.toLocaleLowerCase() ===
      'true';
    if (!doNotShowCreateLineHelp) {
      let dialogRef = this.dialog.open(HelpDialogComponent, {
        height: '260px',
        width: '400px',
        data: 'Drag select the bounding box for the new line item',
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.cookieService.set('doNotShowCreateLineHelp', result);
      });
    }
    this.enterSelectionMode();
    this.dragSelect.editMode = EditMode.CreateLine;
  }

  onCombineLineItems() {
    // let user select which text to include for combination
    const dialogRef = this.dialog.open(CombineLineDialogComponent, {
      data: this.selectedLines,
      height: '90%',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.length === 0) {
        return;
      }
      // get new bounding box
      const leftBound = this.selectedLines
        .map((l) => l.boundingBox!.left)
        .reduce((a, c) => Math.min(a, c));
      const rightBound = this.selectedLines
        .map((l) => l.boundingBox!.left + l.boundingBox!.width)
        .reduce((a, c) => Math.max(a, c));
      const upperBound = this.selectedLines
        .map((l) => l.boundingBox!.top)
        .reduce((a, c) => Math.min(a, c));
      const lowerBound = this.selectedLines
        .map((l) => l.boundingBox!.top + l.boundingBox!.height)
        .reduce((a, c) => Math.max(a, c));

      let combinedLineItem = result[0];
      let originalWordIds = [...combinedLineItem.wordIds] as string[];
      let originalBoundingBox = { ...combinedLineItem.boundingBox } as Rect;

      combinedLineItem.boundingBox = {
        __typename: 'Rect',
        left: leftBound,
        top: upperBound,
        width: rightBound - leftBound,
        height: lowerBound - upperBound,
      };
      let uniqueWords = new Set<string>(
        result.flatMap((w) => w.wordIds as string[])
      );
      console.log('words');
      console.log(uniqueWords);

      // add all word ids to first line item
      combinedLineItem.wordIds = Array.from(uniqueWords);

      // update text
      combinedLineItem.title = combinedLineItem.wordIds
        .map((w) => this.wordMap.get(w!))
        .map((w) => w!.text)
        .join(' ');

      console.log('new title');
      console.log(combinedLineItem.title);
      combinedLineItem.lowerTitle = combinedLineItem.title.toLowerCase();
      this.updatedLineIds.add(combinedLineItem.id);

      // remove old lines
      const linesToRemove = this.selectedLines.filter(
        (l) => l.id != combinedLineItem.id
      );
      const removedLineIds = linesToRemove.map((l) => l.id);

      // remove other line items
      this.record!.lineItems!.items = (
        this.record!.lineItems!.items as LineItem[]
      ).filter((l) => !removedLineIds.includes(l.id));

      // mark them for deletion
      for (const lineToDelete of removedLineIds) {
        this.deletedLineIds.add(lineToDelete);
      }

      // add command
      this.commands.push({
        type: CommandType.CombineLineItems,
        wasDirtyBeforeCommand: this.isDirty,
        lineItem: combinedLineItem,
        oldLineItems: linesToRemove,
        originalWordIds,
        originalBoundingBox,
      });

      this.isDirty = true;
      // refresh our displayed rows
      this.table.renderRows();
      this.exitEditMode();
      this.selectedLines = [];
      this.selectedLines.push(combinedLineItem);
      this.highlightLine(combinedLineItem);
      this.correctText();
      this.enterEditMode();
    });
  }

  onCreateWord() {
    const doNotShowCreateLineHelp =
      this.cookieService.get('doNotShowCreateWordHelp')?.toLocaleLowerCase() ===
      'true';
    if (!doNotShowCreateLineHelp) {
      let dialogRef = this.dialog.open(HelpDialogComponent, {
        height: '260px',
        width: '400px',
        data: 'Drag select the bounding box for the new word',
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.cookieService.set('doNotShowCreateWordHelp', result);
      });
    }
    this.dragSelect.editMode = EditMode.CreateWord;
    this.dragSelect.selectionMode = SelectionMode.Word;
    this.dragSelect.dragMode = DragMode.Select;
  }

  mapToUpdateLineItemInput(
    lineItems: LineItem[]
  ): UpdateLineItemInput[] | CreateLineItemInput {
    return lineItems
      ? lineItems.map((l) => ({
          id: l.id,
          probateId: this.record!.id,
          wordIds: l.wordIds,
          title: l.title,
          description: l.description,
          category: l.category,
          subcategory: l.subcategory,
          quantity: l.quantity,
          value: l.value,
          boundingBox: {
            left: l.boundingBox!.left,
            top: l.boundingBox!.top,
            width: l.boundingBox!.width,
            height: l.boundingBox!.height,
          },
          attributeForId: l.attributeForId,
          rowIndex: l.rowIndex,
          confidence: l.confidence,
          lowerTitle: l.lowerTitle,
        }))
      : [];
  }

  async save() {
    try {
      console.log('starting save');
      // create line items
      let createLineItems = (
        this.record!.lineItems!.items as LineItem[]
      ).filter((l) => this.newLineIds.has(l.id));
      let createLineItemInputs = this.mapToUpdateLineItemInput(
        createLineItems
      ) as CreateLineItemInput[];
      for (const createdLineItemInput of createLineItemInputs) {
        let response = await this.probateRecordService.CreateLineItem(
          createdLineItemInput
        );
      }

      // update line items
      let updateLineItems = (
        this.record!.lineItems!.items as LineItem[]
      ).filter((l) => this.updatedLineIds.has(l.id));
      let updatedLineItemInputs = this.mapToUpdateLineItemInput(
        updateLineItems
      ) as UpdateLineItemInput[];
      console.log('updating ' + updateLineItems.length + ' lines');
      for (const updatedLineItemInput of updatedLineItemInputs) {
        console.log('updatedLineItemInput');
        console.log(updatedLineItemInput);
        if (updatedLineItemInput.quantity == null) {
          console.log('quantity is null');
        }
        let response = await this.probateRecordService.UpdateLineItem(
          updatedLineItemInput
        );
        console.log(response);
      }

      // delete line items
      this.deletedLineIds.forEach(async (id) => {
        let response = await this.probateRecordService.DeleteLineItem({ id });
      });

      // update record
      let updatedWords = (Array.from(this.record!.words) as Word[]).map(
        (w) => ({
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
        })
      );
      let reviewCount = this.record!.reviewCount;
      if (this.isReviewed) {
        reviewCount++;
      }
      let item = { id: this.record!.id, reviewCount, words: updatedWords };
      let response = await this.probateRecordService.UpdateProbateRecord(item);
      this.record = response as ProbateRecord;
      this.reviewedCheckBoxText =
        this.record.reviewCount > 0 ? 'Publish' : 'Reviewed';
      this.isReviewed = false;
      this.isDirty = false;
      console.log(response);
      alert('record updated');
    } catch (e) {
      if (e instanceof Error) {
        alert((e as Error).message);
      } else {
        alert('An error has occurred during save');
      }
    }
  }
}
