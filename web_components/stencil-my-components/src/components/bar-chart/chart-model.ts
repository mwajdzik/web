export type ValueType = {
  value: number,
  class: string
  covered?: boolean,
}

export type StacksDataType = {
  bars?: ValueType[],
  circles?: ValueType[],
  gaps?: ValueType[],
  label: string
};

export type LineElemType = {
  value: number
};

export type LineDataType = {
  values: LineElemType[],
  class: string
};

export type ChartDataType = {
  stacks: StacksDataType[],
  lines: LineDataType[],
  labels: string[]
};

export type ChartTooltipType = {
  content?: string,
  eventX?: number,
  eventY?: number
};
