import React, { createContext, useContext, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { StorageKey } from "../../storage/types";

type AuthState = {
  token?: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!StorageKey.AuthToken) {
          throw new Error("StorageKey.AuthToken is undefined");
        }
        const authToken = await SecureStore.getItemAsync(StorageKey.AuthToken);
        setToken(authToken ?? null);
      } catch (error) {
        console.error('Error loading auth token:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async () => {
    try {
      const AUTH0_DOMAIN = Constants.expoConfig?.extra?.AUTH0_DOMAIN;
      const AUTH0_CLIENT_ID = Constants.expoConfig?.extra?.AUTH0_CLIENT_ID;
      const redirectUri = AuthSession.makeRedirectUri({});
      const authUrl = `https://${AUTH0_DOMAIN}/authorize?client_id=${AUTH0_CLIENT_ID}&response_type=token&scope=openid profile email&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (
        (result as any).type === "success" &&
        (result as any).params?.access_token
      ) {
        const accessToken = (result as any).params.access_token;
        setToken(accessToken);
        await SecureStore.setItemAsync(StorageKey.AuthToken, accessToken);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    setToken(null);
    await SecureStore.deleteItemAsync(StorageKey.AuthToken);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error("useAuth must be used inside AuthProvider");
  return authContext;
};
