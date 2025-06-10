import { Router } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';

const router = Router();

/**
 * Ruta TEMPORAL para actualizar todas las contraseñas existentes a formato hash
 * IMPORTANTE: Eliminar esta ruta después de usarla una vez
 */
router.post('/update-passwords', async (req, res) => {
  try {
    // 1. Obtener todos los usuarios
    const result = await pool.query('SELECT * FROM Diseno.Usuarios');
    console.log(`Encontrados ${result.rows.length} usuarios para actualizar`);
    
    // 2. Para cada usuario, hashear y actualizar su contraseña
    for (const user of result.rows) {
      // Hashear la contraseña actual
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.usuario_password, salt);
      
      console.log(`Actualizando contraseña para: ${user.usuario_correo}`);
      
      // Actualizar en la base de datos
      await pool.query(
        'UPDATE Diseno.Usuarios SET usuario_password = $1 WHERE usuario_correo = $2',
        [hashedPassword, user.usuario_correo]
      );
    }
    
    res.json({ 
      message: 'Contraseñas actualizadas correctamente',
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error al actualizar contraseñas:', error);
    res.status(500).json({ message: 'Error al actualizar contraseñas' });
  }
});

export default router;