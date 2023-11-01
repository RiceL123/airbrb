import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { TextField, Box, MenuItem, Input, Typography, Button, CardMedia, Card } from '@mui/material';

import { apiCall, fileToDataUrl } from '../../helpers';
import ImageCarousel from '../listings/ImageCarousel';

const ListingToEdit = ({ listingInfo }) => {
  const { authToken } = useAuth();
  const { id } = useParams();
  const body = {}
  console.log(listingInfo);
  // const [title, setTitle] = useState(listingInfo.title);
  const [title, setTitle] = useState(listingInfo.title);

  useEffect(() => {
    // Update the body object when title changes
    body.title = title;
    console.log(body);
  }, [title]);

  const handleChange = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    apiCall('PUT', authToken, `/listings/${id}`, body)
      .then(() => console.log('nice it was updated i hope'))
      .catch(msg => alert(msg));
  }

  const addImages = (e) => {
    // should render all the images in listingInfo images and give options to delete
    console.log(listingInfo.images);
    const images = [...listingInfo.images];

    const processImages = Array.from(e.target.files).map(file => {
      return fileToDataUrl(file)
        .then((fileUrl) => images.push({ [file.name]: fileUrl }))
        .catch(() => alert('invalid image'));
    })

    Promise.all(processImages)
      .then(() => { console.log(images); body.images = images });
  };
  // const [address, setAddress] = useState(listingInfo.address);
  // const [availability, setAvailability] = useState(listingInfo.availability);
  // const [price, setPrice] = useState(listingInfo.price);
  // const [thumbnail, setThumbnail] = useState(listingInfo.thumbnail);
  // const handleSumbit = () => {
  //   const res = apiCall('PUT', authToken, `/listingInfos/${id}`, body)
  // }

  return (
    <Box
      component="form"
    >
      <TextField
        name="title"
        label="title"
        defaultValue={listingInfo.title}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        name="address"
        label="address"
        defaultValue={listingInfo.address}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        name="price"
        label="Listing Price (Nightly)"
        value={listingInfo.price}
        onChange={handleChange}
        inputProps={{
          inputMode: 'numeric',
          pattern: '[1-9]?[0-9]*',
        }}
        sx={{ mb: 2 }}
      />
      <Card
        sx={{ mb: 2, p: 1 }}>
        <Typography variant="body1">Thumbnail</Typography>
        <CardMedia
          sx={{ height: 100 }}
          image="https://srv.carbonads.net/static/30242/41207b597f9a178f8ca65b0efc2d61b405740e0a"
        />
        <Input
          name="thumbnail"
          label="Thumbnail"
          type="file"

          onChange={handleChange}
        />
      </Card>
      <Card
        sx={{ mb: 2, p: 1 }}>
        <Typography variant="body1">Images</Typography>
        <ImageCarousel images={[
          ['filename1', 'https://www.gravatar.com/avatar/e3d7466e265aa297eca4ccb0bfb5535b?s=64&d=identicon&r=PG&f=y&so-version=2'],
          ['file2', 'https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e'],
          ['file3', 'https://yt3.ggpht.com/THjDU20XPxsKUXP6oD1mqHMcd2946Qcb-QDlfaz6wLmnspenqcVraq6HIAMcxN6fweqXQynPeA=s600-c-k-c0x00ffffff-no-rj-rp-mo']
        ]} />
        <Input
          name="images"
          type="file"
          inputProps={{
            multiple: true
          }}
          onChange={addImages}
          sx={{ mb: 2 }}
        />
      </Card>
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
      <Button onClick={handleSubmit}>Submit</Button>
    </Box>
  );
}

export default ListingToEdit;
