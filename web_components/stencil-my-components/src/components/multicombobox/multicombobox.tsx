import {Component, Element, h, Prop, State} from '@stencil/core';
import * as _ from 'lodash-es';

/*
* ToDo:
*  validate - error
*  react to keyboard changes
*  virtual scrolling
* */
@Component({
  tag: 'ro-multi-combobox',
  styleUrl: './multicombobox.css',
  shadow: true
})
export class StockPrice {

  @Element() el: HTMLElement;

  inputEl: HTMLInputElement;
  buttonEl: HTMLButtonElement;

  closeComboBoxEventListener: EventListener;

  @State() modified = false;
  @State() isOpened = false;
  @State() itemPrefix = '';
  @State() selectedItems = new Set<string>();

  @Prop({mutable: true}) disabled = false;
  @Prop({mutable: true}) items: string[] = [];

  render() {
    console.log('rendering...');

    let dropdown;
    let hasItems = false;

    if (this.isOpened) {
      const filteredItems = _.filter(this.items, (item) => item.startsWith(this.itemPrefix));
      const selectAllClazz = this.allItemsSelected() ? 'selected' : '';

      if (filteredItems.length > 0 && !this.disabled) {
        hasItems = true;

        dropdown = (
          <div class="dropdown-menu">
            <ul onClick={this.onListItemClick.bind(this)}>
              <li class={selectAllClazz}>Select all</li>
              {_.map(filteredItems, (item, index) => {
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
      <div class={hasItems ? 'opened controls' : 'controls'}>
        <input type='text'
               disabled={this.disabled}
               onBlur={this.onInputBlur.bind(this)}
               onChange={this.onInputChanged.bind(this)}
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

  allItemsSelected() {
    return this.selectedItems.size == this.items.length;
  }

  onButtonClick(event: Event) {
    this.isOpened = !this.isOpened;
    event.stopPropagation();
  }

  onInputBlur() {
    console.log('onInputBlur', this.inputEl.value);
  }

  onInputChanged() {
    console.log('onInputChanged', this.inputEl.value);
  }

  onInputClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onKeyPressed(event: KeyboardEvent) {
    console.log('onKeyPressed', event.key);

  }

  onListItemClick(event: MouseEvent) {
    const itemClicked = (event.target as HTMLLIElement).textContent;

    if (itemClicked == 'Select all') {
      if (this.allItemsSelected()) {
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

    this.inputEl.value = Array.from(this.selectedItems).join(',');
    this.modified = !this.modified;

    event.stopPropagation();
  }

  closeComboBox() {
    if (this.isOpened) {
      this.isOpened = false;
    }
  }

  componentDidLoad() {
    this.closeComboBoxEventListener = this.closeComboBox.bind(this);
    document.addEventListener('click', this.closeComboBoxEventListener);
  }

  componentDidUnload() {
    document.removeEventListener('click', this.closeComboBoxEventListener);
  }
}
