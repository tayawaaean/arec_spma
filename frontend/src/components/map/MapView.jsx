import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mqtt from 'mqtt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faBolt, faSolarPanel, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Tabs, Tab, Alert } from 'react-bootstrap';

import { filterPumpsByStatus, formatDate } from '../../utils/solarPumpData';
import { STATUS_COLORS, MAP_DEFAULTS } from '../../utils/constants';
import { pumpService } from '../../utils/pumpApi';
import RealTimePumpMetrics from './RealTimePumpMetrics';
import FullscreenControl from './FullscreenControl';

const createCustomIcon = (status) => {
  const markerColor = STATUS_COLORS[status] || STATUS_COLORS.offline;
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const MQTT_WS_URL = "ws://mqtt.arecmmsu.com:9001"; // Replace with your MQTT broker's websocket address

const MapView = ({ statusFilter = "all" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mqttClientRef = useRef(null);
  const mapContainerId = 'solar-pump-map-container';

  // --- Fetch pumps meta info ONCE on mount ---
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await pumpService.getAllPumps({});
        setPumps(response.data || []);
      } catch (err) {
        setError('Failed to load pump data. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- MQTT operational status subscription ---
  useEffect(() => {
    if (pumps.length === 0) return;

    // Connect to MQTT broker over WebSockets
    const mqttClient = mqtt.connect(MQTT_WS_URL, {
      username: "arec", // Set if needed
      password: "arecmqtt", // Set if needed
      reconnectPeriod: 3000
    });
    mqttClientRef.current = mqttClient;

    // Subscribe to all operational_status topics
    pumps.forEach((pump) => {
      const topic = `arec/pump/${pump.solarPumpNumber}/operational_status`;
      mqttClient.subscribe(topic);
    });

    mqttClient.on('message', (topic, message) => {
      const match = topic.match(/^arec\/pump\/(\d+)\/operational_status$/);
      if (!match) return;
      const pumpNumber = parseInt(match[1], 10);
      const status = message.toString();

      // Update status in state
      setPumps((prevPumps) =>
        prevPumps.map((p) =>
          p.solarPumpNumber === pumpNumber ? { ...p, status } : p
        )
      );
    });

    mqttClient.on('error', (err) => {
      setError('MQTT connection error: ' + err.message);
    });

    // Cleanup on unmount
    return () => {
      mqttClient.end(true);
    };
  }, [pumps.length]);

  // --- Filter by status ---
  const visiblePumps = statusFilter === "all"
    ? pumps
    : pumps.filter((p) => p.status === statusFilter);

  // Effect to resize map when fullscreen changes (unchanged)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFullscreenNow);
      const map = document.querySelector('#' + mapContainerId + ' .leaflet-map-pane');
      if (map) setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [mapContainerId]);

  return (
    <div
      id={mapContainerId}
      className={`map-container ${isFullscreen ? 'fullscreen-map' : ''}`}
      style={{ height: "100%", width: "100%", position: "relative" }}
    >
      <MapContainer
        center={MAP_DEFAULTS.center}
        zoom={MAP_DEFAULTS.zoom}
        zoomControl={false}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <ZoomControl position="topright" />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street View">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain View">
            <TileLayer
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {loading && (
          <div className="map-loading-overlay">
            <div className="map-loading-spinner">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
              <div className="mt-2">Loading pumps...</div>
            </div>
          </div>
        )}

        {error && (
          <div className="map-error-overlay">
            <Alert variant="danger">
              {error}
            </Alert>
          </div>
        )}

        {/* Solar Pump Markers */}
        {visiblePumps.map(pump => (
          <Marker
            key={pump._id}
            position={[pump.lat, pump.lng]}
            icon={createCustomIcon(pump.status)}
          >
            <Popup className="custom-popup">
              <div className="solar-pump-popup" style={{ width: '320px' }}>
                <Tabs defaultActiveKey="realtime" className="mb-3">
                  <Tab eventKey="realtime" title="Real-Time">
                    <h5 className="mb-3">Solar Pump #{pump.solarPumpNumber}</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold">Model:</span>
                      <span>{pump.model}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-bold">Status:</span>
                      <span className={
                        pump.status === "active" ? "text-success" :
                        pump.status === "maintenance" ? "text-warning" : "text-danger"
                      }>{pump.status ? pump.status.charAt(0).toUpperCase() + pump.status.slice(1) : "Unknown"}</span>
                    </div>
                    <RealTimePumpMetrics pumpId={pump.solarPumpNumber} />
                  </Tab>
                  <Tab eventKey="info" title="Info">
                    <h5 className="mb-2">Solar Pump #{pump.solarPumpNumber}</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold">Model:</span>
                      <span>{pump.model}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold">Status:</span>
                      <span className={
                        pump.status === "active" ? "text-success" :
                        pump.status === "maintenance" ? "text-warning" : "text-danger"
                      }>{pump.status ? pump.status.charAt(0).toUpperCase() + pump.status.slice(1) : "Unknown"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold">Power:</span>
                      <span>{pump.power}</span>
                    </div>
                    <hr className="my-2" />
                    <h6 className="mb-2"><FontAwesomeIcon icon={faBolt} className="text-warning me-2" />Electrical Specs</h6>
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>AC Input:</span>
                      <span>{pump.acInputVoltage}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>PV Operating:</span>
                      <span>{pump.pvOperatingVoltage}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>Open Circuit:</span>
                      <span>{pump.openCircuitVoltage}</span>
                    </div>
                    <hr className="my-2" />
                    <h6 className="mb-2"><FontAwesomeIcon icon={faTint} className="text-info me-2" />Water Specs</h6>
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>Outlet Size:</span>
                      <span>{pump.outlet}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>Max Head:</span>
                      <span>{pump.maxHead}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>Max Flow:</span>
                      <span>{pump.maxFlow}</span>
                    </div>
                    <hr className="my-2" />
                    <h6 className="mb-2"><FontAwesomeIcon icon={faSolarPanel} className="text-primary me-2" />Solar Panel</h6>
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>Configuration:</span>
                      <span>{pump.solarPanelConfig}</span>
                    </div>
                    <hr className="my-2" />
                    <h6 className="mb-2">Location</h6>
                    <div className="small mb-2">
                      {pump.address?.barangay}, {pump.address?.municipality}, {pump.address?.region}
                    </div>
                    <div className="small text-muted mb-2">
                      Installed: {formatDate(pump.timeInstalled)}
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="map-custom-controls">
        <FullscreenControl mapContainerId={mapContainerId} />
      </div>
      <style jsx>{`
        .map-loading-overlay,
        .map-error-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: 10px;
        }
        .map-loading-spinner {
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 20px 30px;
          border-radius: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default MapView;