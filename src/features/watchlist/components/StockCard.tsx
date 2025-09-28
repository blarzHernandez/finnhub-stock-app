import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { StockQuote } from "../../../types";
import { formatCurrency } from "../../../utils/format";
import { useAlerts } from "../../alerts/context/AlertsContext";
import { AlertTargets } from "./AlertTargets";
import { AlertChip } from "./AlertChip";

interface StockCardProps {
  quote: StockQuote;
}

export const StockCard = ({ quote }: StockCardProps) => {
  const { alerts } = useAlerts();
  const changePercent = quote.changePercent ?? 0;
  const positive = changePercent >= 0;
  const hasValidData = quote.current > 0 && quote.changePercent !== null;

  // Filter alerts for this specific symbol
  const symbolAlerts = alerts.filter((alert) => alert.symbol === quote.symbol);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{quote.symbol}</Text>
        <AlertChip alerts={symbolAlerts} />
      </View>

      <Text style={styles.price}>
        {hasValidData ? formatCurrency(quote.current) : "Loading..."}
      </Text>

      <Text style={[styles.change, { color: positive ? "green" : "red" }]}>
        {hasValidData && typeof changePercent === "number"
          ? `${changePercent.toFixed(2)}%`
          : "--"}
      </Text>

      <AlertTargets
        alerts={symbolAlerts}
        currentPrice={quote.current}
        hasValidData={hasValidData}
      />

      {!hasValidData && <Text style={styles.status}>No data available</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  symbol: {
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  status: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});
