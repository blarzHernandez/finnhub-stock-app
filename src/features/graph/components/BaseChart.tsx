import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ChartDataPoint, ChartConfiguration } from "../types/chart";
import {
  calculateChartDimensions,
  createChartScale,
} from "../utils/chartUtils";
import { Colors } from "../../../shared/design-system";

interface BaseChartProps {
  data: ChartDataPoint[];
  config: ChartConfiguration;
  color?: string;
  testID?: string;
}

/**
 * Simple Chart Component using React Native Views
 */
export const BaseChart = ({
  data,
  config,
  color = Colors.primary[500],
  testID = "base-chart",
}: BaseChartProps) => {
  if (data.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { width: config.width, height: config.height },
        ]}
        testID={`${testID}-empty`}
      >
        <View style={styles.emptyState}>
          <View style={styles.emptyMessage} />
        </View>
      </View>
    );
  }

  const dimensions = calculateChartDimensions(config);
  const scale = createChartScale(data, dimensions);

  const renderDataPoints = () => {
    return data.map((point, index) => {
      const x = scale.xScale(point.timestamp);
      const y = scale.yScale(point.value);

      return (
        <View
          key={`point-${index}`}
          style={[
            styles.dataPoint,
            {
              left: config.padding.left + x - 2,
              top: config.padding.top + y - 2,
              backgroundColor: color,
            },
          ]}
        />
      );
    });
  };

  const renderConnectingLines = () => {
    if (data.length < 2) return null;

    return data.slice(0, -1).map((point, index) => {
      const nextPoint = data[index + 1];

      const x1 = scale.xScale(point.timestamp);
      const y1 = scale.yScale(point.value);
      const x2 = scale.xScale(nextPoint.timestamp);
      const y2 = scale.yScale(nextPoint.value);

      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

      return (
        <View
          key={`line-${point.timestamp}-${nextPoint.timestamp}`}
          style={[
            styles.connectingLine,
            {
              left: config.padding.left + x1,
              top: config.padding.top + y1,
              width: length,
              backgroundColor: color,
              transform: [{ rotate: `${angle}deg` }, { translateY: -1 }],
            },
          ]}
        />
      );
    });
  };

  const renderGrid = () => {
    if (!config.showGrid) return null;

    const gridLines = [];
    const numberOfLines = 5;

    // Horizontal grid lines
    for (let i = 0; i <= numberOfLines; i++) {
      const y = (dimensions.chartHeight / numberOfLines) * i;
      gridLines.push(
        <View
          key={`h-grid-${i}`}
          style={[
            styles.gridLine,
            {
              left: config.padding.left,
              top: config.padding.top + y,
              width: dimensions.chartWidth,
              height: 1,
            },
          ]}
        />
      );
    }

    // Vertical grid lines
    for (let i = 0; i <= numberOfLines; i++) {
      const x = (dimensions.chartWidth / numberOfLines) * i;
      gridLines.push(
        <View
          key={`v-grid-${i}`}
          style={[
            styles.gridLine,
            {
              left: config.padding.left + x,
              top: config.padding.top,
              width: 1,
              height: dimensions.chartHeight,
            },
          ]}
        />
      );
    }

    return gridLines;
  };

  return (
    <View
      style={[styles.container, { width: config.width, height: config.height }]}
      testID={testID}
    >
      {renderGrid()}
      {renderConnectingLines()}
      {renderDataPoints()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.background,
    position: "relative",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    width: 50,
    height: 50,
    backgroundColor: Colors.neutral[200],
    borderRadius: 25,
  },
  dataPoint: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  connectingLine: {
    position: "absolute",
    height: 2,
    transformOrigin: "left center",
  },
  gridLine: {
    position: "absolute",
    backgroundColor: Colors.neutral[200],
    opacity: 0.3,
  },
});
