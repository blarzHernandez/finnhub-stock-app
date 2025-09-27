import { useEffect, useState, useMemo } from "react";
import { useAlerts } from "../../alerts/context/AlertsContext";
import {
  subscribeToStockRealTimeData,
  onWebSocketConnectionStateChange,
} from "../services/socket";
import { StockQuote } from "../../../types";
import type { FinnhubRealTimeTradeData } from "../services/socket";
import { fetchQuote } from "../../../services/FinnHub";

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

  const uniqueStockSymbols = useMemo(() => {
    const symbols = Array.from(new Set(alerts.map((alert) => alert.symbol)));
    const finalSymbols = symbols.length > 0 ? symbols : ["AAPL"];
    return finalSymbols;
  }, [alerts]);

  const fetchInitialStockData = async (
    symbols: string[]
  ): Promise<StockQuote[]> => {
    try {
      const quotes = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const quote = await fetchQuote(symbol);
            return quote;
            return quote;
          } catch (error) {
            console.error(`Failed to fetch quote for ${symbol}:`, error);
            return {
              symbol,
              current: 0,
              changePercent: 0,
              timestamp: 0,
            } as StockQuote;
          }
        })
      );
      return quotes;
    } catch (error) {
      console.error("Error fetching initial stock data:", error);
      return [];
    }
  };

  // Smart refresh: only fetch quotes for new symbols
  useEffect(() => {
    const currentSymbols = new Set(
      stockQuotesList.map((quote) => quote.symbol)
    );
    const newSymbols = uniqueStockSymbols.filter(
      (symbol) => !currentSymbols.has(symbol)
    );

    if (newSymbols.length > 0) {
      fetchInitialStockData(newSymbols).then((newQuotes: StockQuote[]) => {
        setStockQuotesList((prevQuotes) => [...prevQuotes, ...newQuotes]);
      });
    }
  }, [uniqueStockSymbols.join(","), stockQuotesList.length]);

  useEffect(() => {
    const handleRealTimeTradeData = (
      tradeData: FinnhubRealTimeTradeData
    ): void => {
      if (tradeData.type === "trade" && Array.isArray(tradeData.data)) {
        const updatedQuotes = new Map<string, StockQuote>();

        // Process each trade update
        tradeData.data.forEach((tradeUpdate) => {
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
      uniqueStockSymbols,
      handleRealTimeTradeData
    );

    return () => {
      unsubscribeFromRealTimeData();
    };
  }, [uniqueStockSymbols.join(","), updateAlertLastTriggeredTime]);

  // Monitor WebSocket connection status
  useEffect(() => {
    const unsubscribeFromConnectionState = onWebSocketConnectionStateChange(
      (isConnectionActive: boolean) => {
        setIsWebSocketConnected(isConnectionActive);
        // Fetch initial data when WebSocket connects
        if (isConnectionActive && uniqueStockSymbols.length > 0) {
          // Small delay to allow WebSocket to stabilize
          setTimeout(() => {
            fetchInitialStockData(uniqueStockSymbols);
          }, 100);
        }
      }
    );

    return () => {
      unsubscribeFromConnectionState();
    };
  }, [uniqueStockSymbols.join(",")]);

  return {
    stockQuotesList,
    isWebSocketConnected,
  };
}
