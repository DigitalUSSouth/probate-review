import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ContextMenuModel } from "../interfaces/context-menu-model";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.sass']
})
export class ContextMenuComponent {
  @Input() 
  contextMenuItems?: Array<ContextMenuModel>;

  @Output() 
  onContextMenuItemClick: EventEmitter<any> = new EventEmitter<any>();


  onContextMenuClick(event: any, data: any): any {
    this.onContextMenuItemClick.emit({
      event,
      data,
    });
  }

}
