import React from "react";
import { Dropdown, DropdownOption } from "../../../shared/components/Dropdown";

const STOCK_SYMBOLS: DropdownOption[] = [
  { label: "Bitcoin (~$109K)", value: "BINANCE:BTCUSDT" },
  { label: "Bitcoin (Coinbase)", value: "COINBASE:BTC-USD" },
  { label: "Ethereum (~$4K)", value: "BINANCE:ETHUSDT" },
  { label: "Ethereum (Coinbase)", value: "COINBASE:ETH-USD" },
  { label: "Binance Coin (~$973)", value: "BINANCE:BNBUSDT" },
  { label: "Solana (~$202)", value: "BINANCE:SOLUSDT" },
  { label: "Cardano (~$0.78)", value: "BINANCE:ADAUSDT" },
  { label: "Polygon (~$0.38)", value: "BINANCE:MATICUSDT" },
  { label: "Tesla Inc. (TSLA)", value: "TSLA" },
  { label: "NVIDIA Corp. (NVDA)", value: "NVDA" },
  { label: "Apple Inc. (AAPL)", value: "AAPL" },
  { label: "Microsoft Corp. (MSFT)", value: "MSFT" },
  { label: "Amazon.com Inc. (AMZN)", value: "AMZN" },
  { label: "Meta Platforms (META)", value: "META" },
  { label: "GameStop Corp. (GME)", value: "GME" },
  { label: "AMC Entertainment (AMC)", value: "AMC" },
  { label: "Google/Alphabet (GOOGL)", value: "GOOGL" },
  { label: "Netflix Inc. (NFLX)", value: "NFLX" },
  { label: "PayPal Holdings (PYPL)", value: "PYPL" },
  { label: "Intel Corp. (INTC)", value: "INTC" },
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
