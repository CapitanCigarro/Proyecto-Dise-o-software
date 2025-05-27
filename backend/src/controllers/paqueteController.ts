import { Request, Response } from 'express';
import pool from '../db';

export const getPaquetes = async (req: Request, res: Response): Promise< Response | void > => {
  try {
    const result = await pool.query('SELECT * FROM Diseno.Paquete');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener paquetes' });
  }
};

export const crearPaquete = async (req: Request, res: Response): Promise< Response | void > => {
  console.log('Creando paquete con datos:', req.body);
  const { paquete_peso, paquete_dimensiones, paquete_destinatario, paquete_fecha, usuario_correo, ruta_id } = req.body;

  if (!paquete_peso || !paquete_dimensiones || !paquete_destinatario || !paquete_fecha || !usuario_correo || !ruta_id) {
    return res.status(400).json({ message: 'Debe llenar todos los campos' });
  }

  try {
    await pool.query(
      'INSERT INTO Diseno.Paquete (paquete_peso, paquete_dimensiones, paquete_estado, paquete_destinatario, paquete_fecha, usuario_correo, ruta_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [paquete_peso, paquete_dimensiones, 'Por enviar', paquete_destinatario, paquete_fecha, usuario_correo, ruta_id]
    );
    res.status(201).json({ message: 'Paquete creado exitosamente' });
  } catch (error) {
    console.error('Error al crear paquete:', error);
    res.status(500).json({ message: 'Error al crear paquete' });
  }
};
