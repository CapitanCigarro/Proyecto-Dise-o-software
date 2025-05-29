import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Datos mock que luego puedes reemplazar por API calls
  const metrics = {
    totalEnvios: 120,
    entregados: 85,
    pendientes: 35,
    conductoresActivos: 8,
    tasaEntregaATiempo: '91%',
  };

  const chartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
    datasets: [
      {
        label: 'Entregas por día',
        data: [20, 25, 22, 30, 28],
        backgroundColor: '#4F46E5',
      },
    ],
  };

  const ultimosEnvios = [
    { id: 'PKG-001', cliente: 'Juan Pérez', estado: 'Entregado', fecha: '2025-05-27' },
    { id: 'PKG-002', cliente: 'María González', estado: 'Pendiente', fecha: '2025-05-28' },
    { id: 'PKG-003', cliente: 'Pedro Ramírez', estado: 'En ruta', fecha: '2025-05-28' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel de Administración</h1>
      <p>Resumen general del estado del sistema.</p>

      {/* MÉTRICAS */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Card title="Total Envíos Hoy" value={metrics.totalEnvios} />
        <Card title="Entregados" value={metrics.entregados} />
        <Card title="Pendientes" value={metrics.pendientes} />
        <Card title="Conductores Activos" value={metrics.conductoresActivos} />
        <Card title="Entregas a Tiempo" value={metrics.tasaEntregaATiempo} />
      </div>

      {/* GRÁFICO */}
      <div style={{ marginTop: '3rem' }}>
        <h2>Entregas por Día</h2>
        <Bar data={chartData} />
      </div>

      {/* ÚLTIMOS ENVÍOS */}
      <div style={{ marginTop: '3rem' }}>
        <h2>Últimos Envíos</h2>
        <table border={1} cellPadding={10} style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ultimosEnvios.map((envio) => (
              <tr key={envio.id}>
                <td>{envio.id}</td>
                <td>{envio.cliente}</td>
                <td>{envio.estado}</td>
                <td>{envio.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => navigate('/envios')}>Ver Envíos</button>
        <button onClick={() => navigate('/asignar-rutas')}>Asignar Rutas</button>
        <button onClick={() => navigate('/reportes')}>Ver Reportes</button>
        <button onClick={logout} style={{ marginLeft: 'auto' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

type CardProps = {
  title: string;
  value: number | string;
};

const Card = ({ title, value }: CardProps) => (
  <div
    style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      minWidth: '150px',
      textAlign: 'center',
    }}
  >
    <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h2>
    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
  </div>
);

export default Dashboard;
