import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


type Props = {
  children: React.ReactElement; 
  requiredRole?: string;
};


const PrivateRoute = ({ children, requiredRole }: Props) => {
  // Obtiene informacion del contexto de autenticacion
  const { userToken, userRole, isLoading } = useAuth();

  // Estado de autenticacion en consola
  console.log('PrivateRoute =>', { userToken, userRole, isLoading });


  if (isLoading) return <div>Cargando...</div>;

  // Sin token, entonces el usuario no ha iniciado sesion
  if (!userToken) {
    console.log('No token encontrado, redirigiendo a /login');
    return <Navigate to="/login" />;
  }

  // Si se requiere un rol especifico y el rol del usuario no coincide no se autoriza
  if (requiredRole && userRole !== requiredRole) {
    console.log('Rol no autorizado, redirigiendo a /no-autorizado');
    return <Navigate to="/no-autorizado" />;
  }

  return children;
};

export default PrivateRoute; 
