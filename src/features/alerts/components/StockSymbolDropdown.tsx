import React from "react";
import { Dropdown, DropdownOption } from "../../../shared/components/Dropdown";

const STOCK_SYMBOLS: DropdownOption[] = [
  { label: "Apple Inc. (AAPL)", value: "AAPL" },
  { label: "Microsoft Corp. (MSFT)", value: "MSFT" },
  { label: "Google/Alphabet (GOOGL)", value: "GOOGL" },
  { label: "Amazon.com Inc. (AMZN)", value: "AMZN" },
  { label: "Tesla Inc. (TSLA)", value: "TSLA" },
  { label: "Meta Platforms (META)", value: "META" },
  { label: "NVIDIA Corp. (NVDA)", value: "NVDA" },
  { label: "Netflix Inc. (NFLX)", value: "NFLX" },
  { label: "Adobe Inc. (ADBE)", value: "ADBE" },
  { label: "Salesforce Inc. (CRM)", value: "CRM" },
  { label: "PayPal Holdings (PYPL)", value: "PYPL" },
  { label: "Intel Corp. (INTC)", value: "INTC" },
  { label: "Cisco Systems (CSCO)", value: "CSCO" },
  { label: "Oracle Corp. (ORCL)", value: "ORCL" },
  { label: "IBM Corp. (IBM)", value: "IBM" },
];

type StockSymbolDropdownProps = {
  onSelect: (symbol: string) => void;
  value?: string;
  error?: boolean;
  disabled?: boolean;
};

export const StockSymbolDropdown = ({
  value,
  onSelect,
  error = false,
  disabled = false,
}: StockSymbolDropdownProps) => {
  return (
    <Dropdown
      options={STOCK_SYMBOLS}
      value={value}
      onSelect={onSelect}
      placeholder="Select a stock symbol"
      title="Select Stock Symbol"
      error={error}
      disabled={disabled}
    />
  );
};
