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

// Mock de paquetes
mock.onGet('/paquetes').reply(200, [
  { id: 1, nombre: 'Paquete 1', estado: 'pendiente' },
  { id: 2, nombre: 'Paquete 2', estado: 'entregado' },
]);

// Puedes agregar mocks para asignación de rutas, reportes, etc.

export default mock;
