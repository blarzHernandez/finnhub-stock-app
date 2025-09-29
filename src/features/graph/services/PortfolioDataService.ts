import { StockQuote } from "../../../types";
import { ChartDataPoint, PortfolioValue } from "../types/chart";

/**
 * Service for aggregating portfolio data
 */
export class PortfolioDataService {
  private static portfolioHistory: PortfolioValue[] = [];
  private static readonly MAX_HISTORY_POINTS = 100; // Limit memory usage

  /**
   * Adds a new portfolio snapshot to history
   */
  static addPortfolioSnapshot(stockQuotes: StockQuote[]): void {
    const timestamp = Date.now();
    const totalValue = this.calculateTotalPortfolioValue(stockQuotes);
    const symbolValues = this.getSymbolValues(stockQuotes);

    const portfolioValue: PortfolioValue = {
      timestamp,
      totalValue,
      symbols: symbolValues,
    };

    this.portfolioHistory.push(portfolioValue);

    if (this.portfolioHistory.length > this.MAX_HISTORY_POINTS) {
      this.portfolioHistory.shift();
    }
  }

  /**
   * Gets portfolio history as chart data points
   */
  static getPortfolioChartData(): ChartDataPoint[] {
    return this.portfolioHistory.map((snapshot) => ({
      timestamp: snapshot.timestamp,
      value: snapshot.totalValue,
    }));
  }

  /**
   * Gets individual symbol chart data
   */
  static getSymbolChartData(symbol: string): ChartDataPoint[] {
    return this.portfolioHistory
      .filter((snapshot) => snapshot.symbols[symbol] !== undefined)
      .map((snapshot) => ({
        timestamp: snapshot.timestamp,
        value: snapshot.symbols[symbol],
        symbol,
      }));
  }

  /**
   * Gets latest portfolio value
   */
  static getLatestPortfolioValue(): number {
    if (this.portfolioHistory.length === 0) return 0;
    return this.portfolioHistory[this.portfolioHistory.length - 1].totalValue;
  }

  /**
   * Gets portfolio performance (change from first to last)
   */
  static getPortfolioPerformance(): { change: number; changePercent: number } {
    if (this.portfolioHistory.length < 2) {
      return { change: 0, changePercent: 0 };
    }

    const firstValue = this.portfolioHistory[0].totalValue;
    const lastValue =
      this.portfolioHistory[this.portfolioHistory.length - 1].totalValue;
    const change = lastValue - firstValue;
    const changePercent = firstValue > 0 ? (change / firstValue) * 100 : 0;

    return { change, changePercent };
  }

  /**
   * Clears portfolio history
   */
  static clearHistory(): void {
    this.portfolioHistory = [];
  }

  /**
   * Gets all tracked symbols
   */
  static getTrackedSymbols(): string[] {
    if (this.portfolioHistory.length === 0) return [];

    const latestSnapshot =
      this.portfolioHistory[this.portfolioHistory.length - 1];
    return Object.keys(latestSnapshot.symbols);
  }

  /**
   * Private method to calculate total portfolio value
   */
  private static calculateTotalPortfolioValue(
    stockQuotes: StockQuote[]
  ): number {
    return stockQuotes.reduce((total, quote) => {
      return total + (quote.current || 0);
    }, 0);
  }

  /**
   * Private method to extract symbol values
   */
  private static getSymbolValues(
    stockQuotes: StockQuote[]
  ): Record<string, number> {
    const symbolValues: Record<string, number> = {};

    stockQuotes.forEach((quote) => {
      if (quote.current) {
        symbolValues[quote.symbol] = quote.current;
      }
    });

    return symbolValues;
  }
}
