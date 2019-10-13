import {Component, Element, Event, EventEmitter, h, Prop, State, Watch} from '@stencil/core';
import {filter, map} from "lodash-es";

@Component({
  tag: 'ro-multi-combobox',
  styleUrl: './multicombobox.css',
  shadow: true
})
export class MultiCombobox {

  static readonly SELECT_ALL = 'Select all';

  @Element() el: HTMLElement;

  private inputEl: HTMLInputElement;

  @State() forceRendering = false;
  @State() errorFound = false;
  @State() isOpened = false;
  @State() itemPrefix = '';
  @State() selectedItems = new Set<string>();

  private itemsSet: Set<string>;

  @Prop({mutable: true}) required = false;
  @Prop({mutable: true}) disabled = false;
  @Prop({mutable: true}) items: string[] = [];

  @Event() selectionChanged: EventEmitter<Set<string>>;

  private closeComboBoxEventListener: EventListener;

  // ------------------------------------------------------------------------------------

  @Watch('items')
  itemsChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this._init();
    }
  }

  _init() {
    this.itemsSet = new Set<string>(this.items);
    this.selectedItems = new Set<string>();
    this.isOpened = false;
    this.itemPrefix = '';

    this._adjustValueInInputField();
    this._onSelectionChanged();
  }

  // ------------------------------------------------------------------------------------

  hostData() {
    if (this.required && this.selectedItems.size == 0) {
      this.errorFound = true;
    }
  }

  render() {
    let dropdown;

    if (this.isOpened) {
      const filteredItems = this._getFilteredItems();
      const selectAllClazz = this._allItemsSelected() ? 'selected' : '';
      const dropdownNeeded = filteredItems.length > 0 && !this.disabled;

      if (dropdownNeeded) {
        dropdown = (
          <div class="dropdown-menu">
            <ul onClick={this.onListItemClick.bind(this)}>
              <li class={selectAllClazz}>{MultiCombobox.SELECT_ALL}</li>
              {map(filteredItems, (item, index) => {
                const style = {'top': ((index + 1) * 30) + 'px'};
                const clazz = this.selectedItems.has(item) ? 'selected' : '';

                return <li style={style} class={clazz}>{item}</li>
              })}
            </ul>
          </div>
        )
      }
    }

    return [
      <div class={this._buildComboboxClasses(dropdown !== undefined)}>
        <input type='text'
               disabled={this.disabled}
               onClick={this.onInputClick.bind(this)}
               onKeyUp={this.onKeyPressed.bind(this)}
               ref={el => this.inputEl = el}/>
        <button type='button'
                disabled={this.disabled}
                onClick={this.onButtonClick.bind(this)}>#
        </button>
      </div>,
      <div class="dropdown">
        {dropdown}
      </div>
    ]
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
    this.inputEl.value = Array.from(this.selectedItems).join(',');
    this.errorFound = false;
  }

  _onSelectionChanged() {
    this.forceRendering = !this.forceRendering;
    this.selectionChanged.emit(this.selectedItems);
  }

  _getCurrentItem() {
    const text = this.inputEl.value;
    const cursorPosition = this.inputEl.selectionStart;

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
    map(this.inputEl.value.split(','), item => item.trim())
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

    if (itemClicked == MultiCombobox.SELECT_ALL) {
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

  // ------------------------------------------------------------------------------------

  _closeComboBox() {
    if (this.isOpened) {
      this.isOpened = false;
    }
  }

  componentDidLoad() {
    this._init();

    this.closeComboBoxEventListener = this._closeComboBox.bind(this);
    document.addEventListener('click', this.closeComboBoxEventListener);
  }

  componentDidUnload() {
    document.removeEventListener('click', this.closeComboBoxEventListener);
  }
}
