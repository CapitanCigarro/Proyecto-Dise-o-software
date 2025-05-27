import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: React.ReactElement;  // Esto es lo más común para envolver componentes
  requiredRole?: string;
};


const PrivateRoute = ({ children, requiredRole }: Props) => {
  const { userToken, userRole, isLoading } = useAuth();

  console.log('PrivateRoute =>', { userToken, userRole, isLoading });

  if (isLoading) return <div>Cargando...</div>;

  if (!userToken) {
    console.log('No token encontrado, redirigiendo a /login');
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log('Rol no autorizado, redirigiendo a /no-autorizado');
    return <Navigate to="/no-autorizado" />;
  }

  return children;
};

export default PrivateRoute;  // <-- Aquí el default export
