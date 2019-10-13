import {
  AfterContentChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {filter, map} from "lodash-es";

@Component({
  selector: 'ro-multi-combobox',
  template: `
      <div [ngClass]="dropdownClass">
          <input type='text' #inputRef
                 (click)="onInputClick($event)"
                 (keyup)="onKeyPressed($event)"
                 [disabled]="disabled"/>
          <button type='button'
                  [disabled]="disabled"
                  (click)="onButtonClick($event)">#
          </button>
      </div>
      <div class="dropdown">
          <div class="dropdown-menu" *ngIf="isOpened && dropdownNeeded">
              <ul (click)="onListItemClick($event)">
                  <li [ngClass]="selectAllClazz">{{SELECT_ALL}}</li>
                  <li *ngFor="let item of filteredItems; let i = index"
                      [ngStyle]="{'top': ((i + 1) * 30) + 'px'}"
                      [ngClass]="{'selected': selectedItems.has(item)}">{{item}}</li>
              </ul>
          </div>
      </div>
  `,
  styleUrls: ['./multicombobox.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class MultiComboBoxComponent implements AfterContentChecked, OnDestroy, OnInit, OnChanges {

  readonly SELECT_ALL = 'Select All';

  @ViewChild('inputRef', {static: false})
  private inputEl: ElementRef;

  private errorFound = false;
  private isOpened = false;
  private itemPrefix = '';
  private selectedItems = new Set<string>();

  private filteredItems: string[] = [];
  private dropdownNeeded = false;
  private dropdownClass = '';
  private selectAllClazz = '';

  private itemsSet: Set<string>;

  @Input() disabled = false;
  @Input() required = false;
  @Input() items: string[] = [];

  @Output() selectionChanged = new EventEmitter<Set<string>>();

  private closeComboBoxEventListener: EventListener;

  // ------------------------------------------------------------------------------------

  ngOnInit() {
    this.closeComboBoxEventListener = this._closeComboBox.bind(this);
    document.addEventListener('click', this.closeComboBoxEventListener);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeComboBoxEventListener);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.itemsSet = new Set<string>(changes.items.currentValue);
      this.selectedItems = new Set<string>();
      this.isOpened = false;
      this.itemPrefix = '';
      this._adjustValueInInputField();
      this._onSelectionChanged();
    }
  }

  ngAfterContentChecked(): void {
    this.filteredItems = this._getFilteredItems();
    this.dropdownNeeded = this.filteredItems.length > 0 && !this.disabled;
    this.selectAllClazz = this._allItemsSelected() ? 'selected' : '';
    this.dropdownClass = this._buildComboboxClasses(this.dropdownNeeded);

    if (this.required && this.selectedItems.size == 0) {
      this.errorFound = true;
    }
  }

  // ------------------------------------------------------------------------------------

  _getFilteredItems() {
    if (!this.itemPrefix) {
      return this.items;
    }

    return filter(this.items, (item) => item.startsWith(this.itemPrefix))
  }

  _buildComboboxClasses(hasFilteredItems: boolean) {
    let result = 'controls';

    if (hasFilteredItems) {
      result += ' opened';
    }

    if (this.errorFound) {
      result += ' error';
    }

    return result;
  }

  _allItemsSelected() {
    return this.selectedItems.size == this.items.length;
  }

  _adjustValueInInputField() {
    this.inputEl.nativeElement.value = Array.from(this.selectedItems).join(',');
    this.errorFound = false;
  }

  _onSelectionChanged() {
    this.selectionChanged.emit(this.selectedItems);
  }

  _getCurrentItem() {
    const text = this.inputEl.nativeElement.value;
    const cursorPosition = this.inputEl.nativeElement.selectionStart;

    let prevComma = text.lastIndexOf(',', cursorPosition - 1);
    let nextComma = text.indexOf(',', cursorPosition);

    if (nextComma == -1) {
      nextComma = text.length;
    }

    let item = text.substr(prevComma + 1, nextComma - prevComma - 1).trim();
    return this.itemsSet.has(item) ? '' : item;
  }

  // ------------------------------------------------------------------------------------

  onButtonClick(event: Event) {
    this.isOpened = !this.isOpened;
    event.stopPropagation();
  }

  onInputClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onKeyPressed(event: KeyboardEvent) {
    this.errorFound = false;
    this.isOpened = true;
    this.itemPrefix = this._getCurrentItem();

    let newSelectedItems = new Set<string>();
    map(this.inputEl.nativeElement.value.split(','), item => item.trim())
      .forEach(item => {
        if (this.itemsSet.has(item)) {
          newSelectedItems.add(item);
        } else if (item !== '') {
          this.errorFound = true;
        }
      });

    this.selectedItems = newSelectedItems;
    this._onSelectionChanged();

    event.stopPropagation();
  }

  onListItemClick(event: MouseEvent) {
    const itemClicked = (event.target as HTMLLIElement).textContent;

    if (itemClicked == this.SELECT_ALL) {
      if (this._allItemsSelected()) {
        this.selectedItems.clear();
      } else {
        this.items.forEach(item => this.selectedItems.add(item));
      }
    } else {
      if (this.selectedItems.has(itemClicked)) {
        this.selectedItems.delete(itemClicked);
      } else {
        this.selectedItems.add(itemClicked);
      }
    }

    this._adjustValueInInputField();
    this._onSelectionChanged();

    event.stopPropagation();
  }

  _closeComboBox() {
    if (this.isOpened) {
      this.isOpened = false;
    }
  }
}
