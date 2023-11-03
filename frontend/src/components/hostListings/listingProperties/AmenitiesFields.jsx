import React from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const AmenitiesFields = ({ amenities, handleAmenityChange, addAmenity, deleteAmenity }) => {
  return (
    <>
      {amenities.map((amenity, index) => (
        <Stack direction='row' key={index} sx={{ mb: 1 }}>
          <TextField
            name="name"
            label="Amenities Name"
            value={amenity}
            onChange={(e) => handleAmenityChange(e, index)}
            required
          />
          <IconButton
            color="error"
            onClick={() => deleteAmenity(index)}
            aria-label="Delete Amenity"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}
      <Button variant="outlined" onClick={addAmenity}>
        Add Amenity
      </Button>
    </>
  );
};

export default AmenitiesFields;
