import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiCall } from '../../helpers';

import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import ListingCard from './ListingCard';
import SearchBar from './SearchBar';

const ListingsLandingPage = () => {
  const { authEmail, authToken } = useAuth();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState(listings);

  useEffect(() => {
    const getListings = async () => {
      const response = await apiCall('GET', authToken, '/listings', undefined);
      if (response.ok) {
        const data = await response.json();
        setListings(data);
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
      <Box section="section" sx={{ p: 2, m: 1 }}>
        <Typography variant="h2">
          airbrb
        </Typography>
        <Typography variant="body1">Hey {!authEmail && !authToken ? 'Guest User' : authEmail}!</Typography>
      </Box>
      <Box section="section" sx={{ p: 2, m: 1 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      <Box section="section" sx={{ p: 2, m: 1 }}>
        {Array.isArray(listings) && listings.map((listing) => (
          <ListingCard listing={listing} key={listing.id} />
        ))}
      </Box>
    </>
  );
}

export default ListingsLandingPage;
