import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiCall } from '../../helpers';

import { Typography, Grid, Button, TextField, Slider, Select, MenuItem } from '@mui/material';
import { Box } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ListingCard from './ListingCard';
import SearchBar from './SearchBar';

const ListingsLandingPage = () => {
  const { authEmail, authToken } = useAuth();
  const [listings, setListings] = useState([]);
  const [displayListings, setDisplayListings] = useState([]);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [maxBedrooms, setMaxBedrooms] = useState(25);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(1);
  const [maxRating, setMaxRating] = useState(5);
  const [searchMode, setSearchMode] = useState('default');

  const handleBedroomsChange = (event, newValue) => {
    setMinBedrooms(newValue[0]);
    setMaxBedrooms(newValue[1]);
    setSearchMode('');
  };

  const handlePriceChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleRatingChange = (event, newValue) => {
    setMinRating(newValue[0]);
    setMaxRating(newValue[1]);
  };

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
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <SearchBar onSearch={handleSearch} />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" onClick={handleSearch}>Search</Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>{(showAdvancedSearch) ? 'Hide Advanced Search' : 'Show Advanced Search'}</Button>
          </Grid>
          <Grid item xs={12}>
          {
            showAdvancedSearch &&
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Typography variant="subtitle1">Bedrooms</Typography>
                  <Slider
                    value={[minBedrooms, maxBedrooms]}
                    onChange={handleBedroomsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => (value === 0 ? 'Any' : value)}
                    max={25}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle1">Score Range</Typography>
                  <Slider
                    value={[minRating, maxRating]}
                    onChange={handleRatingChange}
                    valueLabelDisplay="auto"
                    max={5}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle1">Date Range</Typography>
                  <Grid container spacing={0}>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={(date) => setStartDate(date)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="End Date"
                          value={endDate}
                          onChange={(date) => setEndDate(date)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle1">Price Range</Typography>
                  <Slider
                    value={[minPrice, maxPrice]}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value}`}
                    max={5000}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="subtitle1">Rating Search</Typography>
                  <Select
                    label="Select an Option"
                    value={searchMode}
                    onChange={handlePriceChange} // change this
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="lowToHigh">Ratings low to high</MenuItem>
                    <MenuItem value="highToLow">Ratings high to low</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            }
          </Grid>
        </Grid>
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
