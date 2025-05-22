## Implementación entrega 2 

---

### **1. Autenticación y roles**
- [ ] Pantalla de login:
  - [ ] Crear campos para correo y contraseña.
  - [ ] Agregar selector de rol ("cliente" o "conductor").
  - [ ] Validar campos antes del envío.
  - [ ] Simular autenticación con datos predefinidos si el backend no está listo.
- [ ] Protección de rutas:
  - [ ] Implementar navegación condicional con React Navigation.
  - [ ] Redirigir según el rol (cliente vs conductor).
  - [ ] Crear componente `ProtectedRoute` que verifique el rol.
- [ ] Almacenamiento de sesión:
  - [ ] Guardar token o datos del usuario en `AsyncStorage`.
  - [ ] Recuperar sesión al reiniciar la app.

---

### **2. Funcionalidades para el rol de Cliente**
- [ ] Registro de paquetes:
  - [ ] Crear formulario con campos: remitente, destinatario, dirección, teléfono.
  - [ ] Validar peso (numérico) y dimensiones.
  - [ ] Integrar con backend usando `axios` o `fetch`.
  - [ ] Simular envío con `AsyncStorage` si no hay backend.
- [ ] Seguimiento de paquetes:
  - [ ] Diseñar pantalla con estado del paquete (iconos, colores).
  - [ ] Mostrar lista histórica con filtros por fecha/estado.
  - [ ] Usar datos mock si el backend no está disponible.
- [ ] Notificaciones básicas:
  - [ ] Mostrar alertas (`Alert`) en cambios de estado.
  - [ ] Preparar base para push notifications (opcional para próximas iteraciones).

---

### **3. Funcionalidades para el rol de Conductor**
- [ ] Visualización de rutas asignadas:
  - [ ] Integrar `react-native-maps` o `@react-native-google-maps`.
  - [ ] Dibujar rutas con `Polyline` (si hay coordenadas).
  - [ ] Mostrar ruta estática si el backend no está listo.
  - [ ] Incluir panel con distancia, duración, y paquetes asignados.
- [ ] Cambio de estado de paquetes:
  - [ ] Agregar botones o menú para actualizar estado.
  - [ ] Enviar actualización al backend (o simular en estado local).
- [ ] Notificaciones a clientes:
  - [ ] Simular envío con mensaje de confirmación visual.

---

### **4. Integración con API de Google Maps**
- [ ] Cálculo de rutas:
  - [ ] Consumir API del backend (si ya tiene integración con Google Maps).
  - [ ] Usar `react-native-maps-directions` como alternativa en frontend.
  - [ ] Mostrar ruta con marcadores y línea conectando puntos.

---

### **5. Requisitos técnicos adicionales**
- [ ] Navegación condicional:
  - [ ] Configurar `AuthNavigator` para login.
  - [ ] Crear `MainNavigator` con stacks separados por rol.
  - [ ] Usar `useContext` o Redux para manejar el estado del usuario.
- [ ] Estados de la app:
  - [ ] Usar Context API para compartir datos de paquetes y rutas.
  - [ ] Considerar Redux o Zustand si el estado es complejo.
- [ ] Código organizado:
  - [ ] Crear carpetas: `/screens`, `/components`, `/services`, `/utils`.

