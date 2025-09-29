import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StockQuote } from "../../../types";
import { Colors } from "../../../shared/design-system";
import { formatCurrency } from "../../../utils/format";

interface TopMoverItemProps {
  stock: StockQuote;
  rank: number;
}

interface TopMoversProps {
  stockQuotes: StockQuote[];
  limit?: number;
  testID?: string;
}

/**
 * Individual Top Mover Item Component
 */
const TopMoverItem = ({ stock, rank }: TopMoverItemProps) => {
  const displaySymbol = stock.symbol.includes(":")
    ? stock.symbol.split(":")[1]
    : stock.symbol;

  const isPositive = (stock.changePercent || 0) >= 0;
  const changeColor = isPositive ? Colors.success[500] : Colors.error[500];

  return (
    <View style={styles.moverItem}>
      <View style={styles.rankSection}>
        <Text style={styles.rankNumber}>{rank}</Text>
      </View>

      <View style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>{displaySymbol}</Text>
        <Text style={styles.stockPrice}>{formatCurrency(stock.current)}</Text>
      </View>

      <View style={styles.changeSection}>
        <Text style={[styles.changePercent, { color: changeColor }]}>
          {isPositive ? "+" : ""}
          {(stock.changePercent || 0).toFixed(2)}%
        </Text>
      </View>
    </View>
  );
};

/**
 * Top Movers Component
 */
export const TopMovers: React.FC<TopMoversProps> = ({
  stockQuotes,
  limit = 5,
  testID = "top-movers",
}) => {
  const topMovers = useMemo(() => {
    return stockQuotes
      .filter((stock) => stock.changePercent !== null && stock.current > 0)
      .sort(
        (a, b) =>
          Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0)
      )
      .slice(0, limit);
  }, [stockQuotes, limit]);

  if (topMovers.length === 0) {
    return (
      <View style={styles.container} testID={`${testID}-empty`}>
        <View style={styles.header}>
          <Text style={styles.title}>Top Movers</Text>
          <Text style={styles.subtitle}>Biggest price changes today</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No price data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.title}>Top Movers</Text>
        <Text style={styles.subtitle}>Biggest price changes today</Text>
      </View>

      <FlatList
        data={topMovers}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item, index }) => (
          <TopMoverItem stock={item} rank={index + 1} />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Since it's in a parent ScrollView
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  moverItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  rankSection: {
    width: 30,
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  stockInfo: {
    flex: 1,
    marginLeft: 12,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  stockPrice: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  changeSection: {
    alignItems: "flex-end",
  },
  changePercent: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
