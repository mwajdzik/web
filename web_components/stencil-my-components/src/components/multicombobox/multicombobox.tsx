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

  @State() isOpened = false;
  @Prop({mutable: true}) items: string[] = [];

  render() {
    let dropdown;

    if (this.isOpened && this.items.length > 0) {
      dropdown = (
        <div class="dropdown-menu">
          <ul onClick={this.onListItemClick.bind(this)}>
            {_.map(this.items, (item, index) => {
              const style = {'top': (index * 30) + 'px'};
              return <li style={style}>{item}</li>
            })}
          </ul>
        </div>
      )
    }

    return [
      <input type="text" ref={el => this.inputEl = el}/>,
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

  onListItemClick(event: MouseEvent) {
    const itemClicked = (event.target as HTMLLIElement).textContent;
    console.log(itemClicked);
  }
}
