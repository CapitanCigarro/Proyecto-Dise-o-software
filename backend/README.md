## Implementación Entrega 2 

---

### **1. Autenticación y roles**

* [ ] **Endpoints de autenticación:**

  * [ ] `POST /auth/login`: Validar credenciales con base de datos.
  * [ ] `POST /auth/logout`: Invalidar token JWT (opcional).
  * [ ] Enviar token JWT con rol del usuario (`cliente`, `conductor`, `admin`).
* [ ] **Middleware de seguridad:**

  * [ ] Crear `authMiddleware.js` para verificar JWT desde los headers.
  * [ ] Restringir rutas según rol del usuario (ej. solo `admin` accede a `/rutas/asignar`).
* [ ] **Encriptación:**

  * [ ] Implementar `bcrypt` para hashear contraseñas antes de guardarlas en PostgreSQL.

---

### **2. Gestión de usuarios**

* [ ] **Endpoints CRUD:**

  * [ ] `GET /usuarios`: Listar todos los usuarios (solo `admin`).
  * [ ] `POST /usuarios`: Registrar nuevos usuarios.
  * [ ] Validar campos: nombre, correo único, tipo de usuario.
* [ ] **Roles:**

  * [ ] Validar que `tipo_usuario` acepte solo: `cliente`, `conductor`, `admin`.

---

### **3. Gestión de paquetes**

* [ ] **Endpoints clave:**

  * [ ] `POST /paquetes`: Registrar paquete.

    * [ ] Validar: `usuario_id`, `peso`, `dimensiones`.
    * [ ] Asignar estado inicial: "En preparación".
  * [ ] `GET /paquetes/{id}`: Obtener detalles de paquete (estado, ruta).
  * [ ] `PUT /paquetes/{id}/estado`: Cambiar estado del paquete.

    * [ ] Verificar permisos (solo `conductor` o `admin`).
* [ ] **Relaciones en la base de datos:**

  * [ ] Asegurar claves foráneas: `usuario_id`, `ruta_id`, `estado_id`.

---

### **4. Gestión de rutas y Google Maps**

* [ ] **Integración con Google Maps API:**

  * [ ] `POST /rutas/calcular`:

    * [ ] Recibir `origen` y `destino` (direcciones/coordenadas).
    * [ ] Calcular ruta óptima con API de Directions.
    * [ ] Almacenar distancia, duración, y detalles en PostgreSQL.
  * [ ] Configurar clave API de Google Maps en archivo `.env`.
* [ ] **Endpoints para conductores:**

  * [ ] `GET /rutas/asignadas`: Listar rutas asignadas por `usuario_id`.

---

### **5. Base de datos (PostgreSQL)**

* [ ] **Esquema base:**

  * [ ] Ejecutar script SQL para crear tablas: `usuarios`, `estados_entrega`, `rutas`, `paquetes`.
  * [ ] Verificar relaciones y claves foráneas correctas.
* [ ] **Conexión con Node.js:**

  * [ ] Conectar usando `pg` o `Sequelize`.
  * [ ] Configurar pool de conexiones para mejor rendimiento.

---

### **6. Seguridad y validaciones**

* [ ] **Validación de datos:**

  * [ ] Implementar `Joi` o `express-validator` para validar inputs (correo, peso, etc.).
* [ ] **Protección contra inyecciones SQL:**

  * [ ] Usar consultas parametrizadas o un ORM.
* [ ] **Manejo de errores:**

  * [ ] Crear middleware global de errores:

    * [ ] 404: Ruta no encontrada.
    * [ ] 403: Acceso denegado.
    * [ ] 500: Errores del servidor.

---

