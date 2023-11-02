import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Alert, TextField, Box, Input, Typography, Button, Card, Grid } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DEFAULT_CARD_IMG } from '../listings/ListingCard';
import { apiCall, fileToDataUrl } from '../../helpers';
import ImageCarousel from '../listings/ImageCarousel';
import AvailabiltyList from './AvailabiltyList';
import PropertyTypeSelect from './listingProperties/PropertyTypeSelect';
import ThumbnailUpload from './listingProperties/ThumbnailUpload';
import AddressFields from './listingProperties/AddressFields';
import NumberField from './listingProperties/NumberField';

const ListingToEdit = ({ listingInfo }) => {
  const { authToken } = useAuth();
  const { id } = useParams();

  const [editSuccess, setEditSuccess] = useState(false);

  const [title, setTitle] = useState(listingInfo.title);
  const [address, setAddress] = useState(listingInfo.address);
  const [price, setPrice] = useState(listingInfo.price);
  const [thumbnail, setThumbnail] = useState(listingInfo.thumbnail || DEFAULT_CARD_IMG);

  const [metadata, setMetadata] = useState(listingInfo.metadata);
  const [propertyType, setPropertyType] = useState(listingInfo.metadata.propertyType);
  const [numberBeds, setNumberBeds] = useState(listingInfo.metadata.numberBeds);
  const [numberBathrooms, setNumberBathrooms] = useState(listingInfo.metadata.numberBathrooms);
  const [bedrooms, setBedrooms] = useState(listingInfo.metadata.bedrooms);
  const [amenities, setAmenities] = useState(listingInfo.metadata.amenities);
  const [images, setImages] = useState(listingInfo.metadata.images);
  const [availability, setAvailability] = useState(listingInfo.availability);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
      case 'price': setPrice(value); console.log(price); break;
      case 'propertyType': setPropertyType(value); break;
      case 'bedrooms': setBedrooms(value); break;
      case 'numberBathrooms': setNumberBathrooms(value); break;
      case 'amenities': setAmenities(value); break;
      case 'numberBeds': setNumberBeds(value); break;
    }
    console.log(name, value);
    console.log(payload);
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
        setImages(imagesCopy);
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
              <AddressFields
                street={address.street}
                city={address.city}
                state={address.state}
                handleChange={handleChange}
              />
              <Grid item xs={12}>
                <NumberField name='price' label='Price (Nightly)' value={price} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <NumberField name='numberBathrooms' label='Number of Bathrooms' value={numberBathrooms} onChange={handleChange} />
              </Grid>
              <Grid item xs={6}>
                <NumberField name='numberBeds' label='Number of Bedrooms' value={numberBeds} onChange={handleChange} />
                <NumberField name='numberBathrooms' label='Number of Bathrooms' value={numberBathrooms} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <ThumbnailUpload defaultThumbnail={thumbnail} onChange={updateThumbnail} />
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
                <PropertyTypeSelect value={propertyType} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={handleSubmit}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} endIcon={editSuccess ? <DoneIcon /> : null}>Submit</Button>
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
