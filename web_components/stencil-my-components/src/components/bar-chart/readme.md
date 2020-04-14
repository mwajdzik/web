# ro-bar-chart



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                  | Description | Type                                                                     | Default                                      |
| ------------------------ | -------------------------- | ----------- | ------------------------------------------------------------------------ | -------------------------------------------- |
| `data`                   | --                         |             | `{ stacks: StacksDataType[]; lines: LineDataType[]; labels: string[]; }` | `undefined`                                  |
| `fixedBarWidth`          | `fixed-bar-width`          |             | `number`                                                                 | `undefined`                                  |
| `height`                 | `height`                   |             | `number`                                                                 | `400`                                        |
| `loading`                | `loading`                  |             | `boolean`                                                                | `false`                                      |
| `margins`                | --                         |             | `{ top: number; bottom: number; left: number; right: number; }`          | `{top: 20, bottom: 20, left: 20, right: 20}` |
| `tooltipContentProvider` | `tooltip-content-provider` |             | `any`                                                                    | `undefined`                                  |
| `xAxisCaption`           | `x-axis-caption`           |             | `string`                                                                 | `''`                                         |
| `xAxisMargin`            | `x-axis-margin`            |             | `number`                                                                 | `25`                                         |
| `yAxisCaption`           | `y-axis-caption`           |             | `string`                                                                 | `''`                                         |
| `yAxisMargin`            | `y-axis-margin`            |             | `number`                                                                 | `60`                                         |


## Events

| Event                          | Description | Type                                                                   |
| ------------------------------ | ----------- | ---------------------------------------------------------------------- |
| `roHideChartTooltip`           |             | `CustomEvent<{ content?: string; eventX?: number; eventY?: number; }>` |
| `roShowChartTooltip`           |             | `CustomEvent<{ content?: string; eventX?: number; eventY?: number; }>` |
| `roUpdatePositionChartTooltip` |             | `CustomEvent<{ content?: string; eventX?: number; eventY?: number; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
