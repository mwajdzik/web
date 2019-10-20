import {Component, Element, h} from '@stencil/core';

@Component({
  tag: 'ro-tooltip',
  styleUrl: './tooltip.css',
  shadow: true
})
export class Tooltip {

  @Element() el: HTMLElement;

  render() {
    return [
      <div>
        TOOLTIP
      </div>
    ]
  }
}
