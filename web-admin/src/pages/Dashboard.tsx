import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleIrAEnvios = () => {
    navigate('/envios');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido al Panel de Administración</h1>
      <p>Aquí irán las métricas y opciones administrativas.</p>

      <button
        onClick={handleIrAEnvios}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Ver listado de envíos diarios
      </button>

      <button
        onClick={logout}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
