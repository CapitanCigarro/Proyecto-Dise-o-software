import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const payload = {
  correo: 'usuario@test.com',
  role: 2,
};

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET no definido');
}

const options: SignOptions = {
  expiresIn: '30d', // Duración del token
};

const token = jwt.sign(payload, secret, options);

console.log('Token JWT generado para testeo:', token);
