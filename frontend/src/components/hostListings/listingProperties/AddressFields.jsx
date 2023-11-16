import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const AddressFields = ({ street, city, state, handleChange }) => {
  return (
    <>
      <Grid item xs={12} md={4}>
        <TextField
          name="street"
          label="Address (Street)"
          value={street}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="city"
          label="Address (City)"
          value={city}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="state"
          label="Address (State)"
          value={state}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
    </>
  );
}

export default AddressFields;
