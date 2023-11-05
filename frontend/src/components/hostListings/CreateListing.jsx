import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Typography, MenuItem, Grid, Input, Box } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { apiCall, fileToDataUrl } from '../../helpers';

const CreateListing = () => {
  const { authToken } = useAuth();
  const [listingData, setListingData] = useState({
    title: '',
    address: {
      street: '',
      city: '',
      state: '',
    },
    price: 0.0,
    thumbnail: '',
    metadata: {
      ownerEmail: '',
      propertyType: '',
      bedrooms: [],
      numberBathrooms: 0,
      amenities: [],
      images: [],
      isLive: false,
      bookings: [],
    },
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'price') {
      // Make sure price is a number
      if (/^\d+$/.test(value) || value === '') {
        setListingData({ ...listingData, [name]: value });
      }
    } else if (name === 'thumbnail') {
      // Process images correctly
      fileToDataUrl(event.target.files[0])
        .then((url) => setListingData({ ...listingData, [name]: url }))
        .catch(() => alert('invalid thumbnail image'));
    } else {
      setListingData({ ...listingData, [name]: value });
    }
  };

  const handleInputChangeAddress = (event) => {
    const { name, value } = event.target;
    setListingData({
      ...listingData,
      address: {
        ...listingData.address,
        [name]: value,
      },
    });
  };

  const handleInputChangeMetaData = (event) => {
    const { name, value } = event.target;
    setListingData({
      ...listingData,
      metadata: {
        ...listingData.metadata,
        [name]: value,
      },
    });
  };

  const handleCreateListing = async () => {
    console.log('Pushing data to backend:');
    console.log(listingData);
    const response = await apiCall('POST', authToken, '/listings/new', listingData);
    if (response.ok) {
      resetListingData();
      toggleFormVisibility();
    } else {
      alert(response.statusText);
      console.log(response);
      console.error('Error occured whilst creating listing: ', response.error);
    }
  };

  const handleCancelCreate = () => {
    resetListingData();
    setIsFormVisible(false);
  }

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const addBedroom = () => {
    const newBedroom = { name: '', beds: 0 };
    setListingData({
      ...listingData,
      metadata: {
        ...listingData.metadata,
        bedrooms: [...listingData.metadata.bedrooms, newBedroom],
      },
    });
  };

  const handleBedroomChange = (event, index) => {
    const { name, value } = event.target;
    const updatedBedrooms = [...listingData.metadata.bedrooms];
    updatedBedrooms[index][name] = value;
    setListingData({
      ...listingData,
      metadata: {
        ...listingData.metadata,
        bedrooms: updatedBedrooms,
      },
    });
  };

  const addAmenity = () => {
    const newAmenity = { name: '' };
    setListingData({
      ...listingData,
      metadata: {
        ...listingData.metadata,
        amenities: [...listingData.metadata.amenities, newAmenity],
      },
    });
  };

  const handleAmenityChange = (event, index) => {
    const { name, value } = event.target;
    const updatedAmenities = [...listingData.metadata.amenities];
    updatedAmenities[index][name] = value;
    setListingData({
      ...listingData,
      metadata: {
        ...listingData.metadata,
        amenities: updatedAmenities,
      },
    });
  };

  const addImages = (event) => {
    const selectedImages = event.target.files;

    // Create an array of promises to process the selected images
    const processImages = Array.from(selectedImages).map((file) => {
      return fileToDataUrl(file)
        .then((fileUrl) => {
          // Update state
          setListingData((prevData) => ({
            ...prevData,
            metadata: {
              ...prevData.metadata,
              images: [
                ...(prevData.metadata.images || []),
                { [file.name]: fileUrl },
              ],
            },
          }));
        })
        .catch(() => {
          alert('Invalid image');
        });
    });

    // Wait for all promises to resolve
    Promise.all(processImages)
      .then(() => {
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const resetListingData = () => {
    setListingData({
      title: '',
      address: {
        street: '',
        city: '',
        state: '',
      },
      price: 0.0,
      thumbnail: '',
      metadata: {
        ownerEmail: '',
        propertyType: '',
        bedrooms: [],
        numberBathrooms: 0,
        amenities: [],
        images: [],
        isLive: false,
      },
    });
  };

  return (
    <>
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
              <Grid item xs={4}>
                <TextField
                  name="street"
                  label="Listing Street Address"
                  value={listingData.address.street}
                  onChange={handleInputChangeAddress}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="city"
                  label="Listing Address City"
                  value={listingData.address.city}
                  onChange={handleInputChangeAddress}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="state"
                  label="Listing Address State"
                  value={listingData.address.state}
                  onChange={handleInputChangeAddress}
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
                  defaultValue='entirePlace'
                  onChange={handleInputChangeMetaData}
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
                  inputProps={{
                    multiple: true
                  }}
                  onChange={addImages}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="numberBathrooms"
                  label="Number of bathrooms"
                  value={listingData.numberBathrooms}
                  onChange={handleInputChangeMetaData}
                  fullWidth
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                {listingData.metadata.bedrooms.map((bedroom, index) => (
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
                {listingData.metadata.amenities.map((amenity, index) => (
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
        {isFormVisible
          ? <Button variant="contained" sx={{ mt: 2 }} onClick={handleCancelCreate}>
            Cancel
          </Button>
          : <></>
        }
      </Box>
    </>
  );
}

export default CreateListing;
