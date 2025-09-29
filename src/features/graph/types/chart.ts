export interface ChartDataPoint {
  timestamp: number;
  value: number;
  symbol?: string;
}

export interface ChartSeries {
  id: string;
  name: string;
  data: ChartDataPoint[];
  color: string;
}

export interface ChartConfiguration {
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  showGrid: boolean;
  showAxes: boolean;
  showLegend: boolean;
  theme: "light" | "dark";
}

export interface ChartDimensions {
  chartWidth: number;
  chartHeight: number;
  totalWidth: number;
  totalHeight: number;
}

export interface ChartScale {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xScale: (value: number) => number;
  yScale: (value: number) => number;
}

export type ChartType = "line" | "area" | "bar";

export interface PortfolioValue {
  timestamp: number;
  totalValue: number;
  symbols: Record<string, number>; // symbol -> value
}
