import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PortfolioChart } from "../../graph";
import { PortfolioDataService } from "../../graph/services/PortfolioDataService";
import { Colors } from "../../../shared/design-system";

interface PortfolioOverviewProps {
  testID?: string;
}

/**
 * Portfolio Overview Component for Home Screen
 */
export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  testID = "portfolio-overview",
}) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = Math.min(screenWidth - 32, 350); // Account for padding

  const portfolioStats = useMemo(() => {
    const latestValue = PortfolioDataService.getLatestPortfolioValue();
    const performance = PortfolioDataService.getPortfolioPerformance();
    const trackedSymbols = PortfolioDataService.getTrackedSymbols();

    return {
      latestValue,
      ...performance,
      symbolCount: trackedSymbols.length,
    };
  }, []);

  const hasData = portfolioStats.latestValue > 0;

  if (!hasData) {
    return (
      <View
        style={[styles.container, styles.emptyContainer]}
        testID={`${testID}-empty`}
      >
        <View style={styles.emptyContent}>
          <View style={styles.placeholderChart} />
          <Text style={styles.emptyTitle}>Start Tracking Your Portfolio</Text>
          <Text style={styles.emptySubtitle}>
            Add stock alerts to see your portfolio performance here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <PortfolioChart
        width={chartWidth}
        height={200}
        showGrid={true}
        showHeader={false}
      />

      <View style={styles.statsOverlay}>
        <View style={styles.mainStats}>
          <Text style={styles.portfolioLabel}>Portfolio Value</Text>
          <Text style={styles.portfolioValue}>
            $
            {portfolioStats.latestValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View style={styles.performanceStats}>
          <Text
            style={[
              styles.performanceChange,
              {
                color:
                  portfolioStats.changePercent >= 0
                    ? Colors.success[500]
                    : Colors.error[500],
              },
            ]}
          >
            {portfolioStats.changePercent >= 0 ? "+" : ""}$
            {Math.abs(portfolioStats.change).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text
            style={[
              styles.performancePercent,
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

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tracking {portfolioStats.symbolCount} symbol
          {portfolioStats.symbolCount !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.background,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
  },
  emptyContent: {
    alignItems: "center",
    maxWidth: 280,
  },
  placeholderChart: {
    width: 120,
    height: 80,
    backgroundColor: Colors.neutral[200],
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  statsOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  mainStats: {
    flex: 1,
  },
  portfolioLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  portfolioValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  performanceStats: {
    alignItems: "flex-end",
  },
  performanceChange: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  performancePercent: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
});
