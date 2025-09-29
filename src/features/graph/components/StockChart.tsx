import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseChart } from "./BaseChart";
import { ChartConfiguration } from "../types/chart";
import { PortfolioDataService } from "../services/PortfolioDataService";
import { formatCurrencyValue } from "../utils/chartUtils";
import { Colors } from "../../../shared/design-system";

interface StockChartProps {
  symbol: string;
  currentPrice: number;
  changePercent: number | null;
  width?: number;
  height?: number;
  showGrid?: boolean;
  showHeader?: boolean;
  testID?: string;
}

export const StockChart = ({
  symbol,
  currentPrice,
  changePercent,
  width = 350,
  height = 180,
  showGrid = false,
  showHeader = true,
  testID = "stock-chart",
}: StockChartProps) => {
  const chartConfig: ChartConfiguration = useMemo(
    () => ({
      width,
      height: showHeader ? height - 50 : height,
      padding: {
        top: 10,
        right: 15,
        bottom: 10,
        left: 15,
      },
      showGrid,
      showAxes: false,
      showLegend: false,
      theme: "light",
    }),
    [width, height, showGrid, showHeader]
  );

  const stockData = useMemo(() => {
    return PortfolioDataService.getSymbolChartData(symbol);
  }, [symbol]);

  const displaySymbol = useMemo(() => {
    return symbol.includes(":") ? symbol.split(":")[1] : symbol;
  }, [symbol]);

  const chartColor = useMemo(() => {
    if (changePercent === null) return Colors.neutral[500];
    return changePercent >= 0 ? Colors.success[500] : Colors.error[500];
  }, [changePercent]);

  if (!showHeader) {
    return (
      <BaseChart
        data={stockData}
        config={chartConfig}
        color={chartColor}
        testID={testID}
      />
    );
  }

  return (
    <View style={[styles.container, { width }]} testID={testID}>
      <View style={styles.header}>
        <View style={styles.symbolSection}>
          <Text style={styles.symbol}>{displaySymbol}</Text>
          <Text style={styles.price}>{formatCurrencyValue(currentPrice)}</Text>
        </View>

        {changePercent !== null && (
          <View style={styles.changeSection}>
            <Text
              style={[
                styles.changePercent,
                {
                  color:
                    changePercent >= 0
                      ? Colors.success[500]
                      : Colors.error[500],
                },
              ]}
            >
              {changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%
            </Text>
          </View>
        )}
      </View>

      <BaseChart
        data={stockData}
        config={chartConfig}
        color={chartColor}
        testID={`${testID}-chart`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  symbolSection: {
    flex: 1,
  },
  symbol: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  changeSection: {
    alignItems: "flex-end",
  },
  changePercent: {
    fontSize: 14,
    fontWeight: "600",
  },
});
