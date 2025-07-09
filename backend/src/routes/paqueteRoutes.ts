import { Router } from 'express';
import { getPaquetes, crearPaquete } from '../controllers/paqueteController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Obtener paquetes (autenticado)
router.get('/:usuario_correo', verifyToken, async (req, res, next) => {
  try {
    await getPaquetes(req, res);
  } catch (error) {
    next(error);
  }
});         
// Crear nuevo paquete
router.post('/', verifyToken, (req, res, next) => {
  crearPaquete(req, res).catch(next);
});       


export default router;