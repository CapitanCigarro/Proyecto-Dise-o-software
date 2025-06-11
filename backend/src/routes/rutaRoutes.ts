import { Router } from 'express';
import { getRutas } from '../controllers/rutaController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Get all active routes
router.get('/', verifyToken, async (req, res, next) => {
  try {
    await getRutas(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;