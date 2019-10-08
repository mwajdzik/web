import {Component, Element, h, Prop, State} from '@stencil/core';
import * as _ from 'lodash-es';

@Component({
  tag: 'ro-multi-combobox',
  styleUrl: './multicombobox.css',
  shadow: true
})
export class StockPrice {

  @Element() el: HTMLElement;

  inputEl: HTMLInputElement;
  buttonEl: HTMLButtonElement;

  @State() modified = false;
  @State() isOpened = false;
  @State() itemPrefix = '';
  @State() selectedItems = new Set<string>();

  @Prop({mutable: true}) items: string[] = [];

  render() {
    let dropdown;

    if (this.isOpened && this.items.length > 0) {
      const filteredItems = _.filter(this.items, (item) => item.startsWith(this.itemPrefix));

      dropdown = (
        <div class="dropdown-menu">
          <ul onClick={this.onListItemClick.bind(this)}>
            {_.map(filteredItems, (item, index) => {
              const style = {'top': (index * 30) + 'px'};
              const clazz = this.selectedItems.has(item) ? 'selected' : '';

              return <li style={style} class={clazz}>{item}</li>
            })}
          </ul>
        </div>
      )
    }

    return [
      <input type="text"
             onKeyUp={this.onInputChanged.bind(this)}
             ref={el => this.inputEl = el}/>,
      <button type="button"
              onClick={this.onButtonClick.bind(this)}
              ref={el => this.buttonEl = el}>^
      </button>,
      <div class="dropdown">
        {dropdown}
      </div>
    ]
  }

  onButtonClick() {
    this.isOpened = !this.isOpened;
  }

  onInputChanged(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      if (this.items.includes(this.inputEl.value)) {
        this.selectedItems.add(this.inputEl.value);
        this.itemPrefix = this.inputEl.value = '';
      }
    } else {
      this.itemPrefix = this.inputEl.value;
    }
  }

  onListItemClick(event: MouseEvent) {
    const itemClicked = (event.target as HTMLLIElement).textContent;

    if (this.selectedItems.has(itemClicked)) {
      this.selectedItems.delete(itemClicked);
    } else {
      this.selectedItems.add(itemClicked);
    }

    this.modified = !this.modified;
  }
}
