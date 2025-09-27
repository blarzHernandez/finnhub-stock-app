declare module "reconnecting-websocket" {
  interface Options {
    connectionTimeout?: number;
    maxRetries?: number;
    maxReconnectionDelay?: number;
    minReconnectionDelay?: number;
    reconnectionDelayGrowFactor?: number;
    debug?: boolean;
  }

  export default class ReconnectingWebSocket extends WebSocket {
    constructor(url: string, protocols?: string | string[], options?: Options);

    readonly readyState: number;
    readonly url: string;

    close(code?: number, reason?: string): void;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;

    addEventListener(type: "open", listener: (event: Event) => void): void;
    addEventListener(
      type: "close",
      listener: (event: CloseEvent) => void
    ): void;
    addEventListener(type: "error", listener: (event: Event) => void): void;
    addEventListener(
      type: "message",
      listener: (event: MessageEvent) => void
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject
    ): void;

    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject
    ): void;
  }
}
