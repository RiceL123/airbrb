import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiCall } from '../../helpers';

import { Typography, Grid, Box } from '@mui/material';

const DEFAULT_CARD_IMG = 'https://files.catbox.moe/owobms.png';

const ViewSelectedListingPage = () => {
  const { id } = useParams();
  const { authEmail, authToken } = useAuth();
  const [listingData, setListingData] = useState({
    // listing: {
    //   title: '',
    //   address: {
    //     street: '',
    //     city: '',
    //     state: '',
    //   },
    //   availability: [],
    //   owner: '',
    //   postedOn: null,
    //   price: '',
    //   published: false,
    //   reviews: [],
    //   thumbnail: '',
    //   metadata: {
    //     ownerEmail: '',
    //     propertyType: '',
    //     bedrooms: [],
    //     numberBathrooms: 0,
    //     amenities: [],
    //     images: [],
    //     isLive: false,
    //   },
    // }
  });

  useEffect(() => {
    const getListingInfo = async () => {
      const response = await apiCall('GET', authToken, '/listings/' + id, undefined);
      if (response.ok) {
        const data = await response.json();
        setListingData(data.listing);
        console.log(data.listing, authEmail);
      } else {
        console.error('Getting specific listing data failed.');
      }
    }

    getListingInfo();
  }, [id, authToken]);

  // useEffect(() => {
  //   console.log('Updated listingData:', listingData);
  // }, [listingData]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ height: 200 }}>
            <img
              src={listingData.thumbnail === '' ? DEFAULT_CARD_IMG : listingData.thumbnail}
              alt={`${listingData.id} thumbnail`}
              style={{
                maxWidth: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h6">
            Details for {listingData.title}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                Address: {listingData.address && `${listingData.address.street}, ${listingData.address.city}, ${listingData.address.state}`}
              </Typography>
              <Typography variant="body1">
                Property Type: {listingData.propertyType}
              </Typography>
              <Typography variant="body1">
                Price per night: ${listingData.price}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Rooms and Ammenities
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                Reviews
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">
            Making a booking
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default ViewSelectedListingPage;
