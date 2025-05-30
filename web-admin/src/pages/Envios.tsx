import React, { useState } from 'react';

interface Envio {
  id: number;
  cliente: string;
  conductor: string;
  estado: 'pendiente' | 'en camino' | 'entregado' | 'cancelado';
  fecha: string;
}

const datosMock: Envio[] = [
  { id: 1, cliente: 'Juan Pérez', conductor: 'Carlos', estado: 'pendiente', fecha: '2025-05-27' },
  { id: 2, cliente: 'María López', conductor: 'Ana', estado: 'en camino', fecha: '2025-05-27' },
  { id: 3, cliente: 'Luis Gómez', conductor: 'Carlos', estado: 'entregado', fecha: '2025-05-26' },
  { id: 4, cliente: 'Sofía Díaz', conductor: 'Ana', estado: 'cancelado', fecha: '2025-05-25' },
];

const estados = ['todos', 'pendiente', 'en camino', 'entregado', 'cancelado'];

const Envios = () => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const enviosFiltrados = filtroEstado === 'todos'
    ? datosMock
    : datosMock.filter(envio => envio.estado === filtroEstado);

  return (
    <div style={styles.page}>
      <div style={styles.backgroundBlur}></div>
      <div style={styles.container}>
        <h2 style={styles.title}>Listado de envíos diarios</h2>

        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <label>
            Filtrar por estado:{' '}
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
                </tr>
              ))}
              {enviosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
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
  },
};

export default Envios;
