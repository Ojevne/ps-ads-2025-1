import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../assets/karangos-logo-600px.png'
import MainMenu from './MainMenu';
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

import AuthWidgets from './AuthWidgets'

export default function TopBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" enableColorOnDark>
        <Toolbar variant="dense">        
            <MenuIcon />
          <MainMenu/>
          <Box sx={{ flexGrow: 1 }}>
            <Link to="/">
              <img src={logo} alt="LogoTipo Karangos" style={{width: '300px'}}/>
            </Link>
          </Box>

          <AuthWidgets />

        </Toolbar>
      </AppBar>
    </Box>
  );
}
