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
          defaultValue={street}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="city"
          label="Address (City)"
          defaultValue={city}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="state"
          label="Address (State)"
          defaultValue={state}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
    </>
  );
}

export default AddressFields;
