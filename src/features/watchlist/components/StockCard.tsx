import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StockQuote } from "../../../types";
import { formatCurrency } from "../../../utils/format";

export const StockCard = ({ quote }: { quote: StockQuote }) => {
  const positive = quote.changePercent >= 0;
  return (
    <View style={styles.card}>
      <Text style={styles.symbol}>{quote.symbol}</Text>
      <Text style={styles.price}>{formatCurrency(quote.current)}</Text>
      <Text style={[styles.change, { color: positive ? "green" : "red" }]}>
        {quote.changePercent.toFixed(2)}%
      </Text>
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
});
