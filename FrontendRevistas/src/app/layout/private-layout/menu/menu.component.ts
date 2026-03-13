import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnChanges {
  @Input() menu: any[] = [];
  @Output() funcion = new EventEmitter<boolean>();
  @Output() optionSelected = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menu']?.currentValue) {
      this.initializeCollapse(changes['menu'].currentValue);
    }
  }

  trackByMenu(index: number, item: any): any {
    return item?.id ?? item?.titulo ?? index;
  }

  hasChildren(item: any): boolean {
    return !!item?.menu && Array.isArray(item.menu) && item.menu.length > 0;
  }

  onItemClick(event: Event, item: any): void {
    event.stopPropagation();

    if (this.hasChildren(item)) {
      this.toggleItem(item);
      return;
    }

    this.optionSelected.emit(item);
    this.funcion.emit(false);
  }

  toggleItem(item: any): void {
    item.collapsed = !item.collapsed;
  }

  getItemClasses(item: any, level: number): string[] {
    return [
      'menu-node__trigger',
      `menu-node__trigger--level-${level}`,
      this.hasChildren(item) ? 'menu-node__trigger--parent' : 'menu-node__trigger--leaf',
      !item?.collapsed && this.hasChildren(item) ? 'menu-node__trigger--expanded' : ''
    ];
  }

  private initializeCollapse(menu: any[]): void {
    menu.forEach((item) => {
      if (item.collapsed === undefined || item.collapsed === null) {
        item.collapsed = true;
      }

      if (this.hasChildren(item)) {
        this.initializeCollapse(item.menu);
      }
    });
  }
}