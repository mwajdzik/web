import {Component, Element, h, Prop} from '@stencil/core';
import {event, select} from 'd3-selection';
import {ScaleBand, scaleBand, scaleLinear, ScaleLinear} from 'd3-scale';
import {max, min} from 'd3-array';
import {transition} from 'd3-transition';
import {axisBottom, axisLeft} from 'd3-axis';
import {curveMonotoneX, line} from 'd3-shape';
import {ChartDataType, LineElemType} from "./chart-model";

// todo:
// tooltip component
// gaps
// brush
// right click - context menu
// axis formatters
// clean listeners
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

  @Prop({mutable: true}) height = 250;
  @Prop({mutable: true}) loading = false;
  @Prop({mutable: true}) margins = {top: 20, bottom: 20, left: 20, right: 20};
  @Prop({mutable: true}) data: ChartDataType;

  private yGridLines = () =>
    axisLeft(this.y).ticks(5);

  render() {
    let content;

    if (!this.data) {
      content = (
        <div class='caption'>
          <p>{this.loading ? 'Loading...' : 'No data'}</p>
        </div>
      );
    } else {
      content = (
        <svg xmlns='http://www.w3.org/2000/svg'>
          <g class='chart'>
            <g class='pre-data'/>
            <g class='group-data'>
              <g class='group-axes'>
                <g class='x axis'/>
                <g class='y axis'/>
                <text class='x-axis-text'/>
                <text class='y-axis-text'/>
                <g class='grid'/>
              </g>
              <g class='groups'/>
              <g class='lines'/>
            </g>
            <g class='post-data'/>
          </g>
        </svg>
      );
    }

    return [
      <figcaption>
        <slot name="caption"/>
      </figcaption>,
      <figure style={{'height': this.height + 'px'}}>
        {content}
      </figure>
    ];
  }

  componentDidLoad() {
    this.componentDidUpdate();

    window.addEventListener('resize', () => {
      this.componentDidUpdate();
    });
  }

  componentDidUpdate() {
    const svg = select(this.el.shadowRoot.querySelector('svg'));
    const groups = svg.select('.group-data .groups');
    const lines = svg.select('.group-data .lines');
    const axes = svg.select('.group-data .group-axes');

    if (!svg || !svg.node() || !this.data) {
      return;
    }

    const boundingClientRect = svg.node().getBoundingClientRect();
    const clientWidth = boundingClientRect.width;
    const clientHeight = this.height;
    const marginAxis = 25;

    console.log('width', clientWidth);

    const width = clientWidth - this.margins.left - this.margins.right;
    const height = clientHeight - this.margins.top - this.margins.bottom;

    // -----------------------------------------------------------------------------------------------------------------

    if (!this.data.stacks) {
      this.data.stacks = [];
    }

    if (!this.data.lines) {
      this.data.lines = [];
    }

    this.data.stacks.forEach(d => {
      for (let i = 0; i < d.bars.length - 1; i++) {
        if (i < d.bars.length && d.bars[i].value > 0 && d.bars[i].value < d.bars[i + 1].value) {
          d.bars[i].covered = true;
          d.bars = d.bars.sort((a, b) => b.value - a.value);
        }
        if (i < d.bars.length && d.bars[i].value < 0 && d.bars[i + 1].value < d.bars[i].value) {
          d.bars[i].covered = true;
          d.bars = d.bars.sort((a, b) => a.value - b.value);
        }
      }
    });

    // -----------------------------------------------------------------------------------------------------------------

    const minValue = Math.floor(Math.min(
      min(this.data.stacks, d => Math.min(...d.bars.map(i => i.value), ...d.circles.map(i => i.value))) || 0,
      min(this.data.lines, d => min(d.values.map(i => i.value))) || 0) / 10) * 10;

    const maxValue = Math.ceil(Math.max(
      max(this.data.stacks, d => Math.max(...d.bars.map(i => i.value), ...d.circles.map(i => i.value))) || 0,
      max(this.data.lines, d => max(d.values.map(i => i.value))) || 0) / 10) * 10;

    const div = select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    svg.select('.chart')
      .attr('height', height)
      .attr('width', width - this.margins.left - this.margins.right)
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

    groups.attr('transform', `translate(${marginAxis}, 0)`);

    // -----------------------------------------------------------------------------------------------------------------

    this.x = scaleBand()
      .domain(this.data.labels)
      .range([0, width - marginAxis])
      .padding(0.1);

    this.y = scaleLinear()
      .domain([Math.min(minValue, 0), Math.max(maxValue, 0)])
      .range([height, 0]);

    // -----------------------------------------------------------------------------------------------------------------

    let stacks = groups
      .selectAll('g.stack')
      .data(this.data.stacks);

    stacks.exit()
      .remove();

    stacks.enter()
      .append('g')
      .attr('class', 'stack')
      .on('mouseover', (_) => {
        div.style('opacity', 0.9);
        div.html('TEXT')
          .style('left', (event.pageX) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', () => {
        div.style('opacity', 0);
      });

    stacks = groups
      .selectAll('g');

    stacks.attr('transform', (_, i) => `translate(${this.x(this.data.labels[i])}, 0)`);

    // -----------------------------------------------------------------------------------------------------------------

    let bars = stacks
      .selectAll('rect')
      .data(d => d.bars);

    bars.exit()
      .remove();

    bars.enter()
      .append('rect');

    bars = stacks
      .selectAll('rect');

    bars.transition(transition().duration(100))
      .attr('class', d => `${d.class} bar ${d.value < 0 ? 'negative' : ''}`)
      .attr('height', (d) => d.covered ? 4 : Math.abs(this.y(0) - this.y(d.value)))
      .attr('width', this.x.bandwidth())
      .attr('y', (d) => {
        if (d.value < 0) {
          return this.y(d.covered ? d.value : Math.max(d.value, 0)) + 1;
        }
        return this.y(d.covered ? d.value : Math.max(d.value, 0))
      })
      .attr('rx', '3')
      .attr('ry', '3');

    // -----------------------------------------------------------------------------------------------------------------

    let circles = stacks
      .selectAll('circle')
      .data(d => d.circles);

    circles.exit()
      .remove();

    circles.enter()
      .append('circle');

    circles = stacks
      .selectAll('circle');

    circles.transition(transition().duration(100))
      .attr('class', d => `${d.class} circle`)
      .attr('cx', this.x.bandwidth() / 2)
      .attr('cy', (d) => this.y(d.value))
      .attr('r', this.x.bandwidth() / 12);

    // -----------------------------------------------------------------------------------------------------------------

    const linePath = line<LineElemType>()
      .x((_, i) => this.x(this.data.labels[i]))
      .y(d => this.y(d.value))
      .curve(curveMonotoneX);

    let allLines = lines
      .selectAll('g.line')
      .data(this.data.lines);

    allLines.exit()
      .remove();

    allLines.enter()
      .append('g')
      .attr('class', d => `line ${d.class}`)
      .append('path');

    allLines = lines
      .selectAll('g.line');

    allLines.select('path')
      .datum(d => d.values)
      .transition(transition())
      .attr('transform', `translate(${marginAxis + this.x.bandwidth() / 2}, 0)`)
      .attr('d', linePath);

    // -----------------------------------------------------------------------------------------------------------------

    axes.select('.y.axis')
      .attr('class', 'y axis')
      .attr('transform', `translate(${marginAxis}, 0)`)
      .call(axisLeft(this.y));

    axes.select('.x.axis')
      .attr('class', 'x axis')
      .attr('transform', `translate(${marginAxis}, ${height})`)
      .call(axisBottom(this.x).tickFormat(d => d));

    axes.select('.x.axis')
      .selectAll('text')
      .attr('transform', ' translate(-15, 12) rotate(-45)')
      .style('font-size', '12px');

    axes.select('.x-axis-text')
      .attr('transform', `translate(${width / 2}, ${height + 55})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Month');

    axes.select('.y-axis-text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -30)
      .attr('x', -(height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Value');

    // -----------------------------------------------------------------------------------------------------------------

    axes.select('.grid')
      .attr('transform', `translate(${marginAxis}, 0)`)
      .call(this.yGridLines()
        .tickSize(marginAxis - width)
        .tickFormat(() => ''));
  }
}
