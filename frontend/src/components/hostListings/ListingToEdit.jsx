import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { apiCall, fileToDataUrl } from '../../helpers';
import ImageCarousel from '../listings/ImageCarousel';
import PropertyTypeSelect from './listingProperties/PropertyTypeSelect';
import AddressFields from './listingProperties/AddressFields';
import NumberField from './listingProperties/NumberField';
import AmenitiesFields from './listingProperties/AmenitiesFields';
import BedroomFields from './listingProperties/BedroomFields';
import PublishListing from './PublishListing';
import ImageOrYTLinkUpload from './listingProperties/ImageOrYTLink';

const ListingToEdit = ({ listingInfo }) => {
  const { authToken } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

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
    setPayload({ title, address, price, thumbnail, metadata });
    console.log(payload);
  }, [title, address, price, thumbnail, metadata]);

  useEffect(() => {
    setMetadata({ propertyType, bedrooms, numberBathrooms, amenities, images })
  }, [propertyType, bedrooms, numberBathrooms, amenities, images])

  const handleChange = (e, output) => {
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
      case 'thumbnail': setThumbnail(output); break;
      case 'youtubeVideoLink': setThumbnail(output); break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    apiCall('PUT', authToken, `/listings/${id}`, payload)
      .then(() => { setEditSuccess(true); setTimeout(() => setEditSuccess(false), 2000) })
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

  const addBedroom = () => {
    setBedrooms([...bedrooms, { name: '', beds: 0 }]);
  }

  const deleteBedroom = (index) => {
    const updatedBedrooms = [...bedrooms];
    updatedBedrooms.splice(index, 1);
    setBedrooms(updatedBedrooms);
  }

  const handleBedroomChange = (event, index) => {
    const { name, value } = event.target;
    const updatedAmenities = [...bedrooms];
    updatedAmenities[index][name] = value;
    setBedrooms(updatedAmenities);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Box component="form" sx={{ p: 1, m: 1 }}>
            <Stack direction='row' justifyContent="space-between">
              <Typography variant="h4">Editing</Typography>
              <Button
                variant='outlined'
                endIcon={<KeyboardArrowDownIcon />}
                onClick={() => window.scrollTo(0, document.body.scrollHeight)}
                sx={{ display: { sm: 'none' } }}>
                Publish
              </Button>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="title"
                  defaultValue={listingInfo.title}
                  onChange={handleChange}
                  fullWidth
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
                <ImageOrYTLinkUpload thumbnail={thumbnail} onChange={handleChange} />
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
              <Grid item xs={6}>
                <AmenitiesFields
                  amenities={amenities}
                  handleAmenityChange={handleAmenityChange}
                  addAmenity={addAmenity}
                  deleteAmenity={deleteAmenity}
                />
              </Grid>
              <Grid item xs={6}>
                <BedroomFields
                  bedrooms={bedrooms}
                  handleBedroomChange={handleBedroomChange}
                  addBedroom={addBedroom}
                  deleteBedroom={deleteBedroom}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="contained" onClick={handleSubmit} endIcon={editSuccess ? <DoneIcon /> : null}>Submit</Button>
                <Button variant="contained" onClick={() => navigate('/hosted')}>Cancel</Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 1, mt: 1 }}>
            <PublishListing id={id} availability={availability} setAvailability={setAvailability} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ListingToEdit;
