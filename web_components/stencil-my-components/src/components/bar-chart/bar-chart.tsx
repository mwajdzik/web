import {Component, Element, h} from '@stencil/core';
import {event, select} from 'd3-selection';
import {ScaleBand, scaleBand, scaleLinear, ScaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';

// todo:
// https://github.com/mdbootstrap/perfect-scrollbar
// http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
// negative values

type ValueType = {
  value: number,
  class: string
}

type DataType = {
  bars: ValueType[],
  circles: ValueType[],
  label: string
};

@Component({
  tag: 'ro-bar-chart',
  styleUrl: './bar-chart.css',
  shadow: true
})
export class BarChart {

  @Element() el: HTMLElement;

  private x: ScaleBand<string>;
  private y: ScaleLinear<number, number>;

  data: DataType[] = [
    {
      bars: [{value: 84.98, class: 'current'}, {value: 55.57, class: 'expected'}],
      circles: [{value: 56.99, class: 'current-ref'}, {value: 84.91, class: 'final-ref'}],
      label: 'Jan'
    },
    {
      bars: [{value: 84.48, class: 'current'}, {value: 42.57, class: 'expected'}],
      circles: [{value: 42.68, class: 'current-ref'}, {value: 87.17, class: 'final-ref'}],
      label: 'Feb'
    },
    {
      bars: [{value: 74.48, class: 'current'}, {value: 49.57, class: 'expected'}],
      circles: [{value: 77.17, class: 'current-ref'}, {value: 47.18, class: 'final-ref'}],
      label: 'Mar'
    },
    {
      bars: [{value: 94.48, class: 'current'}, {value: 79.57, class: 'expected'}],
      circles: [{value: 77.17, class: 'current-ref'}, {value: 47.18, class: 'final-ref'}],
      label: 'Apr'
    },
    {
      bars: [{value: 84.48, class: 'current'}, {value: 49.57, class: 'expected'}],
      circles: [{value: 71.17, class: 'current-ref'}, {value: 57.18, class: 'final-ref'}],
      label: 'May'
    }
  ];

  render() {
    let loading = false;

    let captionSection;
    let svgSection;

    if (loading) {
      captionSection = (
        <div class='caption'>
          <p>Loading...</p>
        </div>
      );
    } else {
      svgSection = (
        <svg xmlns='http://www.w3.org/2000/svg'>
          <g class='chart'>
            <g class='pre-data'/>
            <g class='group-data'>
              <g class='group-axes'/>
              <g class='groups'/>
            </g>
            <g class='post-data'/>
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
    const maxValue = max(this.data, d => Math.max(...d.bars.map(i => i.value), ...d.bars.map(i => i.value)));

    const svg = select(this.el.shadowRoot.querySelector('svg'));
    const chart = svg.select('.chart');
    const groups = svg.select('.group-data .groups');
    const axes = svg.select('.group-data .group-axes');

    const div = select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    chart.attr('height', height)
      .attr('width', width - margin.left - margin.right)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    groups.attr('transform', `translate(${marginAxis}, 0)`);

    this.x = scaleBand()
      .domain(this.data.map((_, index) => `${this.data[index].label}`))
      .range([0, width - marginAxis])
      .padding(0.1);

    this.y = scaleLinear()
      .domain([0, maxValue])
      .range([height, 0]);

    // const linePath1 = line<any>()
    //   .x((d) => this.x(d.label))
    //   .y((d) => this.y(d.circle))
    //   .curve(curveMonotoneX);

    const stacks = groups
      .selectAll('g.stack')
      .data(this.data)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${this.x(d.label)}, 0)`)
      .on('mouseover', (d) => {
        div.style('opacity', 0.9);
        div.html('<p>' + d.label + '</p>')
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', () => {
        div.style('opacity', 0);
      });

    stacks
      .selectAll('rect')
      .data(d => d.bars)
      .enter()
      .append('rect')
      .attr('class', d => `${d.class} bar`)
      .attr('height', (d) => height - this.y(d.value))
      .attr('width', this.x.bandwidth())
      .attr('y', (d) => this.y(d.value))
      .attr('rx', '3')
      .attr('ry', '3');

    stacks
      .selectAll('circle')
      .data(d => d.circles)
      .enter()
      .append('circle')
      .attr('class', d => `${d.class} circle`)
      .attr('cx', this.x.bandwidth() / 2)
      .attr('cy', (d) => this.y(d.value))
      .attr('r', 10);

    // groups.append('path')
    //   .datum(this.data)
    //   .attr('class', 'line')
    //   .attr('transform', 'translate(' + this.x.bandwidth() / 2 + ', 0)')
    //   .attr('d', linePath1);

    axes.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${marginAxis}, 0)`)
      .call(axisLeft(this.y));

    axes.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${marginAxis}, ${height})`)
      .call(axisBottom(this.x).tickFormat(d => d));
  }
}
