CREATE SCHEMA IF NOT EXISTS Diseno;

CREATE TABLE IF NOT EXISTS Diseno.Rol(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Diseno.Usuarios(
    usuario_correo VARCHAR(256) PRIMARY KEY,
    usuario_password VARCHAR(256) NOT NULL,
    usuario_nombre VARCHAR(100) NOT NULL,
    usuario_direccion VARCHAR(255) NOT NULL,

    usuario_rol INTEGER NOT NULL,
    FOREIGN KEY (usuario_rol) REFERENCES Diseno.Rol(id)
);

CREATE TABLE IF NOT EXISTS Diseno.Ruta(
    ruta_id SERIAL PRIMARY KEY,
    ruta_inicio VARCHAR(100) NOT NULL,
    ruta_destino VARCHAR(100) NOT NULL,
    ruta_distancia_km DECIMAL(10, 2) NOT NULL,
    ruta_tiempo_estimado INT NOT NULL,
    ruta_estado VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Diseno.Paquete(
    paquete_id SERIAL PRIMARY KEY,
    paquete_peso DECIMAL(10, 2) NOT NULL,
    paquete_dimensiones VARCHAR(50) NOT NULL,
    paquete_estado VARCHAR(20) NOT NULL,
    paquete_destinatario VARCHAR(100) NOT NULL,
    paquete_fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    usuario_correo VARCHAR(256) NOT NULL,
    FOREIGN KEY (usuario_correo) REFERENCES Diseno.Usuarios(usuario_correo),

    ruta_id INTEGER NOT NULL,
    FOREIGN KEY (ruta_id) REFERENCES Diseno.Ruta(ruta_id)
);

CREATE TABLE IF NOT EXISTS Diseno.Reporte(
    reporte_id SERIAL PRIMARY KEY,
    reporte_fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reporte_descripcion TEXT NOT NULL,
    reporte_tipo VARCHAR(50) NOT NULL,

    administrador_correo VARCHAR(256) NOT NULL,
    FOREIGN KEY (administrador_correo) REFERENCES Diseno.Usuarios(usuario_correo)
);

CREATE TABLE IF NOT EXISTS Diseno.Notificaciones(
    notificacion_id SERIAL PRIMARY KEY,
    notificacion_mensaje TEXT NOT NULL,
    notificacion_fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    usuario_correo VARCHAR(256) NOT NULL,
    FOREIGN KEY (usuario_correo) REFERENCES Diseno.Usuarios(usuario_correo)
);

INSERT INTO Diseno.Rol (nombre) VALUES 
('Administrador'),
('Cliente'),
('Repartidor');

INSERT INTO Diseno.Usuarios (usuario_correo, usuario_password, usuario_nombre, usuario_direccion, usuario_rol) VALUES 
('admin@empresa.com', 'admin123', 'Juan Pérez', 'Calle Principal 123', 1),
('cliente1@gmail.com', 'cliente123', 'María García', 'Avenida Central 456', 2),
('cliente2@hotmail.com', 'cliente456', 'Carlos López', 'Boulevard Norte 789', 2),
('repartidor1@empresa.com', 'repartidor123', 'Pedro Martínez', 'Calle Secundaria 321', 3),
('repartidor2@empresa.com', 'repartidor456', 'Ana Rodríguez', 'Avenida Sur 654', 3);

INSERT INTO Diseno.Ruta (ruta_inicio, ruta_destino, ruta_distancia_km, ruta_tiempo_estimado, ruta_estado) VALUES 
('Bodega Central', 'Zona Norte', 15.5, 45, 'Activa'),
('Bodega Central', 'Zona Sur', 20.3, 60, 'Activa'),
('Bodega Central', 'Zona Este', 12.7, 35, 'Inactiva'),
('Bodega Norte', 'Zona Centro', 8.2, 25, 'Activa');

INSERT INTO Diseno.Paquete (paquete_peso, paquete_dimensiones, paquete_estado, paquete_destinatario, usuario_correo, ruta_id) VALUES 
(2.5, '30x20x10 cm', 'En tránsito', 'María García', 'cliente1@gmail.com', 1),
(5.0, '40x30x25 cm', 'En bodega', 'Carlos López', 'cliente2@hotmail.com', 2),
(1.2, '25x15x5 cm', 'Entregado', 'Juan Pérez', 'cliente1@gmail.com', 1),
(3.8, '35x25x15 cm', 'En tránsito', 'Ana Rodríguez', 'cliente2@hotmail.com', 4);

INSERT INTO Diseno.Reporte (reporte_descripcion, reporte_tipo, administrador_correo) VALUES 
('Paquete dañado durante el transporte', 'Daño de paquete', 'admin@empresa.com'),
('Retraso en la entrega', 'Retraso', 'admin@empresa.com'),
('Cliente no encontrado en la dirección', 'Problema de entrega', 'admin@empresa.com');

INSERT INTO Diseno.Notificaciones (notificacion_mensaje, usuario_correo) VALUES 
('Su paquete ha salido de la bodega y está en camino', 'cliente1@gmail.com'),
('Su paquete ha sido entregado exitosamente', 'cliente2@hotmail.com'),
('Hay un retraso en la entrega de su paquete', 'cliente1@gmail.com'),
('Nuevo paquete asignado para entrega', 'repartidor1@empresa.com');