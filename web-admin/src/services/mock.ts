import MockAdapter from 'axios-mock-adapter';
import axios from './axios';

const mock = new MockAdapter(axios, { delayResponse: 0 });

// Mock de login
mock.onPost('/login').reply(config => {
  const { email, password } = JSON.parse(config.data);

  const users = [
    { email: 'admin@example.com', password: 'adminpass', role: 'admin', token: 'token-admin' },
    { email: 'cliente@example.com', password: 'password123', role: 'cliente', token: 'token-cliente' },
    { email: 'conductor@example.com', password: 'password123', role: 'conductor', token: 'token-conductor' },
  ];

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return [200, { token: user.token, role: user.role }];
  } else {
    return [401, { message: 'Correo o contraseña incorrectos' }];
  }
});

mock.onGet('/envios').reply(200, [
  { id: 1, cliente: 'Juan Pérez', conductor: 'Carlos Pereira', estado: 'Pendiente', fecha: '2025-05-27', horaAsignacion: '09:00', horaEntrega: '---' },
{ id: 2, cliente: 'María López', conductor: 'Ana Lisa', estado: 'En camino', fecha: '2025-05-27', horaAsignacion: '09:30', horaEntrega: '---' },
{ id: 3, cliente: 'Luis Gómez', conductor: 'Carlos Pereira', estado: 'Entregado', fecha: '2025-05-26', horaAsignacion: '08:45', horaEntrega: '11:15' },
{ id: 4, cliente: 'Sofía Díaz', conductor: 'Ana Lisa', estado: 'Cancelado', fecha: '2025-05-25', horaAsignacion: '10:00', horaEntrega: '---' },
{ id: 5, cliente: 'Pedro Fuentes', conductor: 'Juan López', estado: 'Pendiente', fecha: '2025-05-26', horaAsignacion: '11:00', horaEntrega: '---' },
{ id: 6, cliente: 'Gabriela Torres', conductor: 'Ana Lisa', estado: 'Entregado', fecha: '2025-05-28', horaAsignacion: '08:00', horaEntrega: '10:30' },
{ id: 7, cliente: 'Ricardo Soto', conductor: 'Carlos Pereira', estado: 'En camino', fecha: '2025-05-28', horaAsignacion: '10:15', horaEntrega: '---' },
{ id: 8, cliente: 'Laura Méndez', conductor: 'Juan López', estado: 'Entregado', fecha: '2025-05-27', horaAsignacion: '09:00', horaEntrega: '11:00' },
{ id: 9, cliente: 'Esteban Ruiz', conductor: 'Carlos Pereira', estado: 'Pendiente', fecha: '2025-05-28', horaAsignacion: '08:30', horaEntrega: '---' },
{ id: 10, cliente: 'Daniela Castro', conductor: 'Ana Lisa', estado: 'En camino', fecha: '2025-05-26', horaAsignacion: '10:45', horaEntrega: '---' },
{ id: 11, cliente: 'Felipe Morales', conductor: 'Juan López', estado: 'Entregado', fecha: '2025-05-28', horaAsignacion: '08:00', horaEntrega: '09:45' },
{ id: 12, cliente: 'Camila Rojas', conductor: 'Carlos Pereira', estado: 'Cancelado', fecha: '2025-05-25', horaAsignacion: '09:30', horaEntrega: '---' },
{ id: 13, cliente: 'Tomás Castillo', conductor: 'Ana Lisa', estado: 'Pendiente', fecha: '2025-05-29', horaAsignacion: '11:30', horaEntrega: '---' },
{ id: 14, cliente: 'Valentina Pino', conductor: 'Juan López', estado: 'Entregado', fecha: '2025-05-29', horaAsignacion: '10:00', horaEntrega: '12:00' },
{ id: 15, cliente: 'Ignacio Herrera', conductor: 'Carlos Pereira', estado: 'En camino', fecha: '2025-05-29', horaAsignacion: '09:15', horaEntrega: '---' },
{ id: 16, cliente: 'Antonia Salas', conductor: 'Ana Lisa', estado: 'Entregado', fecha: '2025-05-30', horaAsignacion: '07:30', horaEntrega: '09:30' },
{ id: 17, cliente: 'Diego Martínez', conductor: 'Carlos Pereira', estado: 'Pendiente', fecha: '2025-05-30', horaAsignacion: '08:45', horaEntrega: '---' },
{ id: 18, cliente: 'Martina Reyes', conductor: 'Juan López', estado: 'En camino', fecha: '2025-05-30', horaAsignacion: '09:30', horaEntrega: '---' },
{ id: 19, cliente: 'Benjamín Núñez', conductor: 'Ana Lisa', estado: 'Entregado', fecha: '2025-05-30', horaAsignacion: '10:00', horaEntrega: '12:30' },
{ id: 20, cliente: 'Josefa Araya', conductor: 'Carlos Pereira', estado: 'Pendiente', fecha: '2025-05-30', horaAsignacion: '11:00', horaEntrega: '---' },
{ id: 21, cliente: 'Tony Montana', conductor: 'Francisco Pino', estado: 'Entregado', fecha: '2025-05-26', horaAsignacion: '09:00', horaEntrega: '10:45' },
{ id: 22, cliente: 'Alejandra Campos', conductor: 'Ana Lisa', estado: 'Pendiente', fecha: '2025-05-27', horaAsignacion: '08:00', horaEntrega: '---' },
{ id: 23, cliente: 'Joaquín Varela', conductor: 'Carlos Pereira', estado: 'Entregado', fecha: '2025-05-27', horaAsignacion: '09:45', horaEntrega: '11:45' },
{ id: 24, cliente: 'Renata Molina', conductor: 'Juan López', estado: 'Cancelado', fecha: '2025-05-26', horaAsignacion: '10:30', horaEntrega: '---' },
{ id: 25, cliente: 'Matías Silva', conductor: 'Francisco Pino', estado: 'En camino', fecha: '2025-05-28', horaAsignacion: '11:15', horaEntrega: '---' },
{ id: 26, cliente: 'Isidora Fernández', conductor: 'Carlos Pereira', estado: 'Entregado', fecha: '2025-05-29', horaAsignacion: '08:00', horaEntrega: '10:00' },
{ id: 27, cliente: 'Sebastián Muñoz', conductor: 'Ana Lisa', estado: 'Pendiente', fecha: '2025-05-29', horaAsignacion: '09:30', horaEntrega: '---' },
{ id: 28, cliente: 'Trinidad Herrera', conductor: 'Juan López', estado: 'Entregado', fecha: '2025-05-30', horaAsignacion: '08:00', horaEntrega: '10:00' },
{ id: 29, cliente: 'Gaspar Morales', conductor: 'Francisco Pino', estado: 'En camino', fecha: '2025-05-30', horaAsignacion: '10:30', horaEntrega: '---' },
{ id: 30, cliente: 'Valeria Soto', conductor: 'Carlos Pereira', estado: 'Cancelado', fecha: '2025-05-30', horaAsignacion: '11:30', horaEntrega: '---' },
{ id: 31, cliente: 'Camilo Álvarez', conductor: 'Ana Lisa', estado: 'Entregado', fecha: '2025-05-30', horaAsignacion: '07:45', horaEntrega: '09:45' },
{ id: 32, cliente: 'Jose Ignacio Vera', conductor: 'Juan López', estado: 'Pendiente', fecha: '2025-05-30', horaAsignacion: '09:00', horaEntrega: '---' },
{ id: 33, cliente: 'Constanza Méndez', conductor: 'Carlos Pereira', estado: 'En camino', fecha: '2025-05-29', horaAsignacion: '08:30', horaEntrega: '---' },
{ id: 34, cliente: 'Mauricio Toledo', conductor: 'Francisco Pino', estado: 'Pendiente', fecha: '2025-05-28', horaAsignacion: '10:45', horaEntrega: '---' },
{ id: 35, cliente: 'Emilia Bravo', conductor: 'Ana Lisa', estado: 'Entregado', fecha: '2025-05-27', horaAsignacion: '08:30', horaEntrega: '11:00' },
{ id: 36, cliente: 'Franco Riquelme', conductor: 'Juan López', estado: 'Cancelado', fecha: '2025-05-27', horaAsignacion: '09:30', horaEntrega: '---' },
{ id: 37, cliente: 'Rocío Gallardo', conductor: 'Carlos Pereira', estado: 'Pendiente', fecha: '2025-05-28', horaAsignacion: '10:00', horaEntrega: '---' },
{ id: 38, cliente: 'Damián Escobar', conductor: 'Ana Lisa', estado: 'Entregado', fecha: '2025-05-29', horaAsignacion: '09:00', horaEntrega: '11:15' },
{ id: 39, cliente: 'Lucía Figueroa', conductor: 'Juan López', estado: 'En camino', fecha: '2025-05-30', horaAsignacion: '10:30', horaEntrega: '---' },
{ id: 40, cliente: 'Bastián Paredes', conductor: 'Francisco Pino', estado: 'Pendiente', fecha: '2025-05-30', horaAsignacion: '08:45', horaEntrega: '---' },
{ id: 41, cliente: 'Fernanda Carrasco', conductor: 'Carlos Pereira', estado: 'Entregado', fecha: '2025-05-30', horaAsignacion: '07:30', horaEntrega: '09:30' },

]);


export default mock;
