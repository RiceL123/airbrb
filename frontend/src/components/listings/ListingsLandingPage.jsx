import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiCall } from '../../helpers';

import { Typography, Grid, Button, TextField, Slider, Select, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ListingCard from './ListingCard';

const ListingsLandingPage = () => {
  const { authEmail, authToken } = useAuth();
  const [listings, setListings] = useState([]);
  const [displayListings, setDisplayListings] = useState([]);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [minBeds, setMinBeds] = useState(0);
  const [maxBeds, setMaxBeds] = useState(25);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [searchMode, setSearchMode] = useState('default');
  const [searchText, setSearchText] = useState('');

  const handleBedsChange = (event, newValue) => {
    setMinBeds(newValue[0]);
    setMaxBeds(newValue[1]);
  };

  const handlePriceChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleRatingSearch = (newValue) => {
    setSearchMode(newValue);
  }

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

      // Grab availability from specific listing data
      for (const listing of filteredListings) {
        const response = await apiCall('GET', authToken, `/listings/${listing.id}`, undefined);
        if (response.ok) {
          const data = await response.json();
          listing.availability = data.listing.availability;
        } else {
          console.error('Getting specific listing failed.');
        }
      }

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

  const isAvailabilityInRange = (availability, startDate, endDate) => {
    return startDate <= availability.endDate && endDate >= availability.startDate;
  };

  const handleSearch = () => {
    console.log(searchText);

    if (searchText === '' || searchText.length === 0) {
      // Reset to default view with no filtering
      setDisplayListings(listings);
    }

    const inputText = searchText.toLowerCase();
    const listingsCopy = [];
    listings.forEach((listing) => {
      // Set filters based on advanced search
      // Name, city filter
      let passes = false;
      if ((searchText !== '') && (listing.title.toLowerCase().includes(inputText) === true || listing.address.city.toLowerCase().includes(inputText) === true)) {
        passes = true;
      }

      if (searchText === '') {
        passes = true;
      }

      // Number of bedrooms filter
      const totalBeds = listing.metadata.bedrooms.reduce((sum, bedroom) => sum + bedroom.beds, 0);
      if (totalBeds < minBeds || totalBeds > maxBeds) {
        passes = false;
      }

      // Date range filter
      if (!listing.availability.some(availability => isAvailabilityInRange(availability, startDate, endDate))) {
        passes = false;
      }

      // Price filter
      if (parseFloat(listing.price) < minPrice || listing.price > maxPrice) {
        passes = false;
      }

      if (passes) {
        listingsCopy.push(listing);
      }
    });
    setDisplayListings(listingsCopy);
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
            <TextField
              label="Search Listings"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
            />
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
                <Grid item xs={3}>
                  <Typography variant="subtitle1">Beds</Typography>
                  <Slider
                    value={[minBeds, maxBeds]}
                    onChange={handleBedsChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => (value === 0 ? 'Any' : value)}
                    max={25}
                  />
                </Grid>
                <Grid item xs={3}>
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
                <Grid item xs={3}>
                  <Typography variant="subtitle1">Price Range</Typography>
                  <Slider
                    value={[minPrice, maxPrice]}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value}`}
                    max={5000}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="subtitle1">Rating Search</Typography>
                  <Select
                    label="Select an Option"
                    value={searchMode}
                    onChange={(event) => handleRatingSearch(event.target.value)}
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
