import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Alert, TextField, Box, MenuItem, Input, Typography, Button, CardMedia, Card, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DEFAULT_CARD_IMG } from '../listings/ListingCard';
import { apiCall, fileToDataUrl } from '../../helpers';
import ImageCarousel from '../listings/ImageCarousel';
import AvailabiltyList from './AvailabiltyList';

const ListingToEdit = ({ listingInfo }) => {
  const { authToken } = useAuth();
  const { id } = useParams();
  const body = {}

  const [title, setTitle] = useState(listingInfo.title);
  const [address, setAddress] = useState(listingInfo.address);
  const [price, setPrice] = useState(listingInfo.price);
  const [thumbnail, setThumbnail] = useState(listingInfo.thumbnail || DEFAULT_CARD_IMG);
  const [listingImages, setListingImages] = useState((listingInfo.metadata.images).map(obj => Object.entries(obj)[0]));
  const [availability, setAvailability] = useState(listingInfo.availability);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
    console.log(Array.from(e.target.files));
    const selectedImages = e.target.files;
    const imagesCopy = [...listingInfo.metadata.images];

    const processImages = Array.from(selectedImages).map((file) => {
      return fileToDataUrl(file)
        .then((fileUrl) => {
          imagesCopy.push({ title: file.name, imageUrl: fileUrl });
        })
        .catch(() => alert('Invalid image'));
    });

    // Double check this works... you'd need to PUT req rather than edit setListingInfo
    Promise.all(processImages)
      .then(() => {
        setListingImages(imagesCopy);
      });
  };

  const publishListingRequest = async () => {
    console.log(availability);
    const newAvailability = availability.slice(); // make a copy
    newAvailability.push({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    });
    console.log(newAvailability);

    const response = await apiCall('PUT', authToken, '/listings/publish/' + id, { availability: newAvailability });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      alert('Published!');
      setAvailability(newAvailability);
    } else {
      alert('Error occurred while publishing liting.');
    }
  }

  const publishListing = () => {
    if (startDate && endDate) {
      if (startDate < endDate) {
        publishListingRequest()
          .catch((error) => {
            console.log(error);
          });
      } else {
        alert('Start date must be before end date');
      }
    } else {
      alert('Please select both startDate and endDate.');
    }
  }

  const unPublishListing = async () => {
    const response = await apiCall('PUT', authToken, `/listings/unpublish/${id}`);
    if (response.ok) setAvailability([]);
    else alert('Error occurred while unpublishing listing.');
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box component="form" sx={{ p: 1, m: 1 }}>
            <Typography variant="h6">Editing</Typography>
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
        </Grid>

        <Grid item xs={4}>
          {availability.length >= 1
            ? (<Box>
              <Typography variant="h6">Current Availabilities</Typography>
              <AvailabiltyList availabilites={availability} />
              <Button variant="outlined" onClick={unPublishListing}>unPublish</Button>
            </Box>)
            : (<Box section="section" sx={{ p: 1, m: 1 }}>
              <Typography variant="h6">Publishing</Typography>
              <Alert severity="info">Pick certain dates to make available for guests.</Alert>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Button variant="outlined" onClick={publishListing}>Publish!</Button>
            </Box>)
          }
        </Grid>
      </Grid>
    </>
  );
}

export default ListingToEdit;