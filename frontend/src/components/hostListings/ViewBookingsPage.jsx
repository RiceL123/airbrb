import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiCall, formatDate } from '../../helpers';

import { Alert, Typography, Grid, Card, CardContent, Box } from '@mui/material';

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
      setListings(filteredListings);
    } else {
      console.error('Getting all listings failed.');
    }
  }

  useEffect(() => {
    getListings();
    getAllBookings();
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
              {myBookings
                .filter((booking) => parseInt(booking.listingId) === listing.id)
                .map((booking) => (
                  <Card key={booking.id} sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          <div>
                            <Typography variant="caption">Booking ID: {booking.id}</Typography>
                          </div>
                          <div>
                            <Typography variant="caption">Booking Owner: {booking.owner}</Typography>
                          </div>
                          <div>
                            <Typography variant="caption">Booking Dates: {formatDate(booking.dateRange.startDate)} - {formatDate(booking.dateRange.endDate)}</Typography>
                          </div>
                          <Alert severity="info">Status: {booking.status}</Alert>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewBookingsPage;
