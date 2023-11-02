import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const PropertyTypeSelect = ({ value, onChange }) => {
  return (
    <TextField
      select
      name="propertyType"
      label="Property Type"
      defaultValue={!value ? 'entirePlace' : value}
      onChange={onChange}
      fullWidth
      required
      sx={{ mb: 2 }}
    >
      <MenuItem value="entirePlace">Entire Place</MenuItem>
      <MenuItem value="privateRoom">Private Room</MenuItem>
      <MenuItem value="hotelRoom">Hotel Room</MenuItem>
      <MenuItem value="sharedRoom">Shared Room</MenuItem>
    </TextField>
  );
}

export default PropertyTypeSelect;
