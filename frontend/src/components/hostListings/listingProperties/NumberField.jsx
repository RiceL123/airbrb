import React from 'react';
import TextField from '@mui/material/TextField';

const NumberField = ({ name, label, value, onChange }) => {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      fullWidth
      inputProps={{
        inputMode: 'numeric',
        pattern: '[0-9]*',
      }}
      required
    />
  );
}

export default NumberField;
