import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

import { Typography, MenuItem, Grid, Input } from '@mui/material';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const HostListingsPage = () => {
  const { authEmail, authToken } = useAuth();
  const [listingData, setListingData] = useState({
    title: '',
    address: '',
    thumbUrl: '',
    price: 0.0,
    propertyType: '',
    bedrooms: [],
    numberBathrooms: 0,
    amenities: [],
    images: [],
    isLive: false,
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'price') {
      if (/^\d+$/.test(value) || value === '') {
        setListingData({ ...listingData, [name]: value });
      }
    } else if (name === 'thumbnail') {
      setListingData({ ...listingData, [name]: event.target.files[0] });
    } else {
      setListingData({ ...listingData, [name]: value });
    }
  };

  const handleCreateListing = () => {
    console.log(listingData);
    resetListingData();
    toggleFormVisibility();
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const addBedroom = () => {
    const newBedroom = { name: '', beds: 0 };
    setListingData({
      ...listingData,
      bedrooms: [...listingData.bedrooms, newBedroom],
    });
  };

  const handleBedroomChange = (event, index) => {
    const { name, value } = event.target;
    const updatedBedrooms = [...listingData.bedrooms];
    updatedBedrooms[index][name] = value;
    setListingData({ ...listingData, bedrooms: updatedBedrooms });
  };

  const addAmenity = () => {
    const newAmenity = { name: '' };
    setListingData({
      ...listingData,
      amenities: [...listingData.amenities, newAmenity],
    });
  };

  const handleAmenityChange = (event, index) => {
    const { name, value } = event.target;
    const updatedAmenities = [...listingData.amenities];
    updatedAmenities[index][name] = value;
    setListingData({ ...listingData, amenities: updatedAmenities });
  };

  const addImages = (event) => {
    const selectedImages = event.target.files;
    const updatedImages = [...listingData.images];

    for (let i = 0; i < selectedImages.length; i++) {
      updatedImages.push(selectedImages[i]);
    }

    setListingData({ ...listingData, images: updatedImages });
  };

  const resetListingData = () => {
    setListingData({
      title: '',
      address: '',
      thumbUrl: '',
      price: 0.0,
      propertyType: '',
      bedrooms: [],
      numberBathrooms: 0,
      amenities: [],
      images: [],
      isLive: false,
    });
  };

  return (
    <>
      <Box section="section" sx={{ p: 1, m: 1 }}>
        <Typography variant="h6">Here are your hosted properties, {authEmail}.</Typography>
        <Typography variant='body1'>TODO</Typography>
      </Box>

      <Box section="section" sx={{ p: 1, m: 1 }}>
        <Box>
          {isFormVisible && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Create new Listing</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Listing Title"
                  value={listingData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                name="address"
                label="Listing Address"
                value={listingData.address}
                onChange={handleInputChange}
                fullWidth
                required
              />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="price"
                  label="Listing Price (Nightly)"
                  value={listingData.price}
                  onChange={handleInputChange}
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  name="propertyType"
                  label="Property Type"
                  value={listingData.propertyType}
                  onChange={handleInputChange}
                  fullWidth
                  required
                >
                  <MenuItem value="entirePlace">Entire Place</MenuItem>
                  <MenuItem value="privateRoom">Private Room</MenuItem>
                  <MenuItem value="hotelRoom">Hotel Room</MenuItem>
                  <MenuItem value="sharedRoom">Shared Room</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4}>
               <Typography variant="caption">Thumbnail</Typography>
                <Input
                  name="thumbnail"
                  type="file"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption">Images</Typography>
                <Input
                  name="images"
                  type="file"
                  multiple
                  onChange={addImages}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="numberBathrooms"
                  label="Number of bathrooms"
                  value={listingData.numberBathrooms}
                  onChange={handleInputChange}
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                {listingData.bedrooms.map((bedroom, index) => (
                  <div key={index}>
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
                      required
                    />
                  </div>
                ))}
                <Button variant="contained" onClick={addBedroom}>
                  Add Bedroom
                </Button>
              </Grid>
              <Grid item xs={6}>
                {listingData.amenities.map((amenity, index) => (
                  <div key={index}>
                    <TextField
                      name="name"
                      label="Amenitities Name"
                      value={amenity.name}
                      onChange={(e) => handleAmenityChange(e, index)}
                      required
                    />
                  </div>
                ))}
                <Button variant="contained" onClick={addAmenity}>
                  Add Amenity
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
        <Button variant="contained" sx={{ mt: 2 }} onClick={isFormVisible ? handleCreateListing : toggleFormVisibility}>
          {isFormVisible ? 'Confirm New Listing' : 'Create Listing'}
        </Button>
      </Box>
    </>
  );
}

export default HostListingsPage;
