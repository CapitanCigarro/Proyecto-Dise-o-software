import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/route', async (req, res) => {
  try {
    const { startLat, startLon, endLat, endLon } = req.query;

    // Validar parámetros
    if (!startLat || !startLon || !endLat || !endLon) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Construir URL para OSRM
    const coordinates = `${startLon},${startLat};${endLon},${endLat}`;
    const url = `http://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full`;

    // Hacer la petición a OSRM
    const response = await axios.get(url);

    // Extraer información relevante
    const routeData = response.data.routes[0];
    const result = {
      distance: routeData.distance, // metros
      duration: routeData.duration, // segundos
      geometry: routeData.geometry, // Poliline para mostrar en mapa
      waypoints: response.data.waypoints // Puntos de inicio/fin
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching OSRM data:', error);
    res.status(500).json({ error: 'Error al obtener la ruta' });
  }
});

export default router;