import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { StorageKey } from "../../../storage/types";
import {
  AUTH_CONFIG,
  AUTH_ERRORS,
  AUTH_RESULT_TYPES,
} from "../constants/authConstants";
import {
  buildAuthUrl,
  buildRedirectUri,
  extractTokensFromUrl,
  getAuthConfig,
  type TokenResult,
} from "../utils/authUtils";

export const getStoredToken = async (): Promise<string | null> => {
  if (!StorageKey.AuthToken) {
    throw new Error(AUTH_ERRORS.MISSING_STORAGE_KEY);
  }
  return await SecureStore.getItemAsync(StorageKey.AuthToken);
};

export const storeToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(StorageKey.AuthToken, token);
};

export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(StorageKey.AuthToken);
};

const handleSuccessResult = (url: string): string => {
  const { accessToken, error, errorDescription }: TokenResult =
    extractTokensFromUrl(url);

  if (error) {
    throw new Error(`Auth0 Error: ${error} - ${errorDescription}`);
  }

  if (!accessToken) {
    throw new Error(AUTH_ERRORS.NO_ACCESS_TOKEN);
  }

  return accessToken;
};

export const authenticate = async (): Promise<string> => {
  const { domain, clientId } = getAuthConfig();
  const redirectUri = buildRedirectUri();
  const authUrl = buildAuthUrl(domain, clientId, redirectUri);

  const timeout = setTimeout(() => {
    WebBrowser.dismissBrowser();
  }, AUTH_CONFIG.TIMEOUT_MS);

  try {
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    clearTimeout(timeout);

    if (result.type === AUTH_RESULT_TYPES.SUCCESS) {
      return handleSuccessResult(result.url);
    }

    if (result.type === AUTH_RESULT_TYPES.CANCEL) {
      throw new Error("Authentication cancelled by user");
    }

    throw new Error("Authentication failed");
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};
