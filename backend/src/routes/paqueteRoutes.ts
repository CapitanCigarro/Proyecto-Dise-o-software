import { Router } from 'express';
import { getPaquetes, crearPaquete } from '../controllers/paqueteController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Obtener paquetes (autenticado)
router.get('/', verifyToken, (req, res, next) => {
  getPaquetes(req, res).catch(next);
});         
// Crear nuevo paquete
router.post('/', verifyToken, (req, res, next) => {
  crearPaquete(req, res).catch(next);
});       


export default router;