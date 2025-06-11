import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db'; // Importamos el pool ya configurado
import userRoutes from './routes/userRoutes';
import paqueteRoutes from './routes/paqueteRoutes';
import osrmRoutes from './routes/osrm';
import rutaRoutes from './routes/rutaRoutes';

// Load environment variables first
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/paquetes', paqueteRoutes);
app.use('/api/osrm', osrmRoutes);
app.use('/api/rutas', rutaRoutes);

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

// Ruta de prueba simple
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
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