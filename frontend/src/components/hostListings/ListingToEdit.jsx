import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { TextField, Box, Input, Typography, Button, Card, Grid } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { DEFAULT_CARD_IMG } from '../listings/ListingCard';
import { apiCall, fileToDataUrl } from '../../helpers';
import ImageCarousel from '../listings/ImageCarousel';
import PropertyTypeSelect from './listingProperties/PropertyTypeSelect';
import ThumbnailUpload from './listingProperties/ThumbnailUpload';
import AddressFields from './listingProperties/AddressFields';
import NumberField from './listingProperties/NumberField';
import AmenitiesFields from './listingProperties/AmenitiesFields';
import PublishListing from './PublishListing';

const ListingToEdit = ({ listingInfo }) => {
  const { authToken } = useAuth();
  const { id } = useParams();

  const [editSuccess, setEditSuccess] = useState(false);

  const [title, setTitle] = useState(listingInfo.title);
  const [address, setAddress] = useState(listingInfo.address);
  const [price, setPrice] = useState(listingInfo.price);
  const [thumbnail, setThumbnail] = useState(listingInfo.thumbnail);
  const [availability, setAvailability] = useState(listingInfo.availability);

  const [metadata, setMetadata] = useState(listingInfo.metadata);
  const [propertyType, setPropertyType] = useState(listingInfo.metadata.propertyType);
  const [numberBeds, setNumberBeds] = useState(listingInfo.metadata.numberBeds);
  const [numberBathrooms, setNumberBathrooms] = useState(listingInfo.metadata.numberBathrooms);
  const [bedrooms, setBedrooms] = useState(listingInfo.metadata.bedrooms);
  const [amenities, setAmenities] = useState(listingInfo.metadata.amenities);
  const [images, setImages] = useState(listingInfo.metadata.images);

  const [payload, setPayload] = useState({
    title: listingInfo.title,
    address: listingInfo.address,
    price: listingInfo.price,
    thumbnail: listingInfo.thumbnail,
    metadata: listingInfo.metadata
  })

  useEffect(() => {
    setPayload({ title, address, price, thumbnail, metadata })
  }, [title, address, price, thumbnail, metadata]);

  useEffect(() => {
    setMetadata({ propertyType, bedrooms, numberBathrooms, amenities, images })
  }, [propertyType, bedrooms, numberBathrooms, amenities, images])

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    switch (name) {
      case 'title': setTitle(value); break;
      case 'street': setAddress({ ...address, street: value }); break;
      case 'city': setAddress({ ...address, city: value }); break;
      case 'state': setAddress({ ...address, state: value }); break;
      case 'price': if (/^\d+$/.test(value) || value === '') setPrice(value); break;
      case 'propertyType': setPropertyType(value); break;
      case 'bedrooms': setBedrooms(value); break;
      case 'numberBathrooms': if (/^\d+$/.test(value) || value === '') setNumberBathrooms(value); break;
      case 'numberBeds': if (/^\d+$/.test(value) || value === '') setNumberBeds(value); break;
      // case 'amenities': setAmenities(value); break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    apiCall('PUT', authToken, `/listings/${id}`, payload)
      .then(() => { setEditSuccess(true); setTimeout(() => setEditSuccess(false), 2000) })
      .catch(msg => alert(msg));
  }

  const updateThumbnail = (e) => {
    const thumnailFile = e.target.files[0];
    fileToDataUrl(thumnailFile)
      .then((fileUrl) => setThumbnail(fileUrl))
      .catch(msg => alert(msg));
  }

  const addImages = (e) => {
    console.log(Array.from(e.target.files));
    const selectedImages = e.target.files;
    // const imagesCopy = [...listingInfo.metadata.images]; // instead of appended just reset
    const imagesCopy = [];

    const processImages = Array.from(selectedImages).map((file) => {
      return fileToDataUrl(file)
        .then((fileUrl) => {
          imagesCopy.push({ title: file.name, imageUrl: fileUrl });
        })
    });

    // Double check this works... you'd need to PUT req rather than edit setListingInfo
    Promise.all(processImages)
      .then(() => {
        setImages(imagesCopy);
      })
      .catch(() => alert('please ensure all images are png or jpg'))
  };

  const addAmenity = () => {
    setAmenities([...amenities, '']);
  }

  const deleteAmenity = (index) => {
    const updatedAmenities = [...amenities];
    updatedAmenities.splice(index, 1);
    setAmenities(updatedAmenities);
  }

  const handleAmenityChange = (event, index) => {
    const { value } = event.target;
    const updatedAmenities = [...amenities];
    updatedAmenities[index] = value;
    setAmenities(updatedAmenities);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box component="form" sx={{ p: 1, m: 1 }}>
            <Typography variant="h4">Editing</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="title"
                  defaultValue={listingInfo.title}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <AddressFields
                street={address.street}
                city={address.city}
                state={address.state}
                handleChange={handleChange}
              />
              <Grid item xs={12} md={6}>
                <NumberField name='price' label='Price (Nightly)' value={price} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <PropertyTypeSelect value={propertyType} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberField name='numberBathrooms' label='Number of Bathrooms' value={numberBathrooms} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <NumberField name='numberBeds' label='Number of Bedrooms' value={numberBeds} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <ThumbnailUpload defaultThumbnail={thumbnail || DEFAULT_CARD_IMG} onChange={updateThumbnail} />
              </Grid>
              <Grid item xs={12}>
                <Card
                  sx={{ mb: 2, p: 1 }}>
                  <Typography variant="body1">Listing Images</Typography>
                  {Array.isArray(images) && images.length > 0 ? (<ImageCarousel images={images} />) : (<Typography variant="caption">No images available</Typography>)}
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
                  amenities={amenities}
                  handleAmenityChange={handleAmenityChange}
                  addAmenity={addAmenity}
                  deleteAmenity={deleteAmenity}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="outlined" onClick={handleSubmit}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} endIcon={editSuccess ? <DoneIcon /> : null}>Submit</Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <PublishListing id={id} availability={availability} setAvailability={setAvailability} />
        </Grid>
      </Grid>
    </>
  );
}

export default ListingToEdit;
