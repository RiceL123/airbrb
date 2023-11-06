import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';

const BedroomFields = ({ bedrooms, handleBedroomChange, addBedroom, deleteBedroom }) => {
  return (
    <Grid item xs={12} sx={{ m: 1 }}>
      {bedrooms.map((bedroom, index) => (
        <Stack key={index} direction="row">
          <TextField
            name="name"
            label="Bedroom Name"
            value={bedroom.name}
            onChange={(e) => handleBedroomChange(e, index)}
            required
          />
          <TextField
            name="beds"
            label="Number of Beds"
            value={bedroom.beds}
            onChange={(e) => handleBedroomChange(e, index)}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            required
          />
          <Button variant="outlined" onClick={() => deleteBedroom(index)}>
            <DeleteIcon />
          </Button>
        </Stack>
      ))}
      <Button variant="contained" onClick={addBedroom}>
        Add Bedroom
      </Button>
    </Grid>
  );
}

export default BedroomFields;
