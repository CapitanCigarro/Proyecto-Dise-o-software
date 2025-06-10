import React, { createContext, useState, useEffect, useContext } from 'react';


// Representa la informacion de un usuario autenticado
type User = {
  token: string;
  role: string;
  name?: string;
  email?: string;
};

// Contexto de autenticacion
type AuthContextType = {
  isLoading: boolean;
  userToken: string | null;
  userRole: string | null;
  login: (user: User) => void;
  logout: () => void;
};

// Creacion del contexto de autenticacion
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto de autenticacion
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Cargar los datos de usuario desde localStorage al iniciar la app
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserToken(user.token);
      setUserRole(user.role);
    }
    setIsLoading(false); // Marca que ya se ha cargado el estado
  }, []);

  // Funcion para iniciar sesion, guarda datos en localStorage y actualiza el estado
  const login = (user: User) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      setUserToken(user.token);
      setUserRole(user.role);
    } catch (error) {
      console.error('Failed to save user data', error);
    }
  };

  // Funcion para cerrar sesion, elimina datos de localStorage y limpia el estado
  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUserToken(null);
      setUserRole(null);
    } catch (error) {
      console.error('Failed to remove user data', error);
    }
  };

  // Provee el contexto a todos los componentes hijos
  return (
    <AuthContext.Provider value={{ isLoading, userToken, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
