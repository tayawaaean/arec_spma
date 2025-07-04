import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Dummy/fallback image
const defaultPumpImg = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

export default function PumpList() {
  const [pumps, setPumps] = useState([]);
  const [pumpData, setPumpData] = useState([]);
  const [selectedPump, setSelectedPump] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  // Fetch pump list
  useEffect(() => {
    const fetchPumps = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/pumps", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch pumps");
        const data = await res.json();
        setPumps(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPumps();
  }, []);

  // Fetch pump data for selected pump
  useEffect(() => {
    if (!selectedPump) return;
    const fetchPumpData = async () => {
      setLoadingData(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/pump-data?pump=${selectedPump}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch pump data");
        const data = await res.json();
        setPumpData(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };
    fetchPumpData();
  }, [selectedPump]);

  // Get selected pump object
  const selectedPumpObj = pumps.find((p) => String(p._id) === String(selectedPump));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Pump List
      </Typography>
      {loading ? (
        <Paper sx={{ p: 2, mb: 2, display: "flex", alignItems: "center" }}>
          <CircularProgress size={24} sx={{ mr: 2 }} /> Loading pumps...
        </Paper>
      ) : error ? (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Pump</InputLabel>
          <Select
            value={selectedPump}
            label="Select Pump"
            onChange={(e) => setSelectedPump(e.target.value)}
          >
            {pumps.map((p) => (
              <MenuItem key={p._id} value={p._id}>
                {p.model
                  ? `${p.model} (#${p.solarPumpNumber || p.pumpNumber || p.pump || ""})`
                  : `Pump #${p.solarPumpNumber || p.pumpNumber || p.pump || ""}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Pump info card */}
      {selectedPumpObj && (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardMedia
            component="img"
            height="180"
            image={selectedPumpObj.imageUrl || defaultPumpImg}
            alt="Pump site"
          />
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Solar Energy
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {selectedPumpObj.model}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {selectedPumpObj.status || "Active"}
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}><Typography fontWeight="bold">Power</Typography></Grid>
              <Grid item xs={6}><Typography>{selectedPumpObj.power}</Typography></Grid>
              <Grid item xs={6}><Typography fontWeight="bold">Max Flow</Typography></Grid>
              <Grid item xs={6}><Typography>{selectedPumpObj.maxFlow}</Typography></Grid>
              <Grid item xs={6}><Typography fontWeight="bold">Location</Typography></Grid>
              <Grid item xs={6}>
                <Typography>
                  {[selectedPumpObj?.address?.barangay, selectedPumpObj?.address?.municipality, selectedPumpObj?.address?.region, selectedPumpObj?.address?.country]
                    .filter(Boolean).join(", ")}
                </Typography>
              </Grid>
              <Grid item xs={6}><Typography fontWeight="bold">Installed</Typography></Grid>
              <Grid item xs={6}>
                <Typography>
                  {selectedPumpObj.timeInstalled
                    ? new Date(
                        typeof selectedPumpObj.timeInstalled === "string"
                          ? selectedPumpObj.timeInstalled
                          : selectedPumpObj.timeInstalled.$date || selectedPumpObj.timeInstalled
                      ).toLocaleDateString()
                    : ""}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Pump data cards */}
      {selectedPump && (
        loadingData ? (
          <Paper sx={{ p: 2, mb: 2, display: "flex", alignItems: "center" }}>
            <CircularProgress size={24} sx={{ mr: 2 }} /> Loading pump data...
          </Paper>
        ) : pumpData.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No data available for this pump.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {pumpData.map((data, idx) => (
              <Grid item xs={12} sm={6} md={4} key={data._id?.$oid || idx}>
                <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                  <CardContent>
                    <Typography fontWeight="bold" sx={{ mb: 1 }}>
                      Data as of {data.time?.$date ? new Date(data.time.$date).toLocaleString() : ""}
                    </Typography>
                    <Grid container spacing={0.5}>
                      <Grid item xs={7}><Typography variant="body2" fontWeight="bold">Current</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2">{data.filtered_current} A</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight="bold">Voltage</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2">{data.filtered_voltage} V</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight="bold">Flow</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2">{data.flow} m³/h</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight="bold">Power</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2">{data.power} W</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight="bold">Energy (Wh)</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2">{data.accumulated_energy_wh}</Typography></Grid>
                      <Grid item xs={7}><Typography variant="body2" fontWeight="bold">Total Volume</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2">{data.total_water_volume} m³</Typography></Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      )}
    </Box>
  );
}