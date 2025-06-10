import React, { CSSProperties, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import polyline from '@mapbox/polyline';

// --- FIX PARA LOS ICONOS DE LEAFLET ---
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Definiciones de tipos para la respuesta de la API de OSRM
interface Waypoint {
  hint: string;
  location: [number, number]; // [lon, lat]
  name: string;
  distance: number;
}

interface OsrmRouteResponse {
  distance: number;
  duration: number;
  geometry: string; // Polyline codificado
  waypoints: Waypoint[];
}

// Definición de tipo para un Envío (Mock)
interface Envio {
  id: number;
  cliente: string;
  conductor: string;
  estado: 'Pendiente' | 'En preparación' | 'Enviado';
  fecha: string;
  horaAsignacion: string;
  horaEntrega: string;
}

const mockEnvios: Envio[] = [
  {
    id: 1,
    cliente: 'Juan Pérez',
    conductor: 'Carlos Soto',
    estado: 'En preparación',
    fecha: '2025-06-09',
    horaAsignacion: '10:00',
    horaEntrega: '---',
  },
  {
    id: 2,
    cliente: 'María López',
    conductor: 'Ana Torres',
    estado: 'Pendiente',
    fecha: '2025-06-09',
    horaAsignacion: '11:30',
    horaEntrega: '---',
  },
  {
    id: 3,
    cliente: 'Pedro Gómez',
    conductor: 'Luis Rojas',
    estado: 'Enviado',
    fecha: '2025-06-08',
    horaAsignacion: '09:00',
    horaEntrega: '10:15',
  },
];

const OsrmRoutePage: React.FC = () => {
  const [startAddress, setStartAddress] = useState<string>('Universidad del Bio Bio, Concepción, Chile');
  const [endAddress, setEndAddress] = useState<string>('Plaza de la Independencia, Concepción, Chile');
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null); // [lat, lon]
  const [endCoords, setEndCoords] = useState<[number, number] | null>(null);     // [lat, lon]

  const [routeInfo, setRouteInfo] = useState<OsrmRouteResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [envios, setEnvios] = useState<Envio[]>(mockEnvios);
  const [selectedEnvioId, setSelectedEnvioId] = useState<number | null>(null);

  const [decodedPolyline, setDecodedPolyline] = useState<[number, number][]>([]);

  // Coordenadas para el centro inicial del mapa (Concepción, Chile)
  const defaultCenter: [number, number] = [-36.823271, -73.039517];
  const zoom = 13;

  useEffect(() => {
    if (routeInfo && routeInfo.geometry) {
      const decoded = polyline.decode(routeInfo.geometry);
      setDecodedPolyline(decoded);
    } else {
      setDecodedPolyline([]);
    }
  }, [routeInfo]);

  // Función para geocodificar una dirección usando Nominatim
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    const encodedAddress = encodeURIComponent(address);
    // Usamos 'jsonv2' para un formato de respuesta más limpio
    // 'limit=1' para obtener solo el mejor resultado
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=jsonv2&limit=1`;
    
    try {
      const response = await fetch(url, {
        headers: {
          // Es una buena práctica incluir un User-Agent.
          // Para desarrollo local, un nombre simple es suficiente.
          // Para producción, usa algo que identifique tu aplicación.
          'User-Agent': 'MiAplicacionDeRutas/1.0 (tu_email@example.com)' 
        }
      });

      if (!response.ok) {
        throw new Error(`Error en la geocodificación: ${response.statusText}`);
      }

      const data = await response.json();
      if (data && data.length > 0) {
        // Nominatim devuelve latitud y longitud como strings, los convertimos a number
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      } else {
        return null; // No se encontraron resultados para la dirección
      }
    } catch (e: any) {
      console.error("Error al geocodificar la dirección:", e);
      setError(`No se pudo geocodificar la dirección "${address}": ${e.message}`);
      return null;
    }
  };


  const fetchOsrmRoute = async () => {
    setLoading(true);
    setError(null);
    setRouteInfo(null);
    setDecodedPolyline([]);

    // 1. Geocodificar direcciones
    const start = await geocodeAddress(startAddress);
    const end = await geocodeAddress(endAddress);

    if (!start) {
      setError(`No se pudo encontrar coordenadas para la dirección de inicio: "${startAddress}"`);
      setLoading(false);
      return;
    }
    if (!end) {
      setError(`No se pudo encontrar coordenadas para la dirección de destino: "${endAddress}"`);
      setLoading(false);
      return;
    }

    setStartCoords(start);
    setEndCoords(end);

    // 2. Usar las coordenadas geocodificadas para la API de OSRM
    try {
      const url = `http://localhost:3007/api/osrm/route?startLat=${start[0]}&startLon=${start[1]}&endLat=${end[0]}&endLon=${end[1]}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OsrmRouteResponse = await response.json();
      setRouteInfo(data);

      if (selectedEnvioId !== null) {
        setEnvios((prevEnvios) =>
          prevEnvios.map((envio) => {
            if (envio.id === selectedEnvioId && envio.estado === 'En preparación') {
              const asignacionDate = new Date(`${envio.fecha}T${envio.horaAsignacion}:00`);
              const durationMs = data.duration * 1000;
              const entregaDate = new Date(asignacionDate.getTime() + durationMs);
              const formattedHoraEntrega = entregaDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

              return {
                ...envio,
                estado: 'Enviado',
                horaEntrega: formattedHoraEntrega,
              };
            }
            return envio;
          })
        );
        setSelectedEnvioId(null);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnvioSelect = (id: number) => {
    setSelectedEnvioId(id);
  };

  // Calcular el centro del mapa si hay coordenadas de inicio y fin válidas
  const mapCenter: [number, number] =
    (startCoords && endCoords)
      ? [(startCoords[0] + endCoords[0]) / 2, (startCoords[1] + endCoords[1]) / 2]
      : defaultCenter;

      // Función auxiliar para formatear la duración
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600; // Obtiene los segundos restantes después de extraer las horas
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Asegura que cada parte tenga dos dígitos (ej: 05 en lugar de 5)
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(remainingSeconds).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
};

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '900px', margin: '0 auto' }}>

      <h1>Calculador de Ruta OSRM y Gestión de Envíos</h1>
      <p>
        Ingresa las **direcciones de inicio y destino** para obtener la ruta en el mapa. Si seleccionas un envío en estado "En preparación" y calculas la ruta, el envío mock se actualizará a "Enviado" y se calculará la hora de entrega.
      </p>

      {/* --- */}
      <h2>Ingreso de Direcciones</h2>
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label htmlFor="startAddress" style={{ display: 'block', marginBottom: '5px' }}>Dirección de Inicio:</label>
            <input
              type="text"
              id="startAddress"
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
              style={{ width: 'calc(100% - 10px)', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              placeholder="Ej: Calle Falsa 123, Ciudad"
            />
          </div>
          <div>
            <label htmlFor="endAddress" style={{ display: 'block', marginBottom: '5px' }}>Dirección de Destino:</label>
            <input
              type="text"
              id="endAddress"
              value={endAddress}
              onChange={(e) => setEndAddress(e.target.value)}
              style={{ width: 'calc(100% - 10px)', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              placeholder="Ej: Avenida Siempre Viva 742, Ciudad"
            />
          </div>
        </div>
        <button
          onClick={fetchOsrmRoute}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? 'Cargando...' : 'Obtener Ruta y Actualizar Envío'}
        </button>
      </div>

      {/* --- */}
      <h2>Información de la Ruta y Mapa</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {routeInfo && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9', marginBottom: '20px' }}>
          <p>
            <strong>Distancia:</strong> {(routeInfo.distance / 1000).toFixed(2)} kilómetros
          </p>
          <p>
            <strong>Duración estimada:</strong> {formatDuration(routeInfo.duration)}
          </p>

          <h3 style={{marginTop: '20px'}}>Mapa de la Ruta:</h3>
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '400px', width: '100%', borderRadius: '8px', border: '1px solid #ddd' }}
            key={JSON.stringify(mapCenter)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {decodedPolyline.length > 0 && (
              <Polyline positions={decodedPolyline} color="blue" weight={5} />
            )}

            {/* Marcador de Inicio */}
            {startCoords && (
              <Marker position={startCoords}>
                <Popup>Punto de Inicio: {startAddress}</Popup>
              </Marker>
            )}

            {/* Marcador de Destino */}
            {endCoords && (
              <Marker position={endCoords}>
                <Popup>Punto de Destino: {endAddress}</Popup>
              </Marker>
            )}
          </MapContainer>

          <h3 style={{marginTop: '20px'}}>Waypoints (Coordenadas OSRM):</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {routeInfo.waypoints.map((wp, index) => (
              <li key={index} style={{ marginBottom: '5px', borderBottom: '1px dotted #eee', paddingBottom: '5px' }}>
                <strong>{wp.name}</strong>: [{wp.location[0]}, {wp.location[1]}] (distancia: {wp.distance.toFixed(2)} m)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- */}
      <h2>Gestión de Envíos (Mock)</h2>
      <p>Selecciona un envío en estado "En preparación" para que sea actualizado al calcular la ruta.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {envios.map((envio) => (
          <div
            key={envio.id}
            onClick={() => envio.estado === 'En preparación' && handleEnvioSelect(envio.id)}
            style={{
              border: `2px solid ${selectedEnvioId === envio.id ? '#007bff' : '#ccc'}`,
              padding: '15px',
              borderRadius: '8px',
              cursor: envio.estado === 'En preparación' ? 'pointer' : 'default',
              backgroundColor: envio.estado === 'En preparación' ? (selectedEnvioId === envio.id ? '#e6f2ff' : '#fff') : '#f2f2f2',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              opacity: envio.estado !== 'En preparación' ? 0.7 : 1,
            }}
          >
            <h3>Envío #{envio.id}</h3>
            <p>
              <strong>Cliente:</strong> {envio.cliente}
            </p>
            <p>
              <strong>Conductor:</strong> {envio.conductor}
            </p>
            <p>
              <strong>Estado:</strong>{' '}
              <span style={{ color:
                envio.estado === 'En preparación' ? '#ff9800' :
                envio.estado === 'Enviado' ? '#4CAF50' : '#2196F3'
              }}>
                {envio.estado}
              </span>
            </p>
            <p>
              <strong>Fecha:</strong> {envio.fecha}
            </p>
            <p>
              <strong>Hora Asignación:</strong> {envio.horaAsignacion}
            </p>
            <p>
              <strong>Hora Entrega:</strong> {envio.horaEntrega}
            </p>
            {envio.estado === 'En preparación' && selectedEnvioId === envio.id && (
              <p style={{ color: '#007bff', fontWeight: 'bold', marginTop: '10px' }}>
                Este envío será actualizado al calcular la ruta.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    overflow: 'hidden',
},

  backgroundBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url('/Wallpaper.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',
    zIndex: 0,
},
}


export default OsrmRoutePage;