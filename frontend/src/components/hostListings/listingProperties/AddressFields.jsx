import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const AddressFields = ({ street, city, state, handleChange }) => {
  return (
    <>
      <Grid item xs={4}>
        <TextField
          name="street"
          label="Address (Street)"
          defaultValue={street}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          name="city"
          label="Address (City)"
          defaultValue={city}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          name="state"
          label="Address (State)"
          defaultValue={state}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
      </Grid>
    </>
  );
}

export default AddressFields;
