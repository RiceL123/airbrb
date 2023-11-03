import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../helpers';
const Logout = () => {
  const naviagte = useNavigate();
  const { authToken, logout } = useAuth();

  const handleLogout = async () => {
    await apiCall('POST', authToken, '/user/auth/logout');
    logout();
    naviagte('/');
  }
  return (
    <Button variant="contained" onClick={handleLogout}>Logout</Button>
  );
}

export default Logout;
