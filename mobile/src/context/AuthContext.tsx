import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  token: string;
  role: string;
  name?: string;
  email?: string;
};

type AuthContextType = {
  isLoading: boolean;
  userToken: string | null;
  userRole: string | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Load user data from storage
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserToken(user.token);
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (user: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUserToken(user.token);
      setUserRole(user.role);
    } catch (error) {
      console.error('Failed to save user data', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUserToken(null);
      setUserRole(null);
    } catch (error) {
      console.error('Failed to remove user data', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, userRole, login, logout }}>
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