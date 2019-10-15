import {Component, Element, h} from '@stencil/core';
import {select} from 'd3-selection';

// todo:
// https://github.com/mdbootstrap/perfect-scrollbar
// http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
@Component({
  tag: 'ro-bar-chart',
  styleUrl: './bar-chart.css',
  shadow: true
})
export class BarChart {

  @Element() el: HTMLElement;

  data = [
    {bar: 10, circle: 10},
    {bar: 20, circle: 15},
    {bar: 15, circle: 25},
    {bar: 6, circle: 15},
    {bar: 10, circle: 5},
    {bar: 20, circle: 10},
    {bar: 15, circle: 25},
    {bar: 6, circle: 26},
  ];

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
          <g class="pre-data"/>
          <g class="group-data">
            <g class="group-axes"/>
            <g class="groups"/>
          </g>
          <g class="post-data"/>
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
    const svg = select(this.el.shadowRoot.querySelector('svg'));
    const groups = svg.select('.group-data .groups');

    const stacks = groups
      .selectAll('g.stack')
      .data(this.data)
      .enter()
      .append('g')
      .on('mouseover', (d, i) => {
        console.log(d, i);
      })
      .on('mouseout', (d, i) => {
        console.log(d, i);
      });

    stacks
      .append('rect')
      .attr('fill', 'blue')
      .attr('height', (d) => d.bar * 15)
      .attr('width', '80')
      .attr('x', (_d, i) => i * 90)
      .attr('y', (d) => 400 - d.bar * 15)
      .attr('rx', '5')
      .attr('ry', '5');

    stacks
      .insert('circle')
      .attr('class', 'first')
      .attr('fill', 'yellow')
      .attr('cx', (_d, i) => i * 90 + 40)
      .attr('cy', (d) => 400 - d.circle * 15)
      .attr('r', 10);
  }
}
