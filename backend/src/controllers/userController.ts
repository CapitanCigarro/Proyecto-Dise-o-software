import { Request, Response } from 'express';
import pool from '../db.js'; // tu pool o cliente PG
import bcrypt from 'bcryptjs'; // para comparar hash de contraseñas (si usas)
import jwt from 'jsonwebtoken';

export const loginUser = async (req: Request, res: Response): Promise<Response | void> => {
  console.log("Body recibidio:", req.body);
  
  const { usuario_correo, usuario_password, usuario_rol } = req.body;

  if(!usuario_correo || !usuario_password || !usuario_rol) {
    console.error('Faltan campos requeridos:', { usuario_correo, usuario_password, usuario_rol });
    return res.status(400).json({ 
      message: 'Correo, contraseña y rol son requeridos'});
  }

  try {
    console.log("buscando usuario:", usuario_correo);
    // 1. Buscar usuario en la base de datos
    const result = await pool.query(
      'SELECT usuario_correo, usuario_nombre, usuario_rol, usuario_password FROM Diseno.Usuarios WHERE usuario_correo = $1',
      [usuario_correo]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    console.log('Usuario encontrado:', user.usuario_correo);
    console.log('Comparando contraseña...');

    // 2. Validar contraseña (aquí asumo que guardas hashed passwords)
    const validPassword = await bcrypt.compare(usuario_password, user.usuario_password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    console.log('Contraseña valida');
    
    // Verificar que el rol sea válido (1=admin, 2=cliente, 3=conductor)
    if (![1, 2, 3].includes(user.usuario_rol)) {
      return res.status(403).json({ 
        message: 'Rol de usuario no válido o no autorizado',
        rol: user.usuario_rol 
      });
    }
    
    // Verificar que el rol proporcionado coincida con el de la base de datos
    if (parseInt(usuario_rol) !== user.usuario_rol) {
      return res.status(403).json({ 
        message: 'El rol proporcionado no coincide con el rol del usuario',
        rolProporcionado: usuario_rol,
        rolEnBaseDeDatos: user.usuario_rol
      });
    }
    
    // Mapeo de roles para el mensaje de log
    const rolNombre: { [key: number]: string } = {
      1: 'administrador',
      2: 'cliente',
      3: 'conductor'
    };
    console.log(`Usuario autenticado con rol: ${rolNombre[user.usuario_rol]}`);
    
    // 3. Crear token JWT (con tu secret)
    const token = jwt.sign(
      { correo: user.usuario_correo, nombre: user.usuario_nombre, rol: user.usuario_rol },
      process.env.JWT_SECRET || 'clave_super_secreta',
      { expiresIn: '7d' }
    );

    // 4. Enviar respuesta con token
    res.json({ token, role: user.usuario_rol });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { usuario_correo, usuario_password, usuario_nombre, usuario_direccion, usuario_rol } = req.body;

  if (!usuario_correo || !usuario_nombre || !usuario_direccion || !usuario_rol || !usuario_password) {
    console.error('Faltan campos requeridos:', {
      usuario_correo,
      usuario_nombre,
      usuario_direccion,
      usuario_rol,
      usuario_password
    });
    return res.status(400).json({ 
      message: 'Todos los campos son requeridos',
      received: req.body
    });
  }

  try {
    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    console.log('Contraseña recibida:', usuario_password);
    const password_hash = await bcrypt.hash(usuario_password, salt);

    // Insertar usuario con contraseña hasheada
    await pool.query(
      'INSERT INTO Diseno.Usuarios (usuario_correo, usuario_nombre, usuario_direccion, usuario_rol, usuario_password) VALUES ($1, $2, $3, $4, $5)',
      [usuario_correo, usuario_nombre, usuario_direccion, usuario_rol, password_hash]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};
