'use client';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useColorScheme } from '@mui/material/styles';
import * as React from 'react';

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleClose();
  };

  if (!mode) {
    return null;
  }

  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'theme-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {mode === 'light' ? (
          <LightModeIcon />
        ) : mode === 'dark' ? (
          <DarkModeIcon />
        ) : (
          <SettingsBrightnessIcon />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="theme-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleModeChange('light')}>
          <LightModeIcon fontSize="small" sx={{ mr: 1 }} /> Light
        </MenuItem>
        <MenuItem onClick={() => handleModeChange('dark')}>
          <DarkModeIcon fontSize="small" sx={{ mr: 1 }} /> Dark
        </MenuItem>
        <MenuItem onClick={() => handleModeChange('system')}>
          <SettingsBrightnessIcon fontSize="small" sx={{ mr: 1 }} /> System
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
