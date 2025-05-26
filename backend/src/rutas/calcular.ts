// src/routes/rutaRoutes.ts
import { Router, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';

const router = Router();

// URL base del servicio OSRM. Para producción, considera hostear tu propia instancia o usar un servicio comercial.
const OSRM_BASE_URL = process.env.OSRM_BASE_URL || 'http://router.project-osrm.org';

/**
 * @route POST /api/rutas
 * @description Calcula la ruta más corta entre dos puntos geográficos usando OSRM.
 * @body {
 * "origen": [longitud, latitud],
 * "destino": [longitud, latitud]
 * }
 * @returns {
 * "distancia_km": number,
 * "duracion_min": number,
 * "coordenadas": [latitud, longitud][]
 * }
 */
router.post('/rutas', async (req: Request, res: Response) => {
    // Para depuración: Muestra el cuerpo de la solicitud recibido
    console.log('Request body recibido:', req.body);

    try {
        const { origen, destino } = req.body;

        // 1. Validación de entradas
        if (!origen || !destino || !Array.isArray(origen) || origen.length !== 2 || !Array.isArray(destino) || destino.length !== 2) {
            return res.status(400).json({ error: 'Debes enviar coordenadas válidas para origen y destino como arrays [longitud, latitud].' });
        }

        // 2. Construcción de la URL para OSRM
        // OSRM espera las coordenadas en el formato: longitud,latitud;longitud,latitud
        // Si tu entrada es [longitud, latitud], usa origen[0],origen[1]
        // Si tu entrada fuera [latitud, longitud], usarías origen[1],origen[0]
        const osrmURL = `${OSRM_BASE_URL}/route/v1/driving/${origen[0]},${origen[1]};${destino[0]},${destino[1]}?overview=full&geometries=geojson`;

        // Para depuración: Muestra la URL completa que se enviará a OSRM
        console.log('URL de OSRM enviada:', osrmURL);

        // 3. Configuración de Axios para la solicitud a OSRM
        const axiosConfig = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': 'rutas-api-node/1.0' // Identificación clara para el servicio OSRM
            }
        };

        // 4. Realizar la solicitud GET a OSRM
        const response = await axios.get(osrmURL, axiosConfig);
        const data = response.data;

        // 5. Verificar si OSRM devolvió una ruta válida (aunque sea 200 OK)
        if (!data.routes || data.routes.length === 0) {
            console.warn("OSRM devolvió 200 OK pero sin rutas válidas (ej. 'snapping' a un punto inútil o ruta demasiado compleja para la instancia pública).");
            return res.status(404).json({
                error: 'No se pudo encontrar una ruta válida para los puntos proporcionados.',
                details: 'El servicio de ruteo externo respondió con un 200 OK, pero sin rutas o con una ruta inválida. Esto puede ocurrir por puntos inaccesibles o rutas demasiado largas para la instancia de demostración.',
                requestedUrl: osrmURL
            });
        }

        // 6. Extraer y formatear los datos de la ruta
        const ruta = data.routes[0]; // Tomamos la primera ruta (generalmente la más óptima)

        // OSRM devuelve las coordenadas en [longitud, latitud] dentro de la geometría.
        // Las convertimos a [latitud, longitud] para que sean más fáciles de usar en la mayoría de las librerías de mapas.
        const coordenadasFormateadas = ruta.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);

        // 7. Enviar la respuesta al cliente
        return res.json({
            distancia_km: parseFloat((ruta.distance / 1000).toFixed(2)), // Distancia de metros a kilómetros, redondeada
            duracion_min: parseFloat((ruta.duration / 60).toFixed(2)),   // Duración de segundos a minutos, redondeada
            coordenadas: coordenadasFormateadas
        });

    } catch (error) {
        // 8. Manejo de errores detallado
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError; // Casteo para TypeScript

            // Para ver el cuerpo completo del error de OSRM en la consola
            console.error("Detalle de la respuesta de error de OSRM:", JSON.stringify(axiosError.response?.data, null, 2));
            console.error("URL que causó el error:", axiosError.config?.url);

            // Manejo específico para errores 400 (Bad Request) de OSRM, a menudo por 'NoRoute'
            if (axiosError.response && axiosError.response.status === 400 && axiosError.response.data) {
                const osrmResponseData = axiosError.response.data as { code?: string; message?: string };
                if (osrmResponseData.code === 'NoRoute') {
                    console.error("Error de OSRM (NoRoute):", osrmResponseData.message);
                    return res.status(400).json({
                        error: 'No se pudo calcular la ruta entre los puntos.',
                        details: osrmResponseData.message || 'Las coordenadas de origen o destino podrían ser inaccesibles o la ruta es imposible.',
                        requestedUrl: axiosError.config?.url
                    });
                }
            }

            // Manejo para otros errores de Axios (ej. problemas de red, timeout, otros códigos de estado HTTP)
            console.error("Error de Axios al comunicarse con OSRM:", axiosError.message);
            res.status(500).json({
                error: 'Error al comunicarse con el servicio de ruteo externo.',
                details: axiosError.message,
                requestedUrl: axiosError.config?.url || 'URL no disponible'
            });
        } else {
            // Manejo para errores inesperados que no son de Axios
            console.error("Error inesperado en el servidor:", error);
            res.status(500).json({
                error: 'Error interno del servidor.',
                details: (error instanceof Error) ? error.message : 'Un error desconocido ocurrió.'
            });
        }
    }
});

export default router; // Exporta el router para ser usado en app.ts