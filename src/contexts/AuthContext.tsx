import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, UserResponse } from '../services/api';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<UserResponse | null>;
  updateProfile: (data: { name?: string; password?: string }) => Promise<UserResponse>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncCurrentUser = (userData: UserResponse) => {
    setUser(userData);
    return userData;
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const userData = await apiService.getCurrentUser();
      return syncCurrentUser(userData);
    } catch (err) {
      localStorage.removeItem('access_token');
      setUser(null);
      return null;
    }
  };

  // 초기 로드 시 토큰이 있으면 사용자 정보 불러오기
  useEffect(() => {
    const initializeAuth = async () => {
      await refreshUser();
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await apiService.login({ email, password });
      
      // 토큰 저장
      localStorage.setItem('access_token', response.access_token);

      // 사용자 정보 조회
      const userData = await apiService.getCurrentUser();
      syncCurrentUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setError(errorMessage);
      throw err;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      await apiService.register({ name, email, password });
      
      // 회원가입 후 자동으로 로그인
      await login(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        refreshUser,
        updateProfile: async (data) => {
          const updatedUser = await apiService.updateCurrentUser(data);
          syncCurrentUser(updatedUser);
          return updatedUser;
        },
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
