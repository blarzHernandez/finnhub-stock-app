import React from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { useForm, Controller, RegisterOptions } from "react-hook-form";
import { useAlerts } from "../context/AlertsContext";

type AlertFormData = {
  symbol: string;
  price: string;
};

type AlertFormProps = {
  onSaved?: () => void;
};

const VALIDATION_RULES: Record<
  keyof AlertFormData,
  RegisterOptions<AlertFormData>
> = {
  symbol: {
    required: "Stock symbol is required",
    minLength: {
      value: 1,
      message: "Symbol must be at least 1 character",
    },
    maxLength: {
      value: 10,
      message: "Symbol must be less than 10 characters",
    },
    pattern: {
      value: /^[A-Za-z]+$/,
      message: "Symbol can only contain letters",
    },
  },
  price: {
    required: "Price is required",
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: "Please enter a valid price (e.g., 150.50)",
    },
    validate: (value) => {
      const num = Number(value);
      if (num <= 0) return "Price must be greater than 0";
      if (num > 999999) return "Price must be less than $999,999";
      return true;
    },
  },
};

export const AddAlertForm = ({ onSaved }: AlertFormProps) => {
  const { addAlert } = useAlerts();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<AlertFormData>({
    mode: "onChange",
    defaultValues: {
      symbol: "AAPL",
      price: "", // Keep empty - user should enter their own price
    },
  });

  const onSubmit = (data: AlertFormData) => {
    const parsedPrice = Number(data.price);

    // This validation is redundant since react-hook-form already validates it
    // But keeping as a safety net
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      console.error(
        "Invalid price passed validation:",
        data.price,
        parsedPrice
      );
      Alert.alert("Invalid Price", "Please enter a valid price greater than 0");
      return;
    }

    try {
      console.log("Attempting to add alert:", data.symbol, parsedPrice);
      addAlert(data.symbol.toUpperCase().trim(), parsedPrice);
      console.log("Alert added successfully");
      reset();
      onSaved?.();
    } catch (error) {
      console.error("Error adding alert:", error);
      Alert.alert(
        "Error",
        `Failed to save alert: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Stock Symbol</Text>
        <Controller
          control={control}
          name="symbol"
          rules={VALIDATION_RULES.symbol}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.textInput, errors.symbol && styles.textInputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="AAPL"
              autoCapitalize="characters"
              autoCorrect={false}
            />
          )}
        />
        {errors.symbol && (
          <Text style={styles.errorText}>{errors.symbol.message}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Target Price ($)</Text>
        <Controller
          control={control}
          name="price"
          rules={VALIDATION_RULES.price}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.textInput, errors.price && styles.textInputError]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="150.00"
              keyboardType="decimal-pad"
            />
          )}
        />
        {errors.price && (
          <Text style={styles.errorText}>{errors.price.message}</Text>
        )}
      </View>

      <Button
        title="Save Alert"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || !isDirty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textInputError: {
    borderColor: "#ff4444",
    backgroundColor: "#fff5f5",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 4,
  },
});
