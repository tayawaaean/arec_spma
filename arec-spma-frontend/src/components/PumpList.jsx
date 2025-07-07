import React, { useState, useEffect } from "react";
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
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "./Sidebar";

const APPBAR_HEIGHT = 64;

export default function PumpList({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // For future: pump list state, selected pump, etc.

  // Example fetch logic, can be filled later
  useEffect(() => {
    setLoading(false);
    setError("");
    // Fetch pump list here in future
  }, [user]);

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
          p: 0,
          pt: `${APPBAR_HEIGHT}px`,
          position: "relative",
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

        <Box
          sx={{
            height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" color="text.secondary" fontWeight="bold">
            Pump List
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}