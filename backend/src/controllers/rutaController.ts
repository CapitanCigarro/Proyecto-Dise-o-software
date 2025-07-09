import { Request, Response } from 'express';
import pool from '../db.js';

export const getRutas = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const result = await pool.query('SELECT * FROM Diseno.Ruta WHERE ruta_estado = $1', ['Activa']);
    return res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    return res.status(500).json({ message: 'Error al obtener rutas' });
  }
};