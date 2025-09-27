import { useEffect, useState } from "react";
import { useAlerts } from "../../alerts/context/AlertsContext";
import {
  subscribeToStockRealTimeData,
  onWebSocketConnectionStateChange,
} from "../services/socket";
import { StockQuote } from "../../../types";
import type { FinnhubRealTimeTradeData } from "../services/socket";

const DEFAULT_ALERT_COOLDOWN_MS = 60_000; // 1 minute

type WebSocketManagerState = {
  stockQuotesList: StockQuote[];
  isWebSocketConnected: boolean;
};

export function useWebSocketManager(): WebSocketManagerState {
  const { alerts, updateAlertLastTriggeredTime } = useAlerts();
  const [stockQuotesList, setStockQuotesList] = useState<StockQuote[]>([]);
  const [isWebSocketConnected, setIsWebSocketConnected] =
    useState<boolean>(false);

  const uniqueStockSymbols = Array.from(
    new Set(alerts.map((alert) => alert.symbol))
  );

  // DEBUG: Force connection test with AAPL if no alerts exist
  const testSymbols =
    uniqueStockSymbols.length > 0 ? uniqueStockSymbols : ["AAPL"];

  useEffect(() => {
    const handleRealTimeTradeData = (
      tradeData: FinnhubRealTimeTradeData
    ): void => {
      console.log("Received trade data:", tradeData);

      if (tradeData.type === "trade" && Array.isArray(tradeData.data)) {
        const updatedQuotes = new Map<string, StockQuote>();

        // Process each trade update
        tradeData.data.forEach((tradeUpdate) => {
          // tradeUpdate matches FinnHub API: { s: string; p: number; t: number; v: number; c?: string[] }
          const stockSymbol = tradeUpdate.s; // symbol
          const currentPrice = tradeUpdate.p; // price
          const tradeTimestamp = tradeUpdate.t; // timestamp

          // Create or update stock quote
          const existingQuote = stockQuotesList.find(
            (quote) => quote.symbol === stockSymbol
          );
          const previousPrice = existingQuote?.current || currentPrice;
          const priceChangePercent =
            previousPrice > 0
              ? ((currentPrice - previousPrice) / previousPrice) * 100
              : 0;

          const updatedStockQuote: StockQuote = {
            symbol: stockSymbol,
            current: currentPrice,
            changePercent: priceChangePercent,
            timestamp: tradeTimestamp,
          };

          updatedQuotes.set(stockSymbol, updatedStockQuote);

          // Check alerts for this symbol
          processAlertsForStockUpdate(stockSymbol, currentPrice);
        });

        // Update stock quotes list
        setStockQuotesList((previousQuotes) => {
          const updatedQuotesList = [...previousQuotes];

          updatedQuotes.forEach((newQuote, symbol) => {
            const existingIndex = updatedQuotesList.findIndex(
              (quote) => quote.symbol === symbol
            );
            if (existingIndex >= 0) {
              updatedQuotesList[existingIndex] = newQuote;
            } else {
              updatedQuotesList.push(newQuote);
            }
          });

          return updatedQuotesList;
        });
      }
    };

    const processAlertsForStockUpdate = (
      stockSymbol: string,
      currentPrice: number
    ): void => {
      const relevantEnabledAlerts = alerts.filter(
        (alert) => alert.symbol === stockSymbol && alert.enabled
      );

      relevantEnabledAlerts.forEach((alert) => {
        const currentTimestamp = Date.now();
        const timeSinceLastTrigger =
          currentTimestamp - (alert.lastTriggeredAt ?? 0);
        const alertCooldownPeriod =
          alert.cooldownMilliseconds ?? DEFAULT_ALERT_COOLDOWN_MS;

        // Check if price threshold is met and cooldown has passed
        if (
          currentPrice > alert.price &&
          timeSinceLastTrigger > alertCooldownPeriod
        ) {
          // TODO: Implement notification system
          // presentLocalNotification(
          //   `${alert.symbol} Alert Triggered`,
          //   `${alert.symbol} reached $${currentPrice.toFixed(2)} (target: $${alert.price.toFixed(2)})`
          // );

          console.log(
            `Alert triggered for ${alert.symbol}: $${currentPrice.toFixed(2)}`
          );
          updateAlertLastTriggeredTime(alert.id, currentTimestamp);
        }
      });
    };

    // Subscribe to real-time data
    const unsubscribeFromRealTimeData = subscribeToStockRealTimeData(
      testSymbols,
      handleRealTimeTradeData
    );

    return () => {
      unsubscribeFromRealTimeData();
    };
  }, [testSymbols.join(","), alerts.length, updateAlertLastTriggeredTime]);

  // Monitor WebSocket connection status
  useEffect(() => {
    const unsubscribeFromConnectionState = onWebSocketConnectionStateChange(
      (isConnectionActive: boolean) => {
        setIsWebSocketConnected(isConnectionActive);
      }
    );

    return () => {
      unsubscribeFromConnectionState();
    };
  }, []);

  return {
    stockQuotesList,
    isWebSocketConnected,
  };
}
