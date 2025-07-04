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
  Divider,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MapIcon from '@mui/icons-material/Public';
import ListIcon from '@mui/icons-material/List';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const menuConfig = {
  superadmin: [
    { text: 'Map Dashboard', icon: <MapIcon /> },
    { text: 'Pump List', icon: <ListIcon /> },
    { text: 'Datas', icon: <DataUsageIcon /> },
    { text: 'User', icon: <PeopleIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
  ],
  admin: [
    { text: 'Map Dashboard', icon: <MapIcon /> },
    { text: 'Pump List', icon: <ListIcon /> },
    { text: 'Datas', icon: <DataUsageIcon /> },
    { text: 'User', icon: <PeopleIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
  ],
  user: [
    { text: 'Map Dashboard', icon: <MapIcon /> },
    { text: 'Pump List', icon: <ListIcon /> },
    { text: 'Datas', icon: <DataUsageIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
  ]
};

export default function Sidebar({ open, onClose, userType = "admin" }) {
  const menu = menuConfig[userType] || menuConfig.user;
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
        {menu.map((item, idx) => (
          <ListItem
            button
            key={item.text}
            sx={{
              py: 1.5,
              color: idx === 0 ? '#151c72' : undefined,
              bgcolor: idx === 0 ? 'rgba(21,28,114,0.07)' : undefined,
              borderLeft: idx === 0 ? '4px solid #151c72' : '4px solid transparent',
              '&:hover': { bgcolor: 'rgba(21,28,114,0.04)' }
            }}
          >
            <ListItemIcon sx={{ color: idx === 0 ? '#151c72' : '#222', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: idx === 0 ? 'bold' : 'medium',
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