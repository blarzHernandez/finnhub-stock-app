import axios, { AxiosInstance, AxiosResponse } from "axios";
import { handleApiError } from "./api/errorHandler";
import { logRequest, logRequestError } from "./api/requestHandler";

const API_CONFIG = {
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
} as const;

const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor
apiClient.interceptors.request.use(logRequest, logRequestError);

// Response interceptor with centralized error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  handleApiError
);

export default apiClient;
