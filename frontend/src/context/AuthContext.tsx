import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';
import { getToken, setTokens, removeTokens, decodeToken } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      const { data } = await authApi.getMe();
      setUser(data.user);
    } catch {
      removeTokens();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  };

  const register = async (registerData: any) => {
    const { data } = await authApi.register(registerData);
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('edu_refresh_token');
    if (refreshToken) {
      authApi.logout(refreshToken).catch(() => {});
    }
    removeTokens();
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('❌ useAuth يجب استخدامه داخل AuthProvider');
  return context;
};
