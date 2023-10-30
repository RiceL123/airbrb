import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { Typography } from '@mui/material';

const ListingsLandingPage = () => {
  const { authEmail, authToken } = useAuth();
  return (
    <>
      <Typography variant="h1">
        airbrb
      </Typography>
      <Typography variant="body1">welcome ~➡️{!authEmail && !authToken ? 'Guest User' : authEmail}⬅️~</Typography>
    </>
  );
}

export default ListingsLandingPage;
