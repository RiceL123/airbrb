import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Typography, Grid, Input, Box } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { apiCall, fileToDataUrl } from '../../helpers';
import PropertyTypeSelect from './listingProperties/PropertyTypeSelect';
import ThumbnailUpload from './listingProperties/ThumbnailUpload';
import AddressFields from './listingProperties/AddressFields';
import BedroomFields from './listingProperties/BedroomFields';
import { DEFAULT_CARD_IMG } from '../listings/ListingCard';
import NumberField from './listingProperties/NumberField';

const CreateListing = () => {
  const { authToken } = useAuth();
  const [titleError, setTitleError] = useState(false);

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
      numberBeds: 0,
      amenities: [],
      images: [],
      isLive: false,
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
    if (!listingData.title) {
      setTitleError(true);
      return;
    }
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

  const deleteBedroom = (index) => {
    const updatedBedrooms = [...listingData.metadata.bedrooms];
    updatedBedrooms.splice(index, 1);

    setListingData({
      ...listingData,
      metadata: {
        ...listingData.metadata,
        bedrooms: updatedBedrooms
      },
    });
  }

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
                  error={titleError}
                  name="title"
                  label="Listing Title"
                  value={listingData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <AddressFields
                street={listingData.address.street}
                city={listingData.address.city}
                state={listingData.address.state}
                handleChange={handleInputChangeAddress}
              />
              <Grid item xs={6}>
                <NumberField name='price' label='Price (Nightly)' value={listingData.price} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6}>
                <PropertyTypeSelect value={'entirePlace'} onChange={handleInputChangeMetaData} />
              </Grid>
              <Grid item xs={6}>
                <NumberField name='numberBathrooms' label='Number of Bathrooms' value={listingData.metadata.numberBathrooms} onChange={handleInputChangeMetaData} />
              </Grid>
              <Grid item xs={6}>
                <NumberField name='numberBeds' label='Number of Bedrooms' value={listingData.metadata.numberBeds} onChange={handleInputChangeMetaData} />
                <BedroomFields
                  bedrooms={listingData.metadata.bedrooms}
                  handleBedroomChange={handleBedroomChange}
                  addBedroom={addBedroom}
                  deleteBedroom={deleteBedroom}
                />
              </Grid>
              <Grid item xs={6}>
                <ThumbnailUpload defaultThumbnail={DEFAULT_CARD_IMG} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6}>
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
              <Grid item xs={12}>
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
