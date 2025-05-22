## Implementación Entrega 2

---

### **1. Autenticación y roles**

* [ ] **Pantalla de login:**

  * [ ] Diseñar formulario con campos de correo y contraseña.
  * [ ] Validar credenciales contra backend o mock (`admin@test.com`, `admin123`).
  * [ ] Mostrar mensaje de error si las credenciales son incorrectas.
* [ ] **Protección de rutas:**

  * [ ] Implementar rutas privadas con `React Router` (`<PrivateRoute>`).
  * [ ] Restringir acceso a rutas como "/asignar-rutas" y "/reportes" para rol "admin".
* [ ] **Almacenamiento de sesión:**

  * [ ] Guardar token en `localStorage` o `sessionStorage`.
  * [ ] Recuperar sesión al recargar la página para mantener sesión activa.

---

### **2. Funcionalidades principales**

#### a. Gestión de envíos

* [ ] **Listado de envíos diarios:**

  * [ ] Crear tabla con filtros por estado.
  * [ ] Columnas: ID, cliente, conductor, estado, fecha.
  * [ ] Integrar con backend o usar datos mock.
* [ ] **Detalles del envío:**

  * [ ] Mostrar detalles en modal o pantalla secundaria: remitente, destinatario, peso, dimensiones, ruta.

#### b. Asignación de rutas a conductores

* [ ] **Interfaz de asignación:**

  * [ ] Selector de conductor desde backend.
  * [ ] Campos con autocompletado para origen y destino (Google Places API).
  * [ ] Botón para calcular ruta óptima (API Google Maps).
* [ ] **Visualización de rutas:**

  * [ ] Mapa interactivo con `@react-google-maps/api`.
  * [ ] Mostrar ruta, marcadores y detalles (distancia, duración).

#### c. Generación de reportes

* [ ] **Reporte de eficiencia de rutas:**

  * [ ] Gráficos con `Chart.js` o `ApexCharts`.
  * [ ] Mostrar tiempo promedio y porcentaje de entregas a tiempo.
  * [ ] Filtro por fechas o conductores.
* [ ] **Exportación de datos:**

  * [ ] Botón para descargar en PDF/CSV (con `jspdf`, `xlsx`).

---

### **3. Integración con Google Maps**

* [ ] **Autocompletado de direcciones:**

  * [ ] Implementar `usePlacesAutocomplete` en campos de direcciones.
* [ ] **Cálculo de rutas:**

  * [ ] Usar Directions API de Google Maps.
  * [ ] Mostrar ruta con `DirectionsRenderer` + detalles (distancia, duración).
* [ ] **Clave de API:**

  * [ ] Guardar API Key en `.env` y no exponerla en código fuente.

---

### **4. Requisitos técnicos adicionales**

#### a. Navegación

* [ ] Usar `React Router v6` para rutas públicas y privadas.
* [ ] Crear layout base con menú lateral (envíos, rutas, reportes).

#### b. Estado de la aplicación

* [ ] Manejar estado con `Context API` o `Redux`.
* [ ] Simular datos con `axios-mock-adapter` si backend no está disponible.

#### c. Seguridad básica

* [ ] Enviar token en headers al backend.
* [ ] Implementar logout que elimine token y redirija al login.

#### d. Organización del código

* [ ] Estructurar carpetas del proyecto:

  * [ ] `/components`: Componentes reutilizables.
  * [ ] `/pages`: Vistas principales.
  * [ ] `/services`: Servicios de API.
  * [ ] `/utils`: Utilidades (fechas, errores, etc.).

---
