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

// Mock del dashboard (métricas, gráficas y últimos envíos)
mock.onGet('/dashboard').reply(200, {
  metrics: {
    totalEnvios: 120,
    entregados: 85,
    pendientes: 35,
    conductoresActivos: 8,
    tasaEntregaATiempo: '91%',
  },
  chartData: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
    datasets: [
      {
        label: 'Entregas por día',
        data: [20, 25, 22, 30, 28],
        backgroundColor: '#4F46E5',
      },
    ],
  },
  ultimosEnvios: [
    { id: 'PKG-001', cliente: 'Juan Pérez', conductor: 'Pedrito Jimenez', estado: 'Entregado', fecha: '2025-05-27' },
    { id: 'PKG-002', cliente: 'María González', conductor: 'Carlos Sanchez', estado: 'Pendiente', fecha: '2025-05-28' },
    { id: 'PKG-003', cliente: 'Pedro Ramírez', conductor: 'Dino Saurio', estado: 'En ruta', fecha: '2025-05-28' },
  ]
});

// Al final de mock.ts, después de otros mocks
mock.onGet('/envios').reply(200, [
  { id: 1, cliente: 'Juan Pérez', conductor: 'Carlos Pereira', estado: 'Pendiente', fecha: '2025-05-27' },
  { id: 2, cliente: 'María López', conductor: 'Ana Lisa', estado: 'En camino', fecha: '2025-05-27' },
  { id: 3, cliente: 'Luis Gómez', conductor: 'Carlos Pereira', estado: 'Entregado', fecha: '2025-05-26' },
  { id: 4, cliente: 'Sofía Díaz', conductor: 'Ana Lisa', estado: 'Cancelado', fecha: '2025-05-25' },
]);


export default mock;
