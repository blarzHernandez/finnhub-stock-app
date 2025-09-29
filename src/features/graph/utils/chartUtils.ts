import {
  ChartDataPoint,
  ChartScale,
  ChartDimensions,
  ChartConfiguration,
} from "../types/chart";

/**
 * Calculates chart dimensions based on configuration
 */
export const calculateChartDimensions = (
  config: ChartConfiguration
): ChartDimensions => {
  const chartWidth = config.width - config.padding.left - config.padding.right;
  const chartHeight =
    config.height - config.padding.top - config.padding.bottom;

  return {
    chartWidth,
    chartHeight,
    totalWidth: config.width,
    totalHeight: config.height,
  };
};

/**
 * Calculates min/max values from data points
 */
export const calculateDataBounds = (dataPoints: ChartDataPoint[]) => {
  if (dataPoints.length === 0) {
    return { xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
  }

  const xValues = dataPoints.map((point) => point.timestamp);
  const yValues = dataPoints.map((point) => point.value);

  return {
    xMin: Math.min(...xValues),
    xMax: Math.max(...xValues),
    yMin: Math.min(...yValues),
    yMax: Math.max(...yValues),
  };
};

/**
 * Creates scaling functions for chart coordinates
 */
export const createChartScale = (
  dataPoints: ChartDataPoint[],
  dimensions: ChartDimensions
): ChartScale => {
  const bounds = calculateDataBounds(dataPoints);

  // Add 10% padding to y-axis for better visualization
  const yPadding = (bounds.yMax - bounds.yMin) * 0.1;
  const adjustedYMin = Math.max(0, bounds.yMin - yPadding);
  const adjustedYMax = bounds.yMax + yPadding;

  const xScale = (value: number): number => {
    if (bounds.xMax === bounds.xMin) return 0;
    return (
      ((value - bounds.xMin) / (bounds.xMax - bounds.xMin)) *
      dimensions.chartWidth
    );
  };

  const yScale = (value: number): number => {
    if (adjustedYMax === adjustedYMin) return dimensions.chartHeight / 2;
    return (
      dimensions.chartHeight -
      ((value - adjustedYMin) / (adjustedYMax - adjustedYMin)) *
        dimensions.chartHeight
    );
  };

  return {
    xMin: bounds.xMin,
    xMax: bounds.xMax,
    yMin: adjustedYMin,
    yMax: adjustedYMax,
    xScale,
    yScale,
  };
};

/**
 * Generates path string for SVG line
 */
export const generateLinePath = (
  dataPoints: ChartDataPoint[],
  scale: ChartScale
): string => {
  if (dataPoints.length === 0) return "";

  const pathCommands = dataPoints.map((point, index) => {
    const x = scale.xScale(point.timestamp);
    const y = scale.yScale(point.value);
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  });

  return pathCommands.join(" ");
};

/**
 * Generates path string for SVG area chart
 */
export const generateAreaPath = (
  dataPoints: ChartDataPoint[],
  scale: ChartScale,
  dimensions: ChartDimensions
): string => {
  if (dataPoints.length === 0) return "";

  const linePath = generateLinePath(dataPoints, scale);
  const firstPoint = dataPoints[0];
  const lastPoint = dataPoints[dataPoints.length - 1];

  const startX = scale.xScale(firstPoint.timestamp);
  const endX = scale.xScale(lastPoint.timestamp);
  const bottomY = dimensions.chartHeight;

  return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
};

/**
 * Formats currency values for display
 */
export const formatCurrencyValue = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

/**
 * Formats timestamp for display
 */
export const formatTimeValue = (
  timestamp: number,
  format: "short" | "long" = "short"
): string => {
  const date = new Date(timestamp);

  if (format === "long") {
    return date.toLocaleString();
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
