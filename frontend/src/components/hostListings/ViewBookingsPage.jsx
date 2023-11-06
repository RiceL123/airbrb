import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiCall, formatDate } from '../../helpers';

import { Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';

const ViewBookingsPage = () => {
  const { authEmail, authToken } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [listings, setListings] = useState([]);

  const getAllBookings = async () => {
    const response = await apiCall('GET', authToken, '/bookings', undefined);
    if (response.ok) {
      const data = await response.json();
      const myBookings = data.bookings;
      setMyBookings(myBookings);

      console.log(myBookings, authEmail);
    } else {
      const data = await response.json();
      console.log(data);
    }
  }

  const getListings = async () => {
    const response = await apiCall('GET', authToken, '/listings', undefined);
    if (response.ok) {
      const data = await response.json();
      // Make sure listing is published
      const filteredListings = data.listings;
      filteredListings.sort((a, b) => a.title.localeCompare(b.title));

      // Iterate through the filteredListings and get detailed data for each listing
      filteredListings.forEach(async (listing) => {
        const listingId = listing.id;
        const response = await apiCall('GET', authToken, '/listings/' + listingId, undefined);
        if (response.ok) {
          const data = await response.json();
          const newListingObj = data.listing;
          newListingObj.id = listingId;
          setListings((prevExtendedListings) => [
            ...prevExtendedListings,
            data.listing,
          ]);
          console.log(listings);
        } else {
          console.error('Getting specific listing data failed.');
        }
      });
    } else {
      console.error('Getting all listings failed.');
    }
  }

  const changeBookingStatus = (status) => {
    console.log(status);
  }

  useEffect(() => {
    getListings();
    getAllBookings();
    setListings([]);
  }, []);

  return (
    <Box section="section" sx={{ p: 1, m: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Your Bookings</Typography>
        </Grid>
        <Grid item xs={12}>
          <div>
            <Typography variant="caption">{myBookings ? null : 'You have no listings with any bookings.'}</Typography>
          </div>
          <div>
            <Typography variant="caption">{authToken === undefined ? 'You aren\'t logged in.' : null}</Typography>
          </div>
        </Grid>

        <Grid item xs={12}>
          {listings.map((listing) => (
            <Card key={listing.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <div>
                  <Typography variant="body1">Listing: {listing.title}</Typography>
                </div>
                <div>
                  <Typography variant="caption">{myBookings.some((booking) => parseInt(booking.listingId) === listing.id) ? null : 'This listing has no bookings.'}</Typography>
                </div>
                <div>
                  {listing.availability.map((a) => (
                    <Typography key={a.startDate} variant="caption">
                      Available: {formatDate(a.startDate)} - {formatDate(a.endDate)}
                    </Typography>
                  ))}
                </div>
                <Box sx={{ borderRadius: 2, p: 1, m: 1 }}>
                  <Grid container spacing={2}>
                    {myBookings
                      .filter((booking) => parseInt(booking.listingId) === listing.id)
                      .map((booking) => (
                      <Grid item xs={6} key={booking.id}>
                        <Card>
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={10}>
                                <div>
                                  <Typography variant="caption">ID: {booking.id}</Typography>
                                </div>
                                <div>
                                  <Typography variant="caption">Owner: {booking.owner}</Typography>
                                </div>
                                <div>
                                  <Typography variant="caption">Dates: {formatDate(booking.dateRange.startDate)} - {formatDate(booking.dateRange.endDate)}</Typography>
                                </div>
                                <div>
                                  <Typography variant="caption">Status: {booking.status} - {formatDate(booking.dateRange.endDate)}</Typography>
                                </div>
                              </Grid>
                              <Grid item xs={2}>
                                <Button variant="outlined" onClick={() => changeBookingStatus('accept')}>✔️</Button>
                                <Button variant="outlined" onClick={() => changeBookingStatus('deny')}>❌</Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewBookingsPage;
