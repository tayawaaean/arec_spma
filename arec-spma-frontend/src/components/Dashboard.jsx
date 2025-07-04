import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Drawer,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from './Sidebar';
import { MapContainer, TileLayer, LayersControl, Marker } from 'react-leaflet';
import L from 'leaflet';

// Marker icons (public URLs)
const markerIcons = {
  green: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  }),
  yellow: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  }),
  red: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  }),
  orange: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  }),
};

function getMarkerIcon(status) {
  if (!status) return markerIcons.yellow; // fallback
  switch (status.toLowerCase()) {
    case 'active':    return markerIcons.green;
    case 'inactive':  return markerIcons.red;
    case 'problem':   return markerIcons.orange;
    default:          return markerIcons.yellow;
  }
}

const { BaseLayer } = LayersControl;
const APPBAR_HEIGHT = 64;

export default function Dashboard({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pumpData, setPumpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPump, setSelectedPump] = useState(null);

  useEffect(() => {
    const fetchPumps = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No auth token found. Please log in.");
          setLoading(false);
          return;
        }
        const res = await fetch('http://localhost:5000/api/pumps', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) {
          setError(res.status === 401 ? "Unauthorized. Please log in again." : `Failed to fetch pumps (Status: ${res.status})`);
          setLoading(false);
          return;
        }
        const json = await res.json();
        setPumpData(json.data || []);
      } catch (err) {
        setError("Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPumps();
  }, [user]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#151c72' }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setSidebarOpen(open => !open)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
            AFFILIATED RENEWABLE ENERGY CENTER
          </Typography>
          <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
            {user?.username || 'Username'}
          </Typography>
          <Avatar>{user?.username?.[0]?.toUpperCase() ?? 'U'}</Avatar>
        </Toolbar>
      </AppBar>

      <Sidebar userType={user.userType} open={sidebarOpen} onClose={() => setSidebarOpen(open => !open)} />

      {/* Enhanced Pump Info Sidebar */}
      <Drawer
        anchor="left"
        open={!!selectedPump}
        onClose={() => setSelectedPump(null)}
        PaperProps={{
          sx: {
            width: 400,
            p: 0,
            background: "#f8fafc",
            position: 'fixed',
            left: 0,
            top: `${APPBAR_HEIGHT}px`,
            height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
            boxSizing: 'border-box',
            zIndex: (theme) => theme.zIndex.appBar + 1,
            overflowY: 'auto',
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            boxShadow: 6,
            border: 'none'
          }
        }}
        ModalProps={{
          keepMounted: true
        }}
        variant="persistent"
      >
        {selectedPump && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header with close button and status chip */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                pt: 2,
                pb: 1.5,
                background: '#fff',
                borderTopRightRadius: 16
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Solar Pump #{selectedPump.solarPumpNumber}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Chip
                    label={selectedPump.status?.charAt(0).toUpperCase() + selectedPump.status?.slice(1)}
                    size="small"
                    sx={{
                      bgcolor:
                        selectedPump.status === "active" ? "#22c55e"
                          : selectedPump.status === "inactive" ? "#ef4444"
                          : selectedPump.status === "problem" ? "#f59e42"
                          : "#eab308",
                      color: "#fff",
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedPump(null)} size="large">
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            {/* Specs as grid */}
            <Box sx={{ px: 3, py: 2, flexGrow: 1, overflowY: 'auto' }}>
              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" color="text.secondary" variant="body2">Model</Typography>
                  <Typography>{selectedPump.model}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" color="text.secondary" variant="body2">Power</Typography>
                  <Typography>{selectedPump.power}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" color="text.secondary" variant="body2">AC Input Voltage</Typography>
                  <Typography>{selectedPump.acInputVoltage}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" color="text.secondary" variant="body2">PV Operating Voltage</Typography>
                  <Typography>{selectedPump.pvOperatingVoltage}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" color="text.secondary" variant="body2">Open Circuit Voltage</Typography>
                  <Typography>{selectedPump.openCircuitVoltage}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" color="text.secondary" variant="body2">Outlet</Typography>
                  <Typography>{selectedPump.outlet}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" color="text.secondary" variant="body2">Max Head</Typography>
                  <Typography>{selectedPump.maxHead}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontWeight="bold" color="text.secondary" variant="body2">Max Flow</Typography>
                  <Typography>{selectedPump.maxFlow}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography fontWeight="bold" color="text.secondary" variant="body2">Solar Panel Config</Typography>
                  <Typography>{selectedPump.solarPanelConfig}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography fontWeight="bold" color="text.secondary" variant="body2">Location</Typography>
                <Typography>
                  {[selectedPump?.address?.barangay, selectedPump?.address?.municipality, selectedPump?.address?.region, selectedPump?.address?.country]
                    .filter(Boolean).join(', ')}
                </Typography>
                <Typography fontWeight="bold" color="text.secondary" variant="body2" sx={{ mt: 2 }}>Installed</Typography>
                <Typography>
                  {selectedPump.timeInstalled
                    ? new Date(
                        typeof selectedPump.timeInstalled === "string"
                          ? selectedPump.timeInstalled
                          : selectedPump.timeInstalled.$date || selectedPump.timeInstalled
                      ).toLocaleDateString()
                    : ""}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 0, pt: `${APPBAR_HEIGHT}px`, position: 'relative' }}>
        {loading && (
          <Paper elevation={3}
            sx={{
              position: 'absolute', top: 100, left: 30, zIndex: 1000, p: 2,
              bgcolor: 'background.paper', borderRadius: 2, minWidth: 140, display: 'flex', alignItems: 'center'
            }}
          >
            <CircularProgress size={24} sx={{ mr: 2 }} /> Loading pumps...
          </Paper>
        )}
        {error && (
          <Paper elevation={3}
            sx={{
              position: 'absolute', top: 100, left: 30, zIndex: 1000, p: 2,
              bgcolor: 'background.paper', borderRadius: 2, minWidth: 200
            }}
          >
            <Alert severity="error">{error}</Alert>
          </Paper>
        )}

        <MapContainer center={[12.8797, 121.7740]} zoom={6} style={{ height: `calc(100vh - ${APPBAR_HEIGHT}px)`, width: '100%' }}>
          <LayersControl position="topleft">
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
            </BaseLayer>
            <BaseLayer name="Esri ArcGIS World Imagery">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
            </BaseLayer>
          </LayersControl>
          {pumpData.map(pump => (
            <Marker
              key={pump._id}
              position={[pump.lat, pump.lng]}
              icon={getMarkerIcon(pump.status)}
              eventHandlers={{
                click: () => setSelectedPump(pump),
              }}
            />
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
}