import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { TextField, Box, MenuItem, Input, Typography, Button, CardMedia, Card, Grid } from '@mui/material';

import { apiCall, fileToDataUrl } from '../../helpers';
import ImageCarousel from '../listings/ImageCarousel';

const ListingToEdit = ({ listingInfo }) => {
  const { authToken } = useAuth();
  const { id } = useParams();
  const body = {}
  console.log(listingInfo);
  // const [title, setTitle] = useState(listingInfo.title);
  const [title, setTitle] = useState(listingInfo.title);
  const [address, setAddress] = useState(listingInfo.address);
  const [price, setPrice] = useState(listingInfo.price);
  const [thumbnail, setThumbnail] = useState(listingInfo.thumbnail);
  const [listingImages, setListingImages] = useState((listingInfo.metadata.images).map(obj => Object.entries(obj)[0]));
  // Note
  /*
  listingInfo.metadata.images = [{filename: url}, {etc}, {etc}...]
  we convert to
  [[filename, url], [filename, url], etc, etc]
  */

  useEffect(() => {
    // Update the body object when title changes
    body.title = title;
    body.address = address;
    body.price = price;
    body.thumbnail = thumbnail;
  }, [title, address, price, thumbnail]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    switch (name) {
      case 'title': setTitle(value); break;
      case 'address': setAddress(value); break;
      case 'price': setPrice(value); break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    apiCall('PUT', authToken, `/listings/${id}`, body)
      .then(() => console.log('nice it was updated i hope'))
      .catch(msg => alert(msg));
  }

  const updateThumbnail = (e) => {
    const thumnailFile = e.target.files[0];
    fileToDataUrl(thumnailFile)
      .then((fileUrl) => setThumbnail(fileUrl))
      .catch(msg => alert(msg));
  }

  const addImages = (e) => {
    const selectedImages = e.target.files;
    const imagesCopy = [...listingInfo.metadata.images];

    const processImages = Array.from(selectedImages).map((file) => {
      return fileToDataUrl(file)
        .then((fileUrl) => {
          imagesCopy.push({ [file.name]: fileUrl });
        })
        .catch(() => alert('Invalid image'));
    });

    // Double check this works... you'd need to PUT req rather than edit setListingInfo
    Promise.all(processImages)
      .then(() => {
        setListingImages(imagesCopy);
      });
  };
  // const [availability, setAvailability] = useState(listingInfo.availability);
  // const handleSumbit = () => {
  //   const res = apiCall('PUT', authToken, `/listingInfos/${id}`, body)
  // }

  return (
    <Box component="form">
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
        <Grid item xs={4}>
          <TextField
          name="address"
          label="Address (Street)"
          defaultValue={listingInfo.address.street}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        </Grid>
        <Grid item xs={4}>
          <TextField
          name="address"
          label="Address (City)"
          defaultValue={listingInfo.address.city}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        </Grid>
        <Grid item xs={4}>
          <TextField
          name="address"
          label="Address (State)"
          defaultValue={listingInfo.address.state}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        </Grid>
        <Grid item xs={12}>
          <TextField
          name="price"
          label="Listing Price (Nightly)"
          value={listingInfo.price}
          onChange={handleChange}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
          sx={{ mb: 2 }}
        />
        </Grid>
        <Grid item xs={12}>
          <Card
          sx={{ mb: 2, p: 1 }}>
          <Typography variant="body1">Thumbnail</Typography>
          <CardMedia
            sx={{ height: 200, width: 200 }}
            image={thumbnail}
          />
          <Input
            name="thumbnail"
            label="Thumbnail"
            type="file"
            onChange={updateThumbnail}
          />
        </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            sx={{ mb: 2, p: 1 }}>
            <Typography variant="body1">Listing Images</Typography>
            {Array.isArray(listingImages) && listingImages.length > 0 ? (<ImageCarousel images={listingImages} />) : (<Typography variant="caption">No images available</Typography>)}
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
          <TextField
          select
          name="propertyType"
          label="Property Type"
          value={'temp'}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          <MenuItem value="temp">backend doesnt store this yet so can&apos;t update it</MenuItem>
          <MenuItem value="entirePlace">Entire Place</MenuItem>
          <MenuItem value="privateRoom">Private Room</MenuItem>
          <MenuItem value="hotelRoom">Hotel Room</MenuItem>
          <MenuItem value="sharedRoom">Shared Room</MenuItem>
        </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
          <Button variant="outlined" onClick={handleSubmit}>Cancel</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ListingToEdit;
