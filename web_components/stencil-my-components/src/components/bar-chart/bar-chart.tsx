import {Component, Element, Event, EventEmitter, h, Prop} from '@stencil/core';
import {event, select} from 'd3-selection';
import {ScaleBand, scaleBand, scaleLinear, ScaleLinear} from 'd3-scale';
import {max, min} from 'd3-array';
import {transition} from 'd3-transition';
import {axisBottom, axisLeft} from 'd3-axis';
import {curveMonotoneX, line} from 'd3-shape';
import {ChartDataType, ChartTooltipType, LineElemType} from "./chart-model";

@Component({
  tag: 'ro-bar-chart',
  styleUrl: './bar-chart.css',
  shadow: true
})
export class BarChart {

  @Element()
  private el: HTMLElement;
  private svg: any;

  private x: ScaleBand<string>;
  private y: ScaleLinear<number, number>;

  @Prop({mutable: true}) data: ChartDataType;
  @Prop({mutable: true}) height = 400;
  @Prop({mutable: true}) loading = false;
  @Prop({mutable: true}) margins = {top: 20, bottom: 20, left: 20, right: 20};
  @Prop({mutable: true}) xAxisCaption = '';
  @Prop({mutable: true}) yAxisCaption = '';
  @Prop({mutable: true}) xAxisMargin = 25;
  @Prop({mutable: true}) yAxisMargin = 60;
  @Prop({mutable: true}) fixedBarWidth: number;

  @Prop() tooltipContentProvider: any;
  @Event({bubbles: true, composed: true}) roShowChartTooltip: EventEmitter<ChartTooltipType>;
  @Event({bubbles: true, composed: true}) roHideChartTooltip: EventEmitter<ChartTooltipType>;
  @Event({bubbles: true, composed: true}) roUpdatePositionChartTooltip: EventEmitter<ChartTooltipType>;

  private resizeEventListener: EventListenerOrEventListenerObject;

  // -------------------------------------------------------------------------------------------------------------------

  private yGridLines = () =>
    axisLeft(this.y).ticks(5);

  render() {
    return [
      <figcaption>
        <slot name="caption"/>
      </figcaption>,
      <figure style={{'height': this.height + 'px'}}>
        <div class='caption' style={{display: (!this.data ? 'flex' : 'none')}}>
          <p>{this.loading ? 'Loading...' : 'No data'}</p>
        </div>

        <svg xmlns='http://www.w3.org/2000/svg' style={{display: (this.data ? 'block' : 'none')}}>
          <g class='chart'>
            <g class='pre-data'/>
            <g class='group-data'>
              <g class='group-axes'>
                <g class='x axis'/>
                <g class='y axis'/>
                <g class='grid'/>
                <text class='x-axis-text'/>
                <text class='y-axis-text'/>
              </g>
              <g class='groups'/>
              <g class='lines'/>
            </g>
            <g class='post-data'/>
          </g>
        </svg>
      </figure>
    ];
  }

  componentDidLoad() {
    this.svg = select(this.el.shadowRoot.querySelector('svg'));

    this.redrawChart();
    this.addEventListeners();
  }

  componentDidUpdate() {
    this.redrawChart();
  }

  componentDidUnload() {
    window.removeEventListener('resize', this.resizeEventListener);
  }

  // -------------------------------------------------------------------------------------------------------------------

  addEventListeners() {
    this.resizeEventListener = () => this.redrawChart();
    window.addEventListener('resize', this.resizeEventListener);

    this.svg.on('contextmenu', () => {
      event.preventDefault();
    })
  }

  // -------------------------------------------------------------------------------------------------------------------

  redrawChart() {
    if (!this.data) {
      return;
    }

    const boundingClientRect = this.svg.node().getBoundingClientRect();
    const clientWidth = this.fixedBarWidth ? this.data.labels.length * this.fixedBarWidth : boundingClientRect.width;
    const clientHeight = this.height;
    const width = clientWidth - this.margins.left - this.margins.right;
    const height = clientHeight - this.margins.top - this.margins.bottom;

    this.svg.style('width', this.fixedBarWidth ? clientWidth : '100%');

    // -----------------------------------------------------------------------------------------------------------------

    if (!this.data.stacks) {
      this.data.stacks = [];
    }

    if (!this.data.lines) {
      this.data.lines = [];
    }

    this.data.stacks.forEach(d => {
      if (!d.bars) {
        d.bars = [];
      }

      if (!d.circles) {
        d.circles = [];
      }

      if (d.bars.length == 0 && d.circles.length === 0) {
        d.gaps = [{class: '', value: 0}];
      } else {
        d.gaps = [];
      }

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
      min(this.data.lines, d => min(d.values.map(i => i ? i.value : 0))) || 0) / 10) * 10;

    const maxValue = Math.ceil(Math.max(
      max(this.data.stacks, d => Math.max(...d.bars.map(i => i.value), ...d.circles.map(i => i.value))) || 0,
      max(this.data.lines, d => max(d.values.map(i => i ? i.value : 0))) || 0) / 10) * 10;

    this.svg.select('.chart')
      .attr('height', height)
      .attr('width', width - this.margins.left - this.margins.right)
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

    const groups = this.svg.select('.group-data .groups');
    groups.attr('transform', `translate(${this.xAxisMargin}, 0)`);

    // -----------------------------------------------------------------------------------------------------------------

    this.x = scaleBand()
      .domain(this.data.labels)
      .range([0, width - this.xAxisMargin])
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
      .on('mouseover', (d, i) => {
        if (this.tooltipContentProvider && d.gaps.length == 0) {
          this.roShowChartTooltip.emit({
            content: this.tooltipContentProvider(d, i),
            eventX: event.pageX,
            eventY: event.pageY
          });
        }
      })
      .on('mousemove', (d) => {
        if (this.tooltipContentProvider && d.gaps.length == 0) {
          this.roUpdatePositionChartTooltip.emit({
            eventX: event.pageX,
            eventY: event.pageY
          });
        }
      })
      .on('mouseout', () => {
        if (this.tooltipContentProvider) {
          this.roHideChartTooltip.emit({});
        }
      })
      .on('contextmenu', function () {
        console.log(event);
      });

    stacks = groups.selectAll('g');
    stacks.attr('transform', (_, i) => `translate(${this.x(this.data.labels[i])}, 0)`);

    // -----------------------------------------------------------------------------------------------------------------

    let gaps = stacks
      .selectAll('rect.gap')
      .data(d => d.gaps);

    gaps.exit()
      .remove();

    gaps.enter()
      .append('rect')
      .attr('class', 'gap');

    gaps = stacks
      .selectAll('rect.gap');

    gaps.transition(transition())
      .attr('height', this.y(this.y.domain()[0]))
      .attr('width', this.x.bandwidth())
      .attr('y', this.y(this.y.domain()[1]))
      .attr('rx', '3')
      .attr('ry', '3');

    // -----------------------------------------------------------------------------------------------------------------

    let bars = stacks
      .selectAll('rect.bar')
      .data(d => d.bars);

    bars.exit()
      .remove();

    bars.enter()
      .append('rect')
      .attr('class', 'bar');

    bars = stacks
      .selectAll('rect.bar');

    bars.transition(transition())
      .attr('class', d => `bar ${d.class} ${d.value < 0 ? 'negative' : ''}`)
      .attr('height', (d) => d.covered ? 4 : Math.abs(this.y(0) - this.y(d.value)))
      .attr('width', this.x.bandwidth())
      .attr('y', (d) => {
        const shift = d.value < 0 ? 1 : 0;
        return this.y(d.covered ? d.value : Math.max(d.value, 0)) + shift;
      })
      .attr('rx', '3')
      .attr('ry', '3');

    // -----------------------------------------------------------------------------------------------------------------

    let circles = stacks
      .selectAll('circle.circle')
      .data(d => d.circles);

    circles.exit()
      .remove();

    circles.enter()
      .append('circle')
      .attr('class', 'circle');

    circles = stacks
      .selectAll('circle.circle');

    circles.transition(transition())
      .attr('class', d => `${d.class} circle`)
      .attr('cx', this.x.bandwidth() / 2)
      .attr('cy', (d) => this.y(d.value))
      .attr('r', this.x.bandwidth() / 12);

    // -----------------------------------------------------------------------------------------------------------------

    const lines = this.svg.select('.group-data .lines');

    const linePath = line<LineElemType>()
      .defined(d => d !== undefined)
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
      .attr('transform', `translate(${this.xAxisMargin + this.x.bandwidth() / 2}, 0)`)
      .attr('d', linePath);

    // -----------------------------------------------------------------------------------------------------------------

    const axes = this.svg.select('.group-data .group-axes');

    axes.select('.y.axis')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.xAxisMargin}, 0)`)
      .call(axisLeft(this.y));

    axes.select('.x.axis')
      .attr('class', 'x axis')
      .attr('transform', `translate(${this.xAxisMargin}, ${height})`)
      .call(axisBottom(this.x).tickFormat(d => d));

    axes.select('.x.axis')
      .selectAll('text')
      .attr('transform', 'translate(-25, 20) rotate(-45)')
      .style('font-size', '12px');

    axes.select('.x-axis-text')
      .attr('transform', `translate(${width / 2}, ${height + this.yAxisMargin})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(this.xAxisCaption);

    axes.select('.y-axis-text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -30)
      .attr('x', -(height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.yAxisCaption);

    // -----------------------------------------------------------------------------------------------------------------

    axes.select('.grid')
      .attr('transform', `translate(${this.xAxisMargin}, 0)`)
      .call(this.yGridLines()
        .tickSize(this.xAxisMargin - width)
        .tickFormat(() => ''));
  }
}
