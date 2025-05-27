import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta_que_debes_cambiar';

export const authenticateUser = async (email: string, password: string) => {
  const query = `SELECT usuario_correo, usuario_password, usuario_nombre FROM Diseno.Usuarios WHERE usuario_correo = $1`;
  const result = await pool.query(query, [email]);

  if (result.rowCount === 0) {
    throw new Error('Usuario no encontrado');
  }

  const user = result.rows[0];

  // Compara password ingresado con hash guardado
  const isMatch = await bcrypt.compare(password, user.usuario_password);
  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }

  // Genera token JWT
  const token = jwt.sign(
    { correo: user.usuario_correo, nombre: user.usuario_nombre },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user: { correo: user.usuario_correo, nombre: user.usuario_nombre } };
};
