import Constants from "expo-constants";
import { StockQuote } from "../types";
import apiClient from "./apiClient";

const FINNHUB_API_BASE =
  process.env.EXPO_PUBLIC_FINNHUB_API_BASE || "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

export async function fetchQuote(symbol: string): Promise<StockQuote> {
  const res = await apiClient.get(`${FINNHUB_API_BASE}/quote`, {
    params: { symbol, token: FINNHUB_API_KEY },
  });
  return {
    symbol,
    current: res.data.c,
    changePercent: res.data.dp,
    timestamp: res.data.t,
  } as StockQuote;
}

export async function searchSymbols(symbol: string) {
  const res = await apiClient.get(`${FINNHUB_API_BASE}/search`, {
    params: { q: symbol, token: FINNHUB_API_KEY },
  });
  return res.data.result;
}
