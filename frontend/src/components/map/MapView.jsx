import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faBolt, faSolarPanel } from '@fortawesome/free-solid-svg-icons';
import { Tabs, Tab } from 'react-bootstrap';

// Import your utilities
import { solarPumps, filterPumpsByStatus, formatDate } from '../../utils/solarPumpData';
import { STATUS_COLORS, MAP_DEFAULTS } from '../../utils/constants';

// Import the real-time metrics component
import RealTimePumpMetrics from './RealTimePumpMetrics';
import FullscreenControl from './FullscreenControl';

// Custom marker icons based on status (unchanged)
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

const MapView = ({ statusFilter = "all" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerId = 'solar-pump-map-container';
  
  // Get filtered pumps
  const filteredPumps = filterPumpsByStatus(solarPumps, statusFilter);
  
  // Effect to resize map when fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenNow = !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      
      setIsFullscreen(isFullscreenNow);
      
      // Allow map to resize properly when fullscreen changes
      const map = document.querySelector('#' + mapContainerId + ' .leaflet-map-pane');
      if (map) {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
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

        {/* Solar Pump Markers */}
        {filteredPumps.map(pump => (
          <Marker 
            key={pump._id} 
            position={[pump.lat, pump.lng]}
            icon={createCustomIcon(pump.status)}
          >
            <Popup className="custom-popup">
              <div className="solar-pump-popup" style={{ width: '320px' }}>
                <Tabs defaultActiveKey="realtime" className="mb-3">
                  {/* Real-time tab is now first and default */}
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
                      }>{pump.status.charAt(0).toUpperCase() + pump.status.slice(1)}</span>
                    </div>
                    
                    {/* Real-time metrics component */}
                    <RealTimePumpMetrics pumpId={pump._id} />
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
                      }>{pump.status.charAt(0).toUpperCase() + pump.status.slice(1)}</span>
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
                      {pump.address.barangay}, {pump.address.municipality}, {pump.address.region}
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
      
      {/* Fullscreen Control */}
      <div className="map-custom-controls">
        <FullscreenControl mapContainerId={mapContainerId} />
      </div>
    </div>
  );
};

export default MapView;