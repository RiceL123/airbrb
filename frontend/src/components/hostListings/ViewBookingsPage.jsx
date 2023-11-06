import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiCall, formatDate } from '../../helpers';

import { Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';

const ViewBookingsPage = () => {
  const { authEmail, authToken } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [listings, setListings] = useState([]);

  const getAllBookings = async () => {
    if (!authEmail && !authToken) {
      return;
    }

    const response = await apiCall('GET', authToken, '/bookings', undefined);
    if (response.ok) {
      const data = await response.json();
      const myBookings = data.bookings;
      setMyBookings(myBookings);
    } else {
      const data = await response.json();
      console.log(data);
    }
  }

  const getListings = async () => {
    const response = await apiCall('GET', authToken, '/listings', undefined);
    if (response.ok) {
      const data = await response.json();

      // Make sure we own these bookings
      const filteredListings = data.listings.filter((listing) => {
        return (listing.owner === authEmail);
      });
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

  const calculateDaysSincePosting = (postedOn) => {
    const now = new Date();
    const postingDate = new Date(postedOn);
    const timeDiff = now - postingDate;
    // milliseconds to days
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return daysDiff;
  }

  const calculateBookedDays = (id) => {
    const thisListingBookings = myBookings.filter((booking) => parseInt(booking.listingId) === id);
    let sum = 0;
    thisListingBookings.forEach((booking) => {
      if (booking.status === 'accepted') {
        const startDate = new Date(booking.dateRange.startDate);
        const endDate = new Date(booking.dateRange.endDate);
        const timeDiff = endDate - startDate;
        // milliseconds to days
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        sum += daysDiff;
      }
    });

    return sum;
  }

  const calculateListingRevenue = (id) => {
    const thisListingBookings = myBookings.filter((booking) => parseInt(booking.listingId) === id);
    let sum = 0;
    thisListingBookings.forEach((booking) => {
      if (booking.status === 'accepted') {
        sum += booking.totalPrice;
      }
    });
    return sum;
  }

  const resetPage = () => {
    setMyBookings([]);
    setListings([]);
    const fetchData = async () => {
      await getListings();
      getAllBookings();
    };
    fetchData();
  }

  const changeBookingStatus = async (status, bookingId) => {
    if (status === 'accept') {
      const response = await apiCall('PUT', authToken, '/bookings/accept/' + bookingId, undefined);
      if (!(response.ok)) {
        const data = await response.json();
        alert(data.error);
      } else {
        resetPage();
        console.log('Accepted!');
      }
    } else {
      const response = await apiCall('PUT', authToken, '/bookings/decline/' + bookingId, undefined);
      if (!(response.ok)) {
        const data = await response.json();
        alert(data.error);
      } else {
        resetPage();
        console.log('Declined!');
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getListings();
      getAllBookings();
    };
    fetchData();
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
            <Typography variant="caption">{listings.length === 0 ? 'You have no listings with any bookings.' : null}</Typography>
          </div>
          <div>
            <Typography variant="caption">{!authToken ? 'You aren\'t logged in.' : null}</Typography>
          </div>
        </Grid>

        <Grid item xs={12}>
          {authToken && listings.map((listing) => (
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
                <div>
                  <Typography variant="caption">⚡ Listing has been online for {calculateDaysSincePosting(listing.postedOn)} days</Typography>
                </div>
                <div>
                  <Typography variant="caption">✍️ Listing has been booked this year for {calculateBookedDays(listing.id)} days</Typography>
                </div>
                <div>
                  <Typography variant="caption">🤑 Listing has revenue of ${calculateListingRevenue(listing.id)}</Typography>
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
                                  <Typography
                                    variant="caption"
                                    style={{
                                      fontWeight: booking.status === 'accepted' || booking.status === 'declined' ? 'bold' : 'normal',
                                      fontStyle: booking.status === 'pending' ? 'italic' : 'normal',
                                    }}
                                  >
                                    Status: {booking.status}
                                  </Typography>
                                </div>
                              </Grid>
                              <Grid item xs={2}>
                                <Button variant="outlined" disabled={booking.status !== 'pending'} onClick={() => changeBookingStatus('accept', booking.id)}>✔️</Button>
                                <Button variant="outlined" disabled={booking.status !== 'pending'} onClick={() => changeBookingStatus('deny', booking.id)}>❌</Button>
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
