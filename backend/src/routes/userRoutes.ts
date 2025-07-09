import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

const router = Router();

// Forma más segura de definir las rutas
router.post('/login', (req, res, next) => {
  loginUser(req, res).catch(next);
});

router.post('/register', (req, res, next) => {
  registerUser(req, res).catch(next);
});

export default router;