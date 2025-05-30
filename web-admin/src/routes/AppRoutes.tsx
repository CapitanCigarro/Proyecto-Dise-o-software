// src/routes/AppRoutes.tsx (o donde estés guardando tus rutas)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Envios from '../pages/Envios';
import PrivateRoute from '../components/PrivateRoute';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { userToken } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={userToken ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute requiredRole="admin">
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/envios"
        element={
          <PrivateRoute requiredRole="admin">
            <Envios />
          </PrivateRoute>
        }
      />
      <Route path="/no-autorizado" element={<div>Acceso denegado: solo administradores pueden ingresar</div>} />
    </Routes>
  );
};

export default AppRoutes;
