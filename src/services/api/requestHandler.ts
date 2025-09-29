import { InternalAxiosRequestConfig } from "axios";

export const logRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  return config;
};

export const logRequestError = (error: any): Promise<never> => {
  console.error("[API Request Error]", error);
  return Promise.reject(error);
};
