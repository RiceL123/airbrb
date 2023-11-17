import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../helpers';
import LogoutIcon from '@mui/icons-material/Logout';

const Logout = () => {
  const naviagte = useNavigate();
  const { authToken, logout } = useAuth();

  const handleLogout = async () => {
    await apiCall('POST', authToken, '/user/auth/logout');
    logout();
    naviagte('/');
  }
  return (
    <Button variant="contained" onClick={handleLogout} endIcon={<LogoutIcon />}>Logout</Button>
  );
}

export default Logout;
