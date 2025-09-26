import * as AuthSession from "expo-auth-session";
import { AUTH_CONFIG, AUTH_ERRORS } from "../constants/authConstants";

export interface AuthConfig {
  domain: string;
  clientId: string;
}

export interface TokenResult {
  accessToken: string | null;
  error: string | null;
  errorDescription: string | null;
}

export const buildAuthUrl = (
  domain: string,
  clientId: string,
  redirectUri: string
): string => {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: AUTH_CONFIG.RESPONSE_TYPE,
    scope: AUTH_CONFIG.SCOPE,
    redirect_uri: redirectUri,
    audience: `https://${domain}/api/v2/`,
  });

  return `https://${domain}/authorize?${params.toString()}`;
};

export const buildRedirectUri = (): string => {
  return AuthSession.makeRedirectUri({
    scheme: AUTH_CONFIG.SCHEME,
    path: AUTH_CONFIG.PATH,
  });
};

export const extractTokensFromUrl = (url: string): TokenResult => {
  const urlObj = new URL(url);
  const fragment = urlObj.hash.substring(1);
  const params = new URLSearchParams(fragment);

  return {
    accessToken: params.get("access_token"),
    error: params.get("error"),
    errorDescription: params.get("error_description"),
  };
};

export const getAuthConfig = (): AuthConfig => {
  const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    throw new Error(AUTH_ERRORS.MISSING_CONFIG);
  }

  return { domain, clientId };
};
