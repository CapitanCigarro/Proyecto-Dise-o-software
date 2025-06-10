import express from 'express';
import userRoutes from './routes/userRoutes';
import paqueteRoutes from './routes/paqueteRoutes';
import pool from './db'; // Importa tu pool de conexiones
import dotenv from 'dotenv';
import { Pool } from 'pg';

import cors from 'cors';
import osrmRoutes from './routes/osrm';

app.use(express.json());
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use('/api/users', userRoutes);
app.use('/api/paquetes', paqueteRoutes);

// Configurar conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/osrm', osrmRoutes);

// Ruta de prueba de conexión a la base de datos
app.get('/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    res.json({
      message: 'Conexión exitosa a PostgreSQL',
      time: result.rows[0].current_time
    });
  } catch (error) {
    console.error('Error de conexión:', error);
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
});

const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    client.release();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error);
  }
};

startServer();