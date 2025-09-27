import React from "react";
import { View, FlatList, Button, Text, StyleSheet } from "react-native";
import { StockCard } from "../components/StockCard";
import { useAlerts } from "../../alerts/context/AlertsContext";
import { useWebSocketManager } from "../hooks/useWebSocketManager";
import { Theme } from "../../../shared";
import { SafeAreaContainer } from "../../../shared/components/SafeAreaContainer";

type WatchlistScreenProps = {
  navigation: any; // TODO: Type this properly with navigation types
};

export const WatchlistScreen = ({ navigation }: WatchlistScreenProps) => {
  const { alerts } = useAlerts();
  const { stockQuotesList, isWebSocketConnected } = useWebSocketManager();

  const uniqueStockSymbols = Array.from(
    new Set(alerts.map((alert) => alert.symbol))
  );
  const hasTrackedStocks = stockQuotesList.length > 0;
  const hasAlertsConfigured = alerts.length > 0;

  const renderConnectionStatus = () => (
    <View style={styles.connectionStatusContainer}>
      <View
        style={[
          styles.connectionIndicator,
          { backgroundColor: isWebSocketConnected ? "#4CAF50" : "#F44336" },
        ]}
      />
      <Text style={styles.connectionStatusText}>
        {isWebSocketConnected ? "Live Data Connected" : "Connecting..."}
      </Text>
    </View>
  );

  const renderEmptyState = () => {
    if (!hasAlertsConfigured) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No Stock Alerts</Text>
          <Text style={styles.emptyStateDescription}>
            Add your first stock alert to start tracking real-time prices
          </Text>
        </View>
      );
    }

    if (!hasTrackedStocks) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Loading Stock Data...</Text>
          <Text style={styles.emptyStateDescription}>
            Connecting to real-time data for {uniqueStockSymbols.length} symbol
            {uniqueStockSymbols.length !== 1 ? "s" : ""}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        {renderConnectionStatus()}

        <View style={styles.headerContainer}>
          <Button
            title="Add Stock Alert"
            onPress={() => navigation.navigate("AddAlert")}
          />
        </View>

        {hasTrackedStocks ? (
          <FlatList
            data={stockQuotesList}
            keyExtractor={(stockQuote) => stockQuote.symbol}
            renderItem={({ item: stockQuote }) => (
              <StockCard quote={stockQuote} />
            )}
            contentContainerStyle={styles.stockListContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  connectionStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: "#ffffff",
  },
  connectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Theme.spacing.sm,
  },
  connectionStatusText: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
  },
  headerContainer: {
    padding: Theme.spacing.md,
  },
  stockListContainer: {
    paddingHorizontal: Theme.spacing.md,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: Theme.spacing.sm,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
});
