import { Router, Request, Response } from 'express';

const router = Router();

// Base de datos de ejemplo para rutas asignadas
// En una aplicación real, esto vendría de una base de datos (MongoDB, PostgreSQL, etc.)
interface RutaAsignada {
    id: string;
    usuarioId: string;
    nombreRuta: string;
    fechaAsignacion: string;
    estado: 'pendiente' | 'en progreso' | 'completada';
    // Podrías añadir más detalles de la ruta, como origen, destino, etc.
}

const rutasAsignadasDB: RutaAsignada[] = [
    { id: 'ruta1', usuarioId: 'conductor123', nombreRuta: 'Entrega Centro', fechaAsignacion: '2025-05-26', estado: 'pendiente' },
    { id: 'ruta2', usuarioId: 'conductor456', nombreRuta: 'Recogida Norte', fechaAsignacion: '2025-05-26', estado: 'en progreso' },
    { id: 'ruta3', usuarioId: 'conductor123', nombreRuta: 'Distribución Sur', fechaAsignacion: '2025-05-25', estado: 'completada' },
    { id: 'ruta4', usuarioId: 'conductor789', nombreRuta: 'Traslado Hospital', fechaAsignacion: '2025-05-26', estado: 'pendiente' },
];

/**
 * @route GET /api/rutas/asignadas
 * @description Lista las rutas asignadas a un usuario específico.
 * @query {string} usuario_id - El ID del usuario/conductor para filtrar las rutas.
 * @returns {RutaAsignada[]} Un array de objetos RutaAsignada.
 */
router.get('/rutas/asignadas', (req: Request, res: Response) => {
    // Accede a los query parameters con req.query
    // Ejemplo de llamada: GET /api/rutas/asignadas?usuario_id=conductor123
    const { usuario_id } = req.query; 

    // 1. Validación de la entrada
    if (!usuario_id) {
        return res.status(400).json({ error: 'El parámetro usuario_id es requerido.' });
    }

    // 2. Filtrar rutas por usuario_id
    // Convertimos a string() por si el query param viene de otra forma (ej. number)
    const rutasDelConductor = rutasAsignadasDB.filter(
        ruta => ruta.usuarioId === String(usuario_id)
    );

    // 3. Manejo de resultados: Si no se encuentran rutas
    if (rutasDelConductor.length === 0) {
        return res.status(404).json({
            mensaje: `No se encontraron rutas asignadas para el usuario_id: ${usuario_id}.`
        });
    }

    // 4. Enviar las rutas encontradas como respuesta
    return res.json(rutasDelConductor);
});

export default router; // Exporta el router para ser usado en app.ts