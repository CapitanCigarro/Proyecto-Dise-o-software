import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware para verificar el token JWT
// Asegúrate de que este middleware se use después de que el body-parser haya procesado el cuerpo de la solicitud
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    // Verifica si el token está presente en los headers
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    // Si usas cookies, podrías usar req.cookies.token o algo similar
  if (!token) {
    res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('Falta la variable JWT_SECRET en .env');
    }
    // Verifica el token usando tu clave secreta
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
    (req as any).user = decoded; // attach user to request
    next();
  } catch (err) {
    // Si el token es inválido o ha expirado, devuelve un error
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
