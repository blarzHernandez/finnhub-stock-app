import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseChart } from "./BaseChart";
import { ChartConfiguration } from "../types/chart";
import { PortfolioDataService } from "../services/PortfolioDataService";
import { formatCurrencyValue } from "../utils/chartUtils";
import { Colors } from "../../../shared/design-system";

interface PortfolioChartProps {
  width?: number;
  height?: number;
  showGrid?: boolean;
  showHeader?: boolean;
  testID?: string;
}

/**
 * Portfolio Chart Component extending BaseChart
 */
export const PortfolioChart = ({
  width = 350,
  height = 200,
  showGrid = true,
  showHeader = true,
  testID = "portfolio-chart",
}: PortfolioChartProps) => {
  const chartConfig: ChartConfiguration = useMemo(
    () => ({
      width,
      height: showHeader ? height - 60 : height,
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
      showGrid,
      showAxes: false,
      showLegend: false,
      theme: "light",
    }),
    [width, height, showGrid, showHeader]
  );

  const portfolioData = useMemo(() => {
    return PortfolioDataService.getPortfolioChartData();
  }, []);

  const portfolioStats = useMemo(() => {
    const latestValue = PortfolioDataService.getLatestPortfolioValue();
    const performance = PortfolioDataService.getPortfolioPerformance();

    return {
      latestValue,
      ...performance,
    };
  }, [portfolioData]);

  const chartColor = useMemo(() => {
    return portfolioStats.changePercent >= 0
      ? Colors.success[500]
      : Colors.error[500];
  }, [portfolioStats.changePercent]);

  if (!showHeader) {
    return (
      <BaseChart
        data={portfolioData}
        config={chartConfig}
        color={chartColor}
        testID={testID}
      />
    );
  }

  return (
    <View style={[styles.container, { width }]} testID={testID}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Portfolio Value</Text>
          <Text style={styles.value}>
            {formatCurrencyValue(portfolioStats.latestValue)}
          </Text>
        </View>

        <View style={styles.performanceSection}>
          <Text
            style={[
              styles.changeValue,
              {
                color:
                  portfolioStats.changePercent >= 0
                    ? Colors.success[500]
                    : Colors.error[500],
              },
            ]}
          >
            {portfolioStats.changePercent >= 0 ? "+" : ""}
            {formatCurrencyValue(portfolioStats.change)}
          </Text>
          <Text
            style={[
              styles.changePercent,
              {
                color:
                  portfolioStats.changePercent >= 0
                    ? Colors.success[500]
                    : Colors.error[500],
              },
            ]}
          >
            ({portfolioStats.changePercent >= 0 ? "+" : ""}
            {portfolioStats.changePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>

      <BaseChart
        data={portfolioData}
        config={chartConfig}
        color={chartColor}
        testID={`${testID}-chart`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  performanceSection: {
    alignItems: "flex-end",
  },
  changeValue: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  changePercent: {
    fontSize: 14,
    fontWeight: "500",
  },
});
