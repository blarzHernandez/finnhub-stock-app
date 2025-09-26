import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { authenticate, getStoredToken, storeToken, removeToken } from './services/authService';
import { AUTH_ERRORS } from './constants/authConstants';


interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}


const AuthContext = createContext<AuthState | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        const storedToken = await getStoredToken();
        setToken(storedToken);
      } catch (error) {
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (): Promise<void> => {
    try {
      const accessToken = await authenticate();
      await storeToken(accessToken);
      setToken(accessToken);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await removeToken();
      setToken(null);
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = Boolean(token);

  const contextValue: AuthState = {
    token,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(AUTH_ERRORS.PROVIDER_NOT_FOUND);
  }

  return context;
};
