import {Component, Element, h} from '@stencil/core';
import {select} from 'd3-selection';

@Component({
  tag: 'ro-bar-chart',
  styleUrl: './bar-chart.css',
  shadow: true
})
export class BarChart {

  @Element() el: HTMLElement;

  data = [10, 20, 15, 6, 10, 20, 15, 6];

  render() {
    let loading = false;

    let captionSection;
    let svgSection;

    if (loading) {
      captionSection = (
        <div class="caption">
          <p>Loading...</p>
        </div>
      );
    } else {
      svgSection = (
        <svg xmlns="http://www.w3.org/2000/svg">
        </svg>
      )
    }

    return [
      <figure>
        {captionSection || svgSection}
      </figure>
    ]
  }

  componentDidLoad() {
    select(this.el.shadowRoot.querySelector('svg'))
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('fill', 'blue')
      .attr('height', (d) => d * 15)
      .attr('width', '80')
      .attr('x', (_d, i) => i * 90)
      .attr('y', (d) => 400 - d * 15)
      .attr('rx', '5')
      .attr('ry', '5');
  }
}
