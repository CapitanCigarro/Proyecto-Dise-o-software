import express from 'express';
import userRoutes from './routes/userRoutes';
import paqueteRoutes from './routes/paqueteRoutes';
import pool from './db'; // Importa tu pool de conexiones

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/paquetes', paqueteRoutes);


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


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  
  // Verificación de conexión al iniciar
  try {
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    client.release();
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error);
  }
});