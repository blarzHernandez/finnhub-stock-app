import React from "react";
import { Text, StyleSheet } from "react-native";
import { AlertItem } from "../../../types";

interface AlertChipProps {
  alerts: AlertItem[];
}

export const AlertChip = ({ alerts }: AlertChipProps) => {
  const enabledAlerts = alerts.filter((alert) => alert.enabled);

  if (enabledAlerts.length === 0) return null;

  return (
    <Text style={styles.chip}>
      {enabledAlerts.length} alert{enabledAlerts.length !== 1 ? "s" : ""}
    </Text>
  );
};

const styles = StyleSheet.create({
  chip: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
