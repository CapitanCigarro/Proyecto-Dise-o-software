import React, { createContext, useState, useEffect, useContext } from 'react';

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
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Cargar datos del usuario de localStorage cuando inicia la app
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserToken(user.token);
      setUserRole(user.role);
    }
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      setUserToken(user.token);
      setUserRole(user.role);
    } catch (error) {
      console.error('Failed to save user data', error);
      // Podrías lanzar o manejar el error aquí
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUserToken(null);
      setUserRole(null);
    } catch (error) {
      console.error('Failed to remove user data', error);
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
