import React from 'react';
import {
  Link
} from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import Logout from './auth/Logout';
import MenuToggle from './MenuToggle';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Nav = () => {
  const { authEmail, authToken } = useAuth();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <MenuToggle />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>💀 airbrb</Link>
          </Typography>

          {!authEmail && !authToken
            ? (<>
              <Link to="/login"><Button variant='contained'>Login</Button></Link>
              <Link to="/register"><Button variant='contained'>Register</Button></Link>
            </>)
            : <Logout />}
        </Toolbar>
      </AppBar>
    </Box >
  );
}

export default Nav;
