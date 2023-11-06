import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

const BedroomFields = ({ bedrooms, handleBedroomChange, addBedroom, deleteBedroom }) => {
  return (
    <Grid item xs={12} sx={{ m: 1 }}>
      {bedrooms.map((bedroom, index) => (
        <Stack key={index} direction="row" sx={{ mb: 1 }}>
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
          <IconButton
            color="error"
            onClick={() => deleteBedroom(index)}
            aria-label="Delete Bedroom"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}
      <Button variant="outlined" onClick={addBedroom} endIcon={<AddIcon />}>
        Add Bedroom
      </Button>
    </Grid>
  );
}

export default BedroomFields;
