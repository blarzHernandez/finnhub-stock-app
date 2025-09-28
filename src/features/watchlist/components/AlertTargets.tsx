import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertItem } from "../../../types";
import { formatCurrency } from "../../../utils/format";
import { Colors } from "../../../shared/design-system";

interface AlertTargetsProps {
  alerts: AlertItem[];
  currentPrice: number;
  hasValidData: boolean;
}

export const AlertTargets = ({
  alerts,
  currentPrice,
  hasValidData,
}: AlertTargetsProps) => {
  // Filter and sort alerts for this specific symbol
  const enabledAlerts = alerts.filter((alert) => alert.enabled);
  const sortedAlerts = enabledAlerts.sort((a, b) => a.price - b.price);

  if (sortedAlerts.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Alert Thresholds:</Text>
      <View style={styles.list}>
        {sortedAlerts.map((alert) => {
          const shouldTrigger = hasValidData && currentPrice > alert.price;
          const isNearTrigger =
            hasValidData &&
            !shouldTrigger &&
            Math.abs(currentPrice - alert.price) / alert.price < 0.05;

          return (
            <View key={alert.id} style={styles.item}>
              <Text
                style={[
                  styles.price,
                  {
                    color: shouldTrigger
                      ? Colors.success[500]
                      : isNearTrigger
                      ? Colors.warning[500]
                      : Colors.text.secondary,
                  },
                ]}
              >
                {formatCurrency(alert.price)}
                {shouldTrigger && " - Triggered"}
                {!shouldTrigger && isNearTrigger && " - Almost close"}
                {!shouldTrigger && !isNearTrigger && " - Waiting"}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface.elevated,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  list: {
    gap: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    fontWeight: "500",
  },
});
