import { InternalAxiosRequestConfig } from "axios";

export const logRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
};

export const logRequestError = (error: any): Promise<never> => {
  console.error("[API Request Error]", error);
  return Promise.reject(error);
};
