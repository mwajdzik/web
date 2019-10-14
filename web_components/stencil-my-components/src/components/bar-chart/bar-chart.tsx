import {Component, Element, h} from '@stencil/core';

@Component({
  tag: 'ro-bar-chart',
  styleUrl: './bar-chart.css',
  shadow: true
})
export class BarChart {

  @Element() el: HTMLElement;

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
}
