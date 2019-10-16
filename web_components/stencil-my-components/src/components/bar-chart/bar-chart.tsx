import {Component, Element, h} from '@stencil/core';
import {select} from 'd3-selection';
import {ScaleBand, scaleBand, scaleLinear, ScaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';

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

  private x: ScaleBand<string>;
  private y: ScaleLinear<number, number>;

  data = [
    {bar: 5, circle: 10, label: 'AAA'},
    {bar: 10, circle: 20, label: 'BBB'},
    {bar: 20, circle: 30, label: 'CCC'},
    {bar: 30, circle: 40, label: 'DDD'},
    {bar: 40, circle: 45, label: 'EEE'},
    {bar: 50, circle: 10, label: 'FFF'},
    {bar: 25, circle: 20, label: 'GGG'},
    {bar: 5, circle: 10, label: 'HHH'},
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
          <g class="chart">
            <g class="pre-data"/>
            <g class="group-data">
              <g class="group-axes"/>
              <g class="groups"/>
            </g>
            <g class="post-data"/>
          </g>
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
    const clientWidth = 800;
    const clientHeight = 400;
    const marginAxis = 25;
    const margin = {top: 20, right: 20, bottom: 20, left: 20};
    const width = clientWidth - margin.left - margin.right;
    const height = clientHeight - margin.top - margin.bottom;
    const maxValue = max(this.data, d => Math.max(d.bar, d.circle));

    const svg = select(this.el.shadowRoot.querySelector('svg'));
    const chart = svg.select('.chart');
    const groups = svg.select('.group-data .groups');
    const axes = svg.select('.group-data .group-axes');

    chart.attr("width", width - margin.left - margin.right)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    groups
      .attr("transform", "translate(" + marginAxis + ", 0)");

    this.x = scaleBand()
      .domain(this.data.map((_, index) => `${this.data[index].label}`))
      .range([0, width - marginAxis])
      .padding(0.1);

    this.y = scaleLinear()
      .domain([0, maxValue])
      .range([height, 0]);

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
      .attr('class', 'bar')
      .attr('fill', 'indianred')
      .attr('height', (d) => height - this.y(d.bar))
      .attr('width', this.x.bandwidth())
      .attr('x', (d) => this.x(d.label))
      .attr('y', (d) => this.y(d.bar))
      .attr('rx', '3')
      .attr('ry', '3');

    stacks
      .insert('circle')
      .attr('class', 'circle')
      .attr('fill', 'yellow')
      .attr('cx', (d) => this.x(d.label) + this.x.bandwidth() / 2)
      .attr('cy', (d) => this.y(d.circle))
      .attr('r', 10);

    axes.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${marginAxis}, 0)`)
      .call(axisLeft(this.y));

    axes.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${marginAxis}, ${height})`)
      .call(
        axisBottom(this.x).tickFormat((d) => d),
      );
  }
}
