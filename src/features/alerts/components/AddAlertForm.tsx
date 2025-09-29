import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller, RegisterOptions } from "react-hook-form";
import { useAlerts } from "../context/AlertsContext";
import { StockSymbolDropdown } from "./StockSymbolDropdown";

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
    required: "Please select a stock symbol",
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
      symbol: "",
      price: "",
    },
  });

  const onSubmit = (data: AlertFormData) => {
    const parsedPrice = Number(data.price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price greater than 0");
      return;
    }

    try {
      addAlert(data.symbol.toUpperCase().trim(), parsedPrice);
      reset();
      onSaved?.();
    } catch (error) {
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
          render={({ field: { onChange, value } }) => (
            <StockSymbolDropdown
              value={value}
              onSelect={onChange}
              error={!!errors.symbol}
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

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!isValid || !isDirty) && styles.saveButtonDisabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || !isDirty}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.saveButtonText,
            (!isValid || !isDirty) && styles.saveButtonTextDisabled,
          ]}
        >
          Save Alert
        </Text>
      </TouchableOpacity>
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
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: "#cccccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonTextDisabled: {
    color: "#888888",
  },
});
