import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, authApi, setAuthTokens, clearAuthTokens, getAuthToken, getRefreshToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch (error) {
      // Try to refresh the token
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const tokens = await authApi.refresh(refreshToken);
          setAuthTokens(tokens.access_token, tokens.refresh_token);
          const userData = await authApi.me();
          setUser(userData);
        } catch {
          clearAuthTokens();
          setUser(null);
        }
      } else {
        clearAuthTokens();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (username: string, password: string) => {
    const tokens = await authApi.login({ username, password });
    setAuthTokens(tokens.access_token, tokens.refresh_token);
    await refreshUser();
  };

  const register = async (username: string, password: string, confirmPassword: string) => {
    await authApi.register({ username, password, confirm_password: confirmPassword });
    await login(username, password);
  };

  const logout = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // Ignore logout errors
      }
    }
    clearAuthTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
