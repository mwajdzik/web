import {Component, Element, h, Listen, State} from '@stencil/core';
import {ChartTooltipType} from "../bar-chart/chart-model";

@Component({
  tag: 'ro-tooltip',
  styleUrl: './tooltip.css',
  shadow: false
})
export class Tooltip {

  @Element() el: HTMLElement;

  @State() xPos = 0;
  @State() yPos = 0;

  private content: string = undefined;

  render() {
    const style = {
      opacity: this.content ? '1' : '0',
      top: this.yPos + 10 + 'px',
      left: this.xPos + 10 + 'px'
    };

    return [
      <div class="content" style={style}
           innerHTML={this.content}>
      </div>
    ]
  }

  @Listen('roShowChartTooltip', {target: 'body'})
  onShowChartTooltip(event: CustomEvent<ChartTooltipType>) {
    if (event.detail) {
      this.content = event.detail.content;
      this.xPos = event.detail.eventX;
      this.yPos = event.detail.eventY;
    }
  }

  @Listen('roHideChartTooltip', {target: 'body'})
  onHideChartTooltip(event: CustomEvent<ChartTooltipType>) {
    if (event.detail) {
      this.content = undefined;
      this.xPos = 0;
      this.yPos = 0;
    }
  }

  @Listen('roUpdatePositionChartTooltip', {target: 'body'})
  onUpdatePositionChartTooltip(event: CustomEvent<ChartTooltipType>) {
    if (event.detail) {
      this.xPos = event.detail.eventX;
      this.yPos = event.detail.eventY;
    }
  }
}
