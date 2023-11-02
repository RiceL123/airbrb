import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { apiCall, fileToDataUrl } from '../../helpers';
import { DEFAULT_CARD_IMG } from '../listings/ListingCard';
import PropertyTypeSelect from './listingProperties/PropertyTypeSelect';
import ThumbnailUpload from './listingProperties/ThumbnailUpload';
import AddressFields from './listingProperties/AddressFields';
import NumberField from './listingProperties/NumberField';
import AmenitiesFields from './listingProperties/AmenitiesFields';
import ImageCarousel from '../listings/ImageCarousel';

const CreateListing = ({ reloadListings }) => {
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
      // Make sure value is a number
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

    if (name === 'numberBathrooms' || name === 'numberBeds') {
      if (/^\d+$/.test(value) || value === '') {
        setListingData({
          ...listingData,
          metadata: {
            ...listingData.metadata,
            [name]: value,
          },
        });
      }
    } else {
      setListingData({
        ...listingData,
        metadata: {
          ...listingData.metadata,
          [name]: value,
        },
      });
    }
  };

  const handleCreateListing = async () => {
    if (!listingData.title) {
      setTitleError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    console.log(listingData);
    const response = await apiCall('POST', authToken, '/listings/new', listingData);
    if (response.ok) {
      resetListingData();
      reloadListings();
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

  const addAmenity = () => {
    const newAmenity = '';
    setListingData({
      ...listingData,
      metadata: {
        ...listingData.metadata,
        amenities: [...listingData.metadata.amenities, newAmenity],
      },
    });
  };

  const deleteAmenity = (index) => {
    const updatedAmenities = [...listingData.metadata.amenities];
    updatedAmenities.splice(index, 1);
    setListingData({
      ...listingData,
      metadata: {
        ...listingData.metadata,
        amenities: updatedAmenities,
      },
    });
  }

  const handleAmenityChange = (event, index) => {
    const { value } = event.target;
    const updatedAmenities = [...listingData.metadata.amenities];
    updatedAmenities[index] = value;
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
    const imageUrls = [];

    const processImages = Array.from(selectedImages).map((file) => {
      return fileToDataUrl(file)
        .then((fileUrl) => imageUrls.push({ title: file.name, imageUrl: fileUrl }))
        .catch(() => alert('Invalid image'));
    });

    // Wait for all promises to resolve
    Promise.all(processImages)
      .then(() => {
        setListingData({
          ...listingData,
          metadata: {
            ...listingData.metadata,
            images: imageUrls,
          },
        });
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
              </Grid>
              <Grid item xs={6}>
                <ThumbnailUpload defaultThumbnail={DEFAULT_CARD_IMG} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={6}>
                <Card
                  sx={{ mb: 2, p: 1 }}>
                  <Typography variant="body1">Listing Images</Typography>
                  {Array.isArray(listingData.metadata.images) && listingData.metadata.images.length > 0
                    ? (<ImageCarousel images={listingData.metadata.images} />)
                    : (<Typography variant="caption">No images available</Typography>)}
                  <Input
                    name="images"
                    type="file"
                    inputProps={{
                      multiple: true,
                    }}
                    onChange={addImages}
                    sx={{ mb: 2 }}
                  />
                </Card>
              </Grid>
              <Grid item xs={12}>
                <AmenitiesFields
                  amenities={listingData.metadata.amenities}
                  handleAmenityChange={handleAmenityChange}
                  addAmenity={addAmenity}
                  deleteAmenity={deleteAmenity}
                />
              </Grid>
            </Grid>
          )}
        </Box>
        <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={isFormVisible ? handleCreateListing : toggleFormVisibility}>
          {isFormVisible ? 'Confirm New Listing' : 'Create Listing'}
        </Button>
        {isFormVisible
          ? <Button color='error' variant="outlined" sx={{ mt: 2 }} onClick={handleCancelCreate}>
            Cancel
          </Button>
          : <></>
        }
      </Box>
    </>
  );
}

export default CreateListing;