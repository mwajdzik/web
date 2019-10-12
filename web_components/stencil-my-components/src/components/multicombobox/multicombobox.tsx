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

  inputEl: HTMLInputElement;
  buttonEl: HTMLButtonElement;

  @State() modified = false;
  @State() error = false;
  @State() isOpened = false;
  @State() itemPrefix = '';
  @State() selectedItems = new Set<string>();

  itemsSet: Set<string>;

  @Prop({mutable: true}) required = false;
  @Prop({mutable: true}) disabled = false;
  @Prop({mutable: true}) items: string[] = [];

  @Event() selectionChanged: EventEmitter<Set<string>>;

  closeComboBoxEventListener: EventListener;

  // ------------------------------------------------------------------------------------

  @Watch('items')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.init();
    }
  }

  init() {
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
      this.error = true;
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
                onClick={this.onButtonClick.bind(this)}
                ref={el => this.buttonEl = el}>#
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

    if (this.error) {
      result += ' error';
    }

    return result;
  }

  _allItemsSelected() {
    return this.selectedItems.size == this.items.length;
  }

  onButtonClick(event: Event) {
    this.isOpened = !this.isOpened;
    event.stopPropagation();
  }

  onInputClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onKeyPressed(event: KeyboardEvent) {
    console.log(event);

    this.error = false;
    this.isOpened = true;
    let newSelectedItems = new Set<string>();

    const text = this.inputEl.value;
    const cursorPosition = this.inputEl.selectionStart;

    let comma1 = text.lastIndexOf(',', cursorPosition - 1);
    let comma2 = text.indexOf(',', cursorPosition);

    if (comma2 == -1) {
      comma2 = text.length;
    }

    this.itemPrefix = text.substr(comma1 + 1, comma2 - comma1 - 1).trim();

    if (this.itemsSet.has(this.itemPrefix)) {
      this.itemPrefix = '';
    }

    map(text.split(','), i => i.trim())
      .forEach(i => {
        if (this.itemsSet.has(i)) {
          newSelectedItems.add(i);
        } else if (i !== '') {
          this.error = true;
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

  _adjustValueInInputField() {
    this.inputEl.value = Array.from(this.selectedItems).join(',');
    this.error = false;
  }

  _onSelectionChanged() {
    this.modified = !this.modified;
    this.selectionChanged.emit(this.selectedItems);
  }

  closeComboBox() {
    if (this.isOpened) {
      this.isOpened = false;
    }
  }

  componentDidLoad() {
    this.init();

    this.closeComboBoxEventListener = this.closeComboBox.bind(this);
    document.addEventListener('click', this.closeComboBoxEventListener);
  }

  componentDidUnload() {
    document.removeEventListener('click', this.closeComboBoxEventListener);
  }
}
