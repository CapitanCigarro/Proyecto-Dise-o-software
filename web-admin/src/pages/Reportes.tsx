import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from '../services/axios';
import '../services/mock';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Envio = {
  id: number;
  cliente: string;
  conductor: string;
  estado: string;
  fecha: string;
  horaAsignacion: string;
  horaEntrega: string;
};

function horaToMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

function tiempoEntregaMinutos(envio: Envio): number {
  return horaToMinutos(envio.horaEntrega) - horaToMinutos(envio.horaAsignacion);
}

const Reportes: React.FC = () => {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('/envios')
      .then(res => {
        setEnvios(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los envíos');
        setLoading(false);
        console.error(err);
      });
  }, []);

  const entregas = useMemo(() => (
    envios.filter(e => e.estado === 'Entregado' && e.horaEntrega !== '---')
  ), [envios]);

  const tiempos = useMemo(() => (
    entregas.map(tiempoEntregaMinutos)
  ), [entregas]);

  const promedio = tiempos.reduce((a, b) => a + b, 0) / tiempos.length || 0;
  const max = tiempos.length ? Math.max(...tiempos) : 0;
  const min = tiempos.length ? Math.min(...tiempos) : 0;

  const rendimiento = useMemo(() => {
    const r: Record<string, { entregas: number; totalTiempo: number }> = {};
    entregas.forEach(e => {
      if (!r[e.conductor]) {
        r[e.conductor] = { entregas: 0, totalTiempo: 0 };
      }
      r[e.conductor].entregas += 1;
      r[e.conductor].totalTiempo += tiempoEntregaMinutos(e);
    });
    return r;
  }, [entregas]);

  const conductores = Object.keys(rendimiento);
  const entregasPorConductor = conductores.map(c => rendimiento[c].entregas);

  const data: ChartData<'bar'> = useMemo(() => ({
    labels: conductores,
    datasets: [
      {
        label: 'Cantidad de entregas',
        data: entregasPorConductor,
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderRadius: 5,
      },
    ],
  }), [conductores, entregasPorConductor]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) return <div style={styles.page}><div style={styles.container}><h2>Cargando datos...</h2></div></div>;
  if (error) return <div style={styles.page}><div style={styles.container}><h2>{error}</h2></div></div>;

  return (
    <div style={styles.page}>
      <div style={styles.backgroundBlur}></div>

      <div style={styles.container}>
        <h1 style={styles.title}>📊 Reportes</h1>

        {/* Métricas principales */}
        <div style={styles.metricsWrapper}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tiempo Promedio</div>
            <div style={styles.cardValue}>{Math.round(promedio)} min</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tiempo Mínimo</div>
            <div style={styles.cardValue}>{min} min</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tiempo Máximo</div>
            <div style={styles.cardValue}>{max} min</div>
          </div>
        </div>

        {/* Tabla de rendimiento por conductor */}
        <div style={styles.lastShipmentsBox}>
          <h2 style={{ ...styles.title, marginBottom: '1rem' }}>🚚 Rendimiento por Conductor</h2>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.tableCell}>Conductor</th>
                <th style={styles.tableCell}>Entregas</th>
                <th style={styles.tableCell}>Tiempo promedio</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map(nombre => {
                const data = rendimiento[nombre];
                return (
                  <tr key={nombre}>
                    <td style={styles.tableCell}>{nombre}</td>
                    <td style={styles.tableCell}>{data.entregas}</td>
                    <td style={styles.tableCell}>{Math.round(data.totalTiempo / data.entregas)} min</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Gráfico de barras */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ ...styles.title, marginBottom: '1rem' }}>📈 Entregas por Conductor</h2>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

// styles igual que antes
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
  metricsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem',
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
  tableCell: {
    borderBottom: '1px solid #ddd',
    padding: '0.5rem',
  },
};

export default Reportes;
