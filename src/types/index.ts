export type StockQuote = {
  symbol: string;
  current: number;
  changePercent: number | null;
  timestamp: number;
};

export type AlertItem = {
  id: string;
  symbol: string;
  price: number;
  enabled: boolean;
  lastTriggeredAt?: number;
  cooldownMilliseconds?: number;
};
