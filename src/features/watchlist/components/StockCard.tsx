import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StockQuote } from "../../../types";
import { formatCurrency } from "../../../utils/format";

export const StockCard = ({ quote }: { quote: StockQuote }) => {
  const changePercent = quote.changePercent ?? 0;
  const positive = changePercent >= 0;
  const hasValidData = quote.current > 0;

  return (
    <View style={styles.card}>
      <Text style={styles.symbol}>{quote.symbol}</Text>
      <Text style={styles.price}>
        {hasValidData ? formatCurrency(quote.current) : "Loading..."}
      </Text>
      <Text style={[styles.change, { color: positive ? "green" : "red" }]}>
        {hasValidData ? `${changePercent.toFixed(2)}%` : "--"}
      </Text>
      {!hasValidData && <Text style={styles.status}>No data available</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    margin: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  symbol: { fontWeight: "700" },
  price: { fontSize: 18 },
  change: { fontSize: 14 },
  status: { fontSize: 12, color: "#666", fontStyle: "italic" },
});
