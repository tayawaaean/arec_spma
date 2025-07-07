import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MapIcon from '@mui/icons-material/Public';
import ListIcon from '@mui/icons-material/List';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard'; // For Overview

// Add route property for each menu item
const menuConfig = {
  superadmin: [
    { text: 'Overview', icon: <DashboardIcon />, route: "/overview" },
    { text: 'Map Dashboard', icon: <MapIcon />, route: "/dashboard" },
    { text: 'Pump List', icon: <ListIcon />, route: "/pumps" },
    { text: 'Datas', icon: <DataUsageIcon />, route: "/data" },
    { text: 'User', icon: <PeopleIcon />, route: "/users" },
    { text: 'Settings', icon: <SettingsIcon />, route: "/settings" },
  ],
  admin: [
    { text: 'Overview', icon: <DashboardIcon />, route: "/overview" },
    { text: 'Map Dashboard', icon: <MapIcon />, route: "/dashboard" },
    { text: 'Pump List', icon: <ListIcon />, route: "/pumps" },
    { text: 'Datas', icon: <DataUsageIcon />, route: "/data" },
    { text: 'User', icon: <PeopleIcon />, route: "/users" },
    { text: 'Settings', icon: <SettingsIcon />, route: "/settings" },
  ],
  user: [
    { text: 'Overview', icon: <DashboardIcon />, route: "/overview" },
    { text: 'Map Dashboard', icon: <MapIcon />, route: "/dashboard" },
    { text: 'Pump List', icon: <ListIcon />, route: "/pumps" },
    { text: 'Datas', icon: <DataUsageIcon />, route: "/data" },
    { text: 'Settings', icon: <SettingsIcon />, route: "/settings" },
  ]
};

// Import useNavigate for routing
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ open, onClose, userType = "admin" }) {
  const menu = menuConfig[userType] || menuConfig.user;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="persistent"
      anchor="left"
      PaperProps={{
        sx: {
          width: 280,
          boxSizing: 'border-box',
          background: '#fff',
          color: '#222',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2 }}>
        <IconButton onClick={onClose} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
          ArecGIS
        </Typography>
      </Box>
      <List sx={{ mt: 2 }}>
        {menu.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.route}
            onClick={() => {
              navigate(item.route);
              onClose?.();
            }}
            sx={{
              py: 1.5,
              color: location.pathname === item.route ? '#151c72' : undefined,
              bgcolor: location.pathname === item.route ? 'rgba(21,28,114,0.07)' : undefined,
              borderLeft: location.pathname === item.route ? '4px solid #151c72' : '4px solid transparent',
              '&:hover': { bgcolor: 'rgba(21,28,114,0.04)' }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.route ? '#151c72' : '#222', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.route ? 'bold' : 'medium',
                fontSize: 17,
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      {/* Admin badge at the bottom */}
      {userType === 'admin' || userType === 'superadmin' ? (
        <Box sx={{ p: 2 }}>
          <Chip
            label={userType.charAt(0).toUpperCase() + userType.slice(1)}
            color="error"
            size="small"
            sx={{
              fontWeight: 'bold',
              fontSize: 14,
              borderRadius: 1,
              px: 1.5,
            }}
            icon={
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "inline-block",
                  marginRight: 6
                }}
              />
            }
          />
        </Box>
      ) : null}
    </Drawer>
  );
}