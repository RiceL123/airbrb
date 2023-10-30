import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../helpers';
const Logout = () => {
  const naviagte = useNavigate();
  const { authToken, logout } = useAuth();

  const handleLogout = async () => {
    const res = await apiCall('POST', authToken, '/user/auth/logout')
    if (res.ok) {
      logout();
      naviagte('/');
    } else {
      alert(res.statusText);
    }
  }
  return (
    <Button variant="contained" onClick={handleLogout}>Logout</Button>
  );
}

export default Logout;
