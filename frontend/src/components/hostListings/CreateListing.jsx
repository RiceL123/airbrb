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
import PropertyTypeSelect from './listingProperties/PropertyTypeSelect';
import AddressFields from './listingProperties/AddressFields';
import NumberField from './listingProperties/NumberField';
import AmenitiesFields from './listingProperties/AmenitiesFields';
import BedroomFields from './listingProperties/BedroomFields';
import ImageCarousel from '../listings/ImageCarousel';
import ImageOrYTLinkUpload from './listingProperties/ImageOrYTLink';
import UploadJSON from './listingProperties/UploadJSON';

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
    thumbnail: { isYoutubeVideoId: false, src: '' },
    metadata: {
      propertyType: '',
      bedrooms: [],
      numberBathrooms: 0,
      numberBeds: 0,
      amenities: [],
      images: [],
      isLive: false,
      bookings: [],
    },
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (event, output) => {
    console.log(listingData);
    const { name, value } = event.target;
    if (name === 'price') {
      // Make sure value is a number
      if (/^\d+$/.test(value) || value === '') {
        setListingData({ ...listingData, [name]: value });
      }
    } else if (name === 'thumbnail') {
      // Assumes image has been processed and value is in output
      setListingData({ ...listingData, [name]: output });
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

  const handleJSONFile = (e, listingUploaded) => {
    console.log(listingUploaded);
    setListingData({
      ...listingUploaded,
    });

    // for (const addressField in ['street', 'city', 'state']) {
    //   handleInputChangeAddress({
    //     target: {
    //       name: addressField,
    //       value: listingUploaded.address[addressField]
    //     }
    //   })
    // }
  }

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

  const deleteBedroom = (index) => {
    const updatedBedrooms = [...listingData.metadata.bedrooms];
    updatedBedrooms.splice(index, 1);
    setListingData({
      ...listingData,
      metadata: {
        ...listingData.metadata,
        bedrooms: updatedBedrooms,
      },
    });
  }

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
      .catch(() => alert('Please ensure all images are png, jpg or jpeg'))
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
                <ImageOrYTLinkUpload thumbnail={listingData.thumbnail} onChange={handleInputChange} />
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
              <Grid item xs={6}>
                <AmenitiesFields
                  amenities={listingData.metadata.amenities}
                  handleAmenityChange={handleAmenityChange}
                  addAmenity={addAmenity}
                  deleteAmenity={deleteAmenity}
                />
              </Grid>
              <Grid item xs={6}>
                <BedroomFields
                  bedrooms={listingData.metadata.bedrooms}
                  handleBedroomChange={handleBedroomChange}
                  addBedroom={addBedroom}
                  deleteBedroom={deleteBedroom}
                />
              </Grid>
            </Grid>
          )}
        </Box>
        <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={isFormVisible ? handleCreateListing : toggleFormVisibility}>
          {isFormVisible ? 'Confirm New Listing' : 'Create Listing'}
        </Button>
        {isFormVisible
          ? <span style={{ marginTop: 2 }}>
            <Button color='error' variant="outlined" onClick={handleCancelCreate}>
              Cancel
            </Button>
            <UploadJSON handleJSONFile={handleJSONFile} />
          </span>
          : <></>
        }
      </Box>
    </>
  );
}

export default CreateListing;
