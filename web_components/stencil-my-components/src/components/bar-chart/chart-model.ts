export type ValueType = {
  value: number,
  class: string
  covered?: boolean,
}

export type StacksDataType = {
  bars: ValueType[],
  circles: ValueType[]
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
