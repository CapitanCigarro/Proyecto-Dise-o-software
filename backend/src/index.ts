import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';

import cors from 'cors';
import osrmRoutes from './routes/osrm';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});