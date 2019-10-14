import {Component, Element, h} from '@stencil/core';

@Component({
  tag: 'ro-bar-chart',
  styleUrl: './bar-chart.css',
  shadow: true
})
export class BarChart {

  @Element() el: HTMLElement;

  render() {
    return [
      <div>
      </div>
    ]
  }
}
