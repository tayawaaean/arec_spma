import React, { useState } from "react";
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
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";

const APPBAR_HEIGHT = 64;

export default function Overview({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading] = useState(false);
  const [error] = useState("");

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#151c72",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setSidebarOpen((open) => !open)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
          >
            AFFILIATED RENEWABLE ENERGY CENTER
          </Typography>
          <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
            {user?.username || "Username"}
          </Typography>
          <Avatar>{user?.username?.[0]?.toUpperCase() ?? "U"}</Avatar>
        </Toolbar>
      </AppBar>

      <Sidebar
        userType={user.userType}
        open={sidebarOpen}
        onClose={() => setSidebarOpen((open) => !open)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          pt: `${APPBAR_HEIGHT + 16}px`,
          background: "#f5f7fc",
          minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`,
        }}
      >
        {loading && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: 100,
              left: 30,
              zIndex: 1000,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
              minWidth: 140,
              display: "flex",
              alignItems: "center",
            }}
          >
            <CircularProgress size={24} sx={{ mr: 2 }} /> Loading...
          </Paper>
        )}
        {error && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: 100,
              left: 30,
              zIndex: 1000,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
              minWidth: 200,
            }}
          >
            <Alert severity="error">{error}</Alert>
          </Paper>
        )}

        {/* DASHBOARD GRID */}
        <Grid container spacing={2}>
          {/* Top row: KPI cards */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ borderRadius: 3, p: 2, mb: 2, minHeight: 120, background: "#fff" }}>
              {/* Place KPI stats, image, total yield, etc here */}
              <Typography variant="h6" fontWeight="bold" mb={1}>Total yield</Typography>
              <Typography variant="h3" color="primary" fontWeight="bold">156 kWh</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ borderRadius: 3, p: 2, mb: 2, minHeight: 120, background: "#fff" }}>
              {/* Weather Info */}
              <Typography variant="h6" fontWeight="bold" mb={1}>Weather Today</Typography>
              <Typography variant="h3" color="primary" fontWeight="bold">27°C</Typography>
              <Typography>Extremely Cloudy</Typography>
            </Paper>
          </Grid>
          {/* 2nd row: charts, monitoring, generation */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ borderRadius: 3, p: 2, minHeight: 250, background: "#fff" }}>
              {/* Performance Monitoring Chart */}
              <Typography variant="h6" fontWeight="bold" mb={2}>Performance Monitoring</Typography>
              {/* Chart goes here */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ borderRadius: 3, p: 2, minHeight: 250, background: "#fff" }}>
              {/* Monthly Generation */}
              <Typography variant="h6" fontWeight="bold" mb={2}>Monthly Generation</Typography>
              {/* Generation info goes here */}
            </Paper>
          </Grid>
          {/* 3rd row: info table, image */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ borderRadius: 3, p: 2, minHeight: 200, background: "#fff" }}>
              {/* Information Table */}
              <Typography variant="h6" fontWeight="bold" mb={2}>Information</Typography>
              {/* Table goes here */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ borderRadius: 3, p: 2, minHeight: 200, background: "#fff" }}>
              {/* Image or any additional info */}
            </Paper>
          </Grid>
        </Grid>
        {/* Centered Overview (optional) */}
        <Box
          sx={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <Typography
            variant="h2"
            color="text.secondary"
            fontWeight="bold"
            sx={{ opacity: 0.18 }}
          >
            Overview
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}