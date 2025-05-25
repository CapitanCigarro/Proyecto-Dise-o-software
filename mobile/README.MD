### Por hacer:
- Separar styles de cada pagina
- refacotrizar codigo
- limitarce a lo que se pide en la entrega 2
- poner mensajes de alertas para las funciones que no se pueden implementar aun
- [X] adapartar la interfaz

## Implementación entrega 2 

---

### **1. Autenticación y roles**
- [ ] Pantalla de login:
  - [x] Crear campos para correo y contraseña.
  - [x] Agregar selector de rol ("cliente" o "conductor").
  - [x] Validar campos antes del envío.
  - [x] Simular autenticación con datos predefinidos si el backend no está listo.
- [ ] Protección de rutas:
  - [x] Implementar navegación condicional con React Navigation.
  - [x] Redirigir según el rol (cliente vs conductor).
  - [x] Crear componente `ProtectedRoute` que verifique el rol.
- [x] Almacenamiento de sesión:
  - [x] Guardar token o datos del usuario en `AsyncStorage`.
  - [x] Recuperar sesión al reiniciar la app.

---

### **2. Funcionalidades para el rol de Cliente**
- [ ] Registro de paquetes:
  - [X] Crear formulario con campos: remitente, destinatario, dirección, teléfono.
  - [X] Validar peso (numérico) y dimensiones.
  - [ ] Integrar con backend usando `axios` o `fetch`.
  - [X] Simular envío con `AsyncStorage` si no hay backend.
- [ ] Seguimiento de paquetes:
  - [X] Diseñar pantalla con estado del paquete (iconos, colores).
  - [X] Mostrar lista histórica con filtros por fecha/estado.
  - [X] Usar datos mock si el backend no está disponible.
- [ ] Notificaciones básicas:
  - [ ] Mostrar alertas (`Alert`) en cambios de estado.
  - [ ] Preparar base para push notifications (opcional para próximas iteraciones).

---

### **3. Funcionalidades para el rol de Conductor**
- [ ] Visualización de rutas asignadas:
  - [ ] Integrar `react-native-maps` o `@react-native-google-maps`.
  - [ ] Dibujar rutas con `Polyline` (si hay coordenadas).
  - [ ] Mostrar ruta estática si el backend no está listo.
  - [X] Incluir panel con distancia, duración, y paquetes asignados.
- [ ] Cambio de estado de paquetes:
  - [X] Agregar botones o menú para actualizar estado.
  - [ ] Enviar actualización al backend (o simular en estado local).
- [ ] Notificaciones a clientes:
  - [X] Simular envío con mensaje de confirmación visual.

---

### **4. Integración con API de Google Maps**
- [ ] Cálculo de rutas:
  - [ ] Consumir API del backend (si ya tiene integración con Google Maps).
  - [ ] Usar `react-native-maps-directions` como alternativa en frontend.
  - [ ] Mostrar ruta con marcadores y línea conectando puntos.

---

### **5. Requisitos técnicos adicionales**
- [ ] Navegación condicional:
  - [X] Configurar `AuthNavigator` para login.
  - [ ] Crear `MainNavigator` con stacks separados por rol.
  - [ ] Usar `useContext` o Redux para manejar el estado del usuario.
- [ ] Estados de la app:
  - [ ] Usar Context API para compartir datos de paquetes y rutas.
  - [ ] Considerar Redux o Zustand si el estado es complejo.
- [ ] Código organizado:
  - [X] Crear carpetas: `/screens`, `/components`, `/services`, `/utils`.

