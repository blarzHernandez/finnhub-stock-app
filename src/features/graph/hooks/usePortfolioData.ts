import { useEffect } from "react";
import { StockQuote } from "../../../types";
import { PortfolioDataService } from "../services/PortfolioDataService";

/**
 * Hook for managing portfolio data updates
 */
export const usePortfolioData = (stockQuotes: StockQuote[]) => {
  useEffect(() => {
    // Only add snapshot if we have valid data
    if (
      stockQuotes.length > 0 &&
      stockQuotes.some((quote) => quote.current > 0)
    ) {
      PortfolioDataService.addPortfolioSnapshot(stockQuotes);
    }
  }, [stockQuotes]);

  return {
    getPortfolioChartData: PortfolioDataService.getPortfolioChartData,
    getSymbolChartData: PortfolioDataService.getSymbolChartData,
    getLatestPortfolioValue: PortfolioDataService.getLatestPortfolioValue,
    getPortfolioPerformance: PortfolioDataService.getPortfolioPerformance,
    getTrackedSymbols: PortfolioDataService.getTrackedSymbols,
    clearHistory: PortfolioDataService.clearHistory,
  };
};
