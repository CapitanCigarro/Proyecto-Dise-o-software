import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido al Panel de Administración</h1>
      <p>Aquí irán las métricas y opciones administrativas.</p>

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
