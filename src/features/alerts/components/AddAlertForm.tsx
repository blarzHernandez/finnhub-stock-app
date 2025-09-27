import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useAlerts } from "../context/AlertsContext";

export const AddAlertForm = ({ onSaved }: { onSaved?: () => void }) => {
  const { addAlert } = useAlerts();
  const [symbol, setSymbol] = useState("AAPL");
  const [price, setPrice] = useState("");

  const save = () => {
    const parsed = Number(price);
    if (!symbol || Number.isNaN(parsed)) return;
    addAlert(symbol.toUpperCase(), parsed);
    onSaved?.();
  };

  return (
    <View style={{ padding: 12 }}>
      <Text>Symbol</Text>
      <TextInput
        value={symbol}
        onChangeText={setSymbol}
        placeholder="AAPL"
        autoCapitalize="characters"
      />
      <Text>Price</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="150"
        keyboardType="numeric"
      />
      <Button title="Save" onPress={save} />
    </View>
  );
};
