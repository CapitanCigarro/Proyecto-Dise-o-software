## Guía de Instalación y Configuración

1. Dividir la terminal en **3 ventanas** para ejecutar los servicios simultáneamente.
2. Primer terminar ``` cd backend ```
    2.1 ```npm install```
    2.2 ```npm run dev```
3. segundo terminal ```cd web-admin```
    3.1 ```npm install```
    3.2 ```npm start```
4. tercer terminal ```cd mobile```
    3.1 ```npm install```
    3.2 buscar el archivo api.ts y modificar la url con tu ip (abrir la terminal y poner ipconfig, es IPv4 Address ....)
    3.3 ```npx expo start```
    3.4 intalar expo go en el dispositivo movil
    3.5 escanear el qr

usuarios de prueba:
    1. Cliente: javier@b.com    contraseña: holaaa
    2. conductor: javier@c.com  contraseña: holaaa

**Nota importante:** Para facilitar la evaluación y testing del proyecto, se han incluido los archivos `.env` con las configuraciones necesarias en el repositorio.

---

**Distribución de trabajo**  
---

| Integrante | Rol                  | Tareas Clave                                                                                                                                                                                                 | Coordinación                                                                              |  
|------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|  
| **Jorge Slimming**      | **App Móvil**        | - Desarrollo de la app móvil (login, pantallas cliente/conductor). <br>- Integración con endpoints del backend. <br>- Notificaciones push (Firebase o alerts).                                               | Coordinar con **Integrante 2 y 3** para definir formatos de datos y endpoints.            |  
| **Javier Campos**      | **Backend (Auth + Paquetes)** | - Implementar autenticación (`/login`), gestión de paquetes (`/paquetes`). <br>- Validación de datos y conexión con PostgreSQL.                                                                          | Trabajar con **Integrante 5** en seguridad básica (roles, protección de rutas).           |  
| **Benjamin Jimenez**      | **Backend (Rutas + Maps)** | - Desarrollo del endpoint `/rutas` (integración con Google Maps API). <br>- Lógica de optimización de rutas. <br>- Endpoint `/estados` para actualización de paquetes.                                   | Colaborar con **Integrante 5** en la integración inicial de la API de mapas.              |  
| **Joaquin Godoy**      | **Web Admin**         | - Dashboard React: Login, lista de paquetes, asignación de rutas. <br>- Integración con endpoints. <br>- Gráficos de desempeño con Chart.js.                                                              | Coordinar con **Integrante 5** en la implementación de vistas protegidas por roles.       |  
| **Nicolas Garcia**      | **Backend/Web Secundario** | <br>- Implementar seguridad básica: distinción de roles y protección de rutas (colaboración con Integrante 2). <br>- Ayudar en la integración de la API de Google Maps (con Integrante 3). <br>- Desarrollar componentes secundarios del Dashboard Web (ej: formularios de asignación de rutas). | Coordinar con **integrantes 2,3,4** para validar autenticación de usuarios.                  |  

---

