import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import rutaRoutes from './rutas/calcular'; // Importa tus rutas
import asignadas from './rutas/asignadas'; // Importa las rutas asignadas

// Configurar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configurar conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Middleware para parsear JSON
app.use(express.json());

// Monta tus rutas
app.use('/api', rutaRoutes); // Todas tus rutas de API estarán bajo /api
app.use('/api', asignadas);

// Ruta básica
app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});