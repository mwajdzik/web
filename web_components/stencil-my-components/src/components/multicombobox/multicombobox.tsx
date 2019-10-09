import {Component, Element, h, Prop, State} from '@stencil/core';
import * as _ from 'lodash-es';

/*
* ToDo:
*  select all
*  validate - error
*  disabled
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

  @State() modified = false;
  @State() isOpened = false;
  @State() itemPrefix = '';
  @State() selectedItems = new Set<string>();

  @Prop({mutable: true}) disabled = false;
  @Prop({mutable: true}) items: string[] = [];

  render() {
    console.log('render()');

    let dropdown;
    let hasItems = false;

    if (this.isOpened) {
      const filteredItems = _.filter(this.items, (item) => item.startsWith(this.itemPrefix));

      if (filteredItems.length > 0) {
        hasItems = true;

        dropdown = (
          <div class="dropdown-menu">
            <ul onClick={this.onListItemClick.bind(this)}>
              <li>Select all</li>
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
               onBlur={this.onInputBlur.bind(this)}
               onChange={this.onInputChanged.bind(this)}
               onKeyUp={this.onKeyPressed.bind(this)}
               ref={el => this.inputEl = el}/>
        <button type='button'
                onClick={this.onButtonClick.bind(this)}
                ref={el => this.buttonEl = el}>#
        </button>
      </div>,
      <div class="dropdown">
        {dropdown}
      </div>
    ]
  }

  onButtonClick() {
    this.isOpened = !this.isOpened;
  }

  onInputBlur() {
    console.log('onInputBlur', this.inputEl.value);
  }

  onInputChanged() {
    console.log('onInputChanged', this.inputEl.value);
  }

  onKeyPressed(event: KeyboardEvent) {
    console.log('onKeyPressed', event.key);

  }

  onListItemClick(event: MouseEvent) {
    const itemClicked = (event.target as HTMLLIElement).textContent;

    if (itemClicked == 'Select all') {

    } else {
      if (this.selectedItems.has(itemClicked)) {
        this.selectedItems.delete(itemClicked);
      } else {
        this.selectedItems.add(itemClicked);
      }
    }

    this.inputEl.value = Array.from(this.selectedItems).join(',');
    this.modified = !this.modified;
  }
}
