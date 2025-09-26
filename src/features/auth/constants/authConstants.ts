/**
 * Auth0 Configuration Constants
 * Following Single Responsibility Principle
 */

export const AUTH_CONFIG = {
  SCHEME: "finnhubstockalert",
  PATH: "auth/callback",
  RESPONSE_TYPE: "token",
  SCOPE: "openid profile email",
  TIMEOUT_MS: 15000,
} as const;

export const AUTH_ERRORS = {
  MISSING_CONFIG:
    "Auth0 configuration is missing. Please check your environment variables.",
  MISSING_STORAGE_KEY: "StorageKey.AuthToken is undefined",
  NO_ACCESS_TOKEN: "No access token received from Auth0",
  PROVIDER_NOT_FOUND: "useAuth must be used inside AuthProvider",
} as const;

export const AUTH_RESULT_TYPES = {
  SUCCESS: "success",
  CANCEL: "cancel",
} as const;
