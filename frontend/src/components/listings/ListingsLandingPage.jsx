import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiCall } from '../../helpers';

import { Typography, Grid } from '@mui/material';
import { Box } from '@mui/system';

import ListingCard from './ListingCard';
import SearchBar from './SearchBar';

const ListingsLandingPage = () => {
  const { authEmail, authToken } = useAuth();
  const [listings, setListings] = useState([]);
  // const [filteredListings, setFilteredListings] = useState(listings);

  useEffect(() => {
    const getListings = async () => {
      const response = await apiCall('GET', authToken, '/listings', undefined);
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings);
        console.log(data);
      } else {
        console.error('Getting all listings failed.');
      }
    }

    getListings();
  }, []);

  const handleSearch = (searchText) => {
    // Handle
    console.log(searchText);
  }

  return (
    <>
      <Box section="section" sx={{ p: 1, m: 1 }}>
        <Typography variant="h2">
          airbrb
        </Typography>
        <Typography variant="body1">Hey {!authEmail && !authToken ? 'Guest User' : authEmail}!</Typography>
      </Box>
      <Box section="section" sx={{ p: 1, m: 1 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      <Box section="section" sx={{ p: 1, m: 1 }}>
        <Grid container spacing={1}>
          {Array.isArray(listings) && listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <ListingCard listing={listing} key={listing.id} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default ListingsLandingPage;
