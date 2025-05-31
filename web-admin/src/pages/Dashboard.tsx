import React, { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import axios from '../services/axios';
import '../services/mock';

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

  const [metrics, setMetrics] = useState({
    totalEnvios: 0,
    entregados: 0,
    pendientes: 0,
    conductoresActivos: 0,
    tasaEntregaATiempo: '0%',
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  type Envio = {
  id: string;
  cliente: string;
  conductor: string;
  estado: string;
  fecha: string;
};

const [ultimosEnvios, setUltimosEnvios] = useState<Envio[]>([]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/dashboard');
        const data = response.data;

        setMetrics(data.metrics);
        setChartData(data.chartData);
        setUltimosEnvios(data.ultimosEnvios);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.backgroundBlur} />
      <div style={styles.container}>
        <h1 style={styles.title}>Panel de Administración</h1>
        <p style={styles.subtitle}>Resumen general del estado del sistema.</p>

        {/* METRICAS */}
        <div style={styles.metricsWrapper}>
          <Card title="Total Envíos Hoy" value={metrics.totalEnvios} />
          <Card title="Entregados" value={metrics.entregados} />
          <Card title="Pendientes" value={metrics.pendientes} />
          <Card title="Conductores Activos" value={metrics.conductoresActivos} />
          <Card title="Entregas a Tiempo" value={metrics.tasaEntregaATiempo} />
        </div>

        {/* GRAFICO */}
        <div style={styles.chartWrapper}>
          <h2>Entregas por Día</h2>
          <div style={styles.chartBox}>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* ÚLTIMOS ENVÍOS */}
        <div style={styles.lastShipmentsWrapper}>
          <h2>Últimos Envíos</h2>
          <div style={styles.lastShipmentsBox}>
            <table cellPadding={10} style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Conductor</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ultimosEnvios.map((envio) => (
                  <tr key={envio.id}>
                    <td>{envio.id}</td>
                    <td>{envio.cliente}</td>
                    <td>{envio.conductor}</td>
                    <td>{envio.estado}</td>
                    <td>{envio.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACCESOS RAPIDOS */}
        <div style={styles.quickAccessWrapper}>
          <button onClick={() => navigate('/envios')} style={styles.button}>Ver Envíos</button>
          <button onClick={() => navigate('/asignar-rutas')} style={styles.button}>Asignar Rutas</button>
          <button onClick={() => navigate('/reportes')} style={styles.button}>Ver Reportes</button>
          <button
            onClick={logout}
            style={{ ...styles.button, ...styles.logoutButton }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

type CardProps = {
  title: string;
  value: number | string;
};

const Card = ({ title, value }: CardProps) => (
  <div style={styles.card}>
    <h2 style={styles.cardTitle}>{title}</h2>
    <p style={styles.cardValue}>{value}</p>
  </div>
);

const styles: { [key: string]: CSSProperties } = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    overflow: 'hidden',
},

  backgroundBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url('/Wallpaper.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',
    zIndex: 0,
},
  container: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '1200px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    overflowY: 'auto',
    maxHeight: '100%',
},

  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  metricsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
  },
  chartWrapper: {
    marginTop: '3rem',
  },
  chartBox: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    height: 'clamp(400px, 80vh, 600px)',
  },
  lastShipmentsWrapper: {
    marginTop: '3rem',
  },
  lastShipmentsBox: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
  },
  quickAccessWrapper: {
    marginTop: '3rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.75rem 1.2rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.2rem',
    minWidth: '150px',
    textAlign: 'center',
    flex: 1,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  cardValue: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#4F46E5',
  },
};

export default Dashboard;
