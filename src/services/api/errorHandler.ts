import { HttpStatusCode, ErrorType, ApiErrorInfo, ApiError } from "./types";

const ERROR_MESSAGES: Record<HttpStatusCode, string> = {
  [HttpStatusCode.BAD_REQUEST]: "Bad Request",
  [HttpStatusCode.UNAUTHORIZED]: "Unauthorized - API key may be invalid",
  [HttpStatusCode.FORBIDDEN]:
    "Forbidden - API key may not have required permissions",
  [HttpStatusCode.NOT_FOUND]: "Not Found - Resource does not exist",
  [HttpStatusCode.TOO_MANY_REQUESTS]: "Rate Limited - Too many requests",
  [HttpStatusCode.INTERNAL_SERVER_ERROR]:
    "Server Error - Internal server error",
};

export const getErrorMessage = (status: HttpStatusCode): string => {
  return ERROR_MESSAGES[status] || `HTTP Error: ${status}`;
};

export const extractErrorInfo = (error: ApiError): ApiErrorInfo => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      type: ErrorType.RESPONSE_ERROR,
      status,
      message: getErrorMessage(status as HttpStatusCode),
      url: error.config?.url,
      data,
    };
  } else if (error.request) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: "Network Error - No response received",
      url: error.config?.url,
    };
  } else {
    return {
      type: ErrorType.REQUEST_SETUP_ERROR,
      message: `Request Setup Error: ${error.message}`,
      url: error.config?.url,
    };
  }
};

export const logError = (errorInfo: ApiErrorInfo): void => {
  const { type, status, message, url, data } = errorInfo;

  console.error(`[API Error] ${message}`, {
    type,
    status,
    url,
    ...(data && { data }),
  });
};

export const handleApiError = (error: ApiError): Promise<never> => {
  const errorInfo = extractErrorInfo(error);
  logError(errorInfo);
  return Promise.reject(error);
};
