import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import Envios from './pages/Envios';

function AppRoutes() {
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
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
