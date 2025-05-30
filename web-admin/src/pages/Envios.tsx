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
    <div style={{ padding: '2rem' }}>
      <h2>Listado de envíos diarios</h2>

      <label>
        Filtrar por estado:{' '}
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          {estados.map(estado => (
            <option key={estado} value={estado}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc' }}>ID</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Cliente</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Conductor</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Estado</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Fecha</th>
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
  );
};

export default Envios;
