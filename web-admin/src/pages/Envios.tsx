import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import '../services/mock';

interface Envio {
  id: number;
  cliente: string;
  conductor: string;
  estado: 'Pendiente' | 'En camino' | 'Entregado' | 'Cancelado';
  fecha: string;
  horaAsignacion: string;
  horaEntrega: string;
}

const estados = ['todos', 'Pendiente', 'En camino', 'Entregado', 'Cancelado'];

const Envios = () => {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroFecha, setFiltroFecha] = useState<string>(''); // formato yyyy-mm-dd
  const [filtroConductor, setFiltroConductor] = useState<string>('todos');

  useEffect(() => {
    axios.get('/envios')
      .then(res => setEnvios(res.data))
      .catch(err => {
        console.error('Error cargando envíos:', err);
        setEnvios([]);
      });
  }, []);

  const conductoresUnicos = Array.from(new Set(envios.map(e => e.conductor)));

  const enviosFiltrados = envios.filter(envio => {
    const matchEstado = filtroEstado === 'todos' || envio.estado === filtroEstado;
    const matchFecha = !filtroFecha || envio.fecha === filtroFecha;
    const matchConductor = filtroConductor === 'todos' || envio.conductor === filtroConductor;
    return matchEstado && matchFecha && matchConductor;
  });

  return (
    <div style={styles.page}>
      <div style={styles.backgroundBlur}></div>
      <div style={styles.container}>
        <h2 style={styles.title}>Listado de envíos diarios</h2>

        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <label style={{ marginRight: '1rem' }}>
            Estado:{' '}
            <select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px' }}
            >
              {estados.map(estado => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label style={{ marginRight: '1rem' }}>
            Fecha:{' '}
            <input
              type="date"
              value={filtroFecha}
              onChange={e => setFiltroFecha(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px' }}
            />
          </label>

          <label>
            Conductor:{' '}
            <select
              value={filtroConductor}
              onChange={e => setFiltroConductor(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px' }}
            >
              <option value="todos">Todos</option>
              {conductoresUnicos.map(conductor => (
                <option key={conductor} value={conductor}>
                  {conductor}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={styles.lastShipmentsBox}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Conductor</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Hora Asignación</th>
                <th>Hora Entrega</th>
              </tr>
            </thead>
            <tbody>
              {enviosFiltrados.map(envio => (
                <tr key={envio.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{envio.id}</td>
                  <td>{envio.cliente}</td>
                  <td>{envio.conductor}</td>
                  <td>{envio.estado}</td>
                  <td>{envio.fecha}</td>
                  <td>{envio.horaAsignacion}</td>
                  <td>{envio.horaEntrega}</td>
                </tr>
              ))}
              {enviosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '1rem' }}>
                    No hay envíos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const styles: { [key: string]: React.CSSProperties } = {
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
};

export default Envios;
