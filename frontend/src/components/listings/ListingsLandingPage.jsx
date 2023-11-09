import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiCall } from '../../helpers';

import { Typography, Grid } from '@mui/material';
import { Box } from '@mui/system';

import ListingCard from './ListingCard';
import SearchBar from './SearchBar';
import SearchContainer from './SearchContainer';

const ListingsLandingPage = () => {
  const { authEmail, authToken } = useAuth();
  const [listings, setListings] = useState([]);
  const [displayListings, setDisplayListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const getAllBookings = async () => {
    const response = await apiCall('GET', authToken, '/bookings', undefined);
    if (response.ok) {
      const data = await response.json();
      const bookings = data.bookings.filter((booking) => booking.owner === authEmail);
      setMyBookings(bookings);
      console.log(myBookings);
      console.log(bookings);
    } else {
      const data = await response.json();
      console.log(data);
    }
  }

  const getListings = async () => {
    const response = await apiCall('GET', authToken, '/listings', undefined);
    if (response.ok) {
      const data = await response.json();

      // Filter listings where published is true
      const filteredListings = data.listings.filter(listing => listing.published === true);

      // Sort the filtered listings alphabetically by title
      filteredListings.sort((a, b) => a.title.localeCompare(b.title));

      // Now we need to put those with bookings first
      const matchedBookings = myBookings.filter(booking => {
        return (booking.status === 'accepted' || booking.status === 'pending') && filteredListings.some(listing => listing.id === parseInt(booking.listingId));
      });
      matchedBookings.sort((a, b) => a.listingId - b.listingId);

      const bookingIndexMap = {};
      matchedBookings.forEach((booking, index) => {
        bookingIndexMap[booking.listingId] = index;
      });

      // Sort listings by booking index or alphabetically if no booking is found
      filteredListings.sort((a, b) => {
        const indexA = bookingIndexMap[a.id];
        const indexB = bookingIndexMap[b.id];

        if (indexA !== undefined && indexB !== undefined) {
          return indexA - indexB;
        } else if (indexA !== undefined) {
          // A < B
          return -1;
        } else if (indexB !== undefined) {
          // A > B
          return 1;
        } else {
          // Alphabetically
          return a.title.localeCompare(b.title);
        }
      });

      setListings(filteredListings);
      setDisplayListings(filteredListings);
      console.log(data);
    } else {
      console.error('Getting all listings failed.');
    }
  }

  useEffect(() => {
    getAllBookings();
    getListings();
  }, []);

  const handleSearch = (searchText) => {
    if (searchText === '' || searchText.length === 0) {
      // Reset to default view with no filtering
      setDisplayListings(listings);
      return;
    }

    searchText = searchText.toLowerCase();
    const listingsCopy = [];
    listings.forEach((listing) => {
      if (listing.title.toLowerCase().includes(searchText) === true || listing.address.city.toLowerCase().includes(searchText) === true) {
        listingsCopy.push(listing);
      }
    });
    setDisplayListings(listingsCopy);

    console.log(listingsCopy);
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
        <SearchContainer />
      </Box>
      <Box section="section" sx={{ p: 1, m: 1 }}>
        <Grid container spacing={1}>
          {Array.isArray(displayListings) && displayListings.map((listing) => (
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
