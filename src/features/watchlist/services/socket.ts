import ReconnectingWebSocket from "reconnecting-websocket";

const FINNHUB_WEBSOCKET_BASE_URL = "wss://ws.finnhub.io";
const WEBSOCKET_INITIAL_RECONNECTION_DELAY_MS = 3000;
const WEBSOCKET_MAXIMUM_RECONNECTION_ATTEMPTS = 10;
const WEBSOCKET_CONNECTION_ESTABLISHMENT_TIMEOUT_MS = 10000;
const WEBSOCKET_MAXIMUM_RECONNECTION_DELAY_MS = 30000;
const WEBSOCKET_RECONNECTION_DELAY_GROWTH_FACTOR = 1.3;

type FinnhubRealTimeTradeData = {
  type: "trade";
  data: Array<{
    s: string; // symbol
    p: number; // price
    t: number; // timestamp
    v: number; // volume
    c?: string[]; // conditions
  }>;
};

type FinnhubSymbolSubscriptionRequest = {
  type: "subscribe";
  symbol: string;
};

type FinnhubSymbolUnsubscriptionRequest = {
  type: "unsubscribe";
  symbol: string;
};

type FinnhubPingMessage = {
  type: "ping";
};

type FinnhubPongMessage = {
  type: "pong";
};

type FinnhubWebSocketMessage =
  | FinnhubRealTimeTradeData
  | FinnhubSymbolSubscriptionRequest
  | FinnhubSymbolUnsubscriptionRequest
  | FinnhubPingMessage
  | FinnhubPongMessage;

type StockTradeDataHandler = (tradeData: FinnhubRealTimeTradeData) => void;
type WebSocketConnectionStateHandler = (isConnectionActive: boolean) => void;

type WebSocketConnectionState = {
  socketInstance: ReconnectingWebSocket | null;
  subscribedStockSymbols: Set<string>;
  registeredTradeDataHandlers: Set<StockTradeDataHandler>;
  registeredConnectionStateHandlers: Set<WebSocketConnectionStateHandler>;
  isCurrentlyConnected: boolean;
};

const webSocketConnectionState: WebSocketConnectionState = {
  socketInstance: null,
  subscribedStockSymbols: new Set<string>(),
  registeredTradeDataHandlers: new Set<StockTradeDataHandler>(),
  registeredConnectionStateHandlers: new Set<WebSocketConnectionStateHandler>(),
  isCurrentlyConnected: false,
};

/**
 * Builds the authenticated WebSocket URL for FinnHub connection
 */
const buildAuthenticatedWebSocketUrl = (): string => {
  const finnhubApiKey = process.env.EXPO_PUBLIC_FINNHUB_API_KEY;
  if (!finnhubApiKey) {
    throw new Error(
      "FinnHub WebSocket requires EXPO_PUBLIC_FINNHUB_API_KEY environment variable"
    );
  }

  const wsUrl = `${FINNHUB_WEBSOCKET_BASE_URL}?token=${finnhubApiKey}`;
  return wsUrl;
};

/**
 * Creates WebSocket configuration options for optimal reconnection behavior
 */
const createWebSocketConnectionOptions = () => ({
  connectionTimeout: WEBSOCKET_CONNECTION_ESTABLISHMENT_TIMEOUT_MS,
  maxRetries: WEBSOCKET_MAXIMUM_RECONNECTION_ATTEMPTS,
  reconnectionDelayGrowFactor: WEBSOCKET_RECONNECTION_DELAY_GROWTH_FACTOR,
  minReconnectionDelay: WEBSOCKET_INITIAL_RECONNECTION_DELAY_MS,
  maxReconnectionDelay: WEBSOCKET_MAXIMUM_RECONNECTION_DELAY_MS,
  debug: __DEV__,
});

/**
 * Sends subscription request for a specific stock symbol
 */
const sendStockSymbolSubscriptionRequest = (stockSymbol: string): void => {
  const { socketInstance } = webSocketConnectionState;

  if (!socketInstance || socketInstance.readyState !== WebSocket.OPEN) {
    console.warn(
      `Cannot subscribe to ${stockSymbol}: WebSocket not connected (state: ${socketInstance?.readyState})`
    );
    return;
  }

  const subscriptionRequest: FinnhubSymbolSubscriptionRequest = {
    type: "subscribe",
    symbol: stockSymbol.toUpperCase(),
  };

  socketInstance.send(JSON.stringify(subscriptionRequest));
};

/**
 * Re-subscribes to all previously subscribed stock symbols after reconnection
 */
const resubscribeToAllStockSymbols = (): void => {
  webSocketConnectionState.subscribedStockSymbols.forEach((stockSymbol) => {
    sendStockSymbolSubscriptionRequest(stockSymbol);
  });
};

/**
 * Notifies all registered connection state handlers about connection changes
 */
const notifyConnectionStateHandlers = (isConnectionActive: boolean): void => {
  webSocketConnectionState.registeredConnectionStateHandlers.forEach(
    (connectionStateHandler) => {
      try {
        connectionStateHandler(isConnectionActive);
      } catch (handlerError) {
        console.error("Error in connection state handler:", handlerError);
      }
    }
  );
};

/**
 * Notifies all registered trade data handlers with incoming trade data
 */
const notifyTradeDataHandlers = (tradeData: FinnhubRealTimeTradeData): void => {
  webSocketConnectionState.registeredTradeDataHandlers.forEach(
    (tradeDataHandler) => {
      try {
        tradeDataHandler(tradeData);
      } catch (handlerError) {
        console.error("Error in trade data handler:", handlerError);
      }
    }
  );
};

/**
 * Handles WebSocket connection establishment
 */
const handleWebSocketConnectionOpen = (): void => {
  webSocketConnectionState.isCurrentlyConnected = true;
  notifyConnectionStateHandlers(true);
  resubscribeToAllStockSymbols();
};

/**
 * Handles incoming WebSocket messages
 */
const handleIncomingWebSocketMessage = (messageEvent: MessageEvent): void => {
  try {
    const parsedMessage: FinnhubWebSocketMessage = JSON.parse(
      messageEvent.data
    );

    if (parsedMessage.type === "trade") {
      notifyTradeDataHandlers(parsedMessage);
    } else if (parsedMessage.type === "ping") {
      webSocketConnectionState.socketInstance?.send(
        JSON.stringify({ type: "pong" })
      );
    } else {
      console.warn("Unknown message type:", parsedMessage.type);
    }
  } catch (messageParsingError) {
    console.error("Raw message data:", messageEvent.data);
  }
};

/**
 * Handles WebSocket connection errors
 */
const handleWebSocketConnectionError = (errorEvent: Event): void => {
  console.error("FinnHub WebSocket connection error:", errorEvent);

  webSocketConnectionState.isCurrentlyConnected = false;
  notifyConnectionStateHandlers(false);
};

/**
 * Handles WebSocket connection closure
 */
const handleWebSocketConnectionClose = (closeEvent?: CloseEvent): void => {
  webSocketConnectionState.isCurrentlyConnected = false;
  notifyConnectionStateHandlers(false);
};

/**
 * Sets up event listeners for WebSocket connection lifecycle events
 */
const setupWebSocketEventListeners = (
  socketInstance: ReconnectingWebSocket
): void => {
  socketInstance.addEventListener("open", handleWebSocketConnectionOpen);
  socketInstance.addEventListener("message", handleIncomingWebSocketMessage);
  socketInstance.addEventListener("error", handleWebSocketConnectionError);
  socketInstance.addEventListener("close", handleWebSocketConnectionClose);
};

/**
 * Initializes WebSocket connection with reconnection capabilities
 */
const initializeWebSocketConnection = (): void => {
  if (webSocketConnectionState.socketInstance?.readyState === WebSocket.OPEN) {
    return; // Connection already established
  }

  const authenticatedWebSocketUrl = buildAuthenticatedWebSocketUrl();

  const connectionOptions = createWebSocketConnectionOptions();

  webSocketConnectionState.socketInstance = new ReconnectingWebSocket(
    authenticatedWebSocketUrl,
    [],
    connectionOptions
  );

  setupWebSocketEventListeners(webSocketConnectionState.socketInstance);
};

/**
 * Subscribes to real-time stock data for specified symbols
 * @param targetStockSymbols - Array of stock symbols to monitor
 * @param tradeDataHandler - Function to handle incoming real-time trade data
 * @returns Cleanup function to unsubscribe from all symbols
 */
export const subscribeToStockRealTimeData = (
  targetStockSymbols: string[],
  tradeDataHandler: StockTradeDataHandler
): (() => void) => {
  initializeWebSocketConnection();

  // Register the trade data handler
  webSocketConnectionState.registeredTradeDataHandlers.add(tradeDataHandler);

  // Subscribe to new stock symbols
  targetStockSymbols.forEach((stockSymbol) => {
    const normalizedStockSymbol = stockSymbol.toUpperCase();
    if (
      !webSocketConnectionState.subscribedStockSymbols.has(
        normalizedStockSymbol
      )
    ) {
      webSocketConnectionState.subscribedStockSymbols.add(
        normalizedStockSymbol
      );
      if (webSocketConnectionState.isCurrentlyConnected) {
        sendStockSymbolSubscriptionRequest(normalizedStockSymbol);
      }
    }
  });

  // Return cleanup function
  return () => {
    webSocketConnectionState.registeredTradeDataHandlers.delete(
      tradeDataHandler
    );

    // If no more handlers remain, disconnect and clean up
    if (webSocketConnectionState.registeredTradeDataHandlers.size === 0) {
      disconnectWebSocketConnection();
    }
  };
};

/**
 * Registers a handler for WebSocket connection state changes
 * @param connectionStateHandler - Function to call when connection state changes
 * @returns Cleanup function to unregister the handler
 */
export const onWebSocketConnectionStateChange = (
  connectionStateHandler: WebSocketConnectionStateHandler
): (() => void) => {
  webSocketConnectionState.registeredConnectionStateHandlers.add(
    connectionStateHandler
  );

  // Immediately notify with current connection state
  connectionStateHandler(webSocketConnectionState.isCurrentlyConnected);

  // Return cleanup function
  return () => {
    webSocketConnectionState.registeredConnectionStateHandlers.delete(
      connectionStateHandler
    );
  };
};

/**
 * Gets the current WebSocket connection status
 * @returns True if WebSocket is currently connected, false otherwise
 */
export const isWebSocketCurrentlyConnected = (): boolean => {
  return webSocketConnectionState.isCurrentlyConnected;
};

/**
 * Manually disconnects WebSocket and cleans up all resources
 * Use sparingly - typically only needed for app shutdown
 */
export const disconnectWebSocketConnection = (): void => {
  if (webSocketConnectionState.socketInstance) {
    webSocketConnectionState.socketInstance.close();
    webSocketConnectionState.socketInstance = null;
  }

  webSocketConnectionState.subscribedStockSymbols.clear();
  webSocketConnectionState.registeredTradeDataHandlers.clear();
  webSocketConnectionState.registeredConnectionStateHandlers.clear();
  webSocketConnectionState.isCurrentlyConnected = false;
};

export type {
  FinnhubRealTimeTradeData,
  FinnhubSymbolSubscriptionRequest,
  FinnhubSymbolUnsubscriptionRequest,
  FinnhubWebSocketMessage,
  StockTradeDataHandler,
  WebSocketConnectionStateHandler,
  WebSocketConnectionState,
};
