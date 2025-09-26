import { AxiosError } from "axios";

export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorType {
  RESPONSE_ERROR = "RESPONSE_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  REQUEST_SETUP_ERROR = "REQUEST_SETUP_ERROR",
}

export interface ApiErrorInfo {
  type: ErrorType;
  status?: number;
  message: string;
  url?: string;
  data?: any;
}

export type ApiError = AxiosError;
