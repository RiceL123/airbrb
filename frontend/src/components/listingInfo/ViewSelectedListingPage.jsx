import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiCall, formatDate } from '../../helpers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Alert, Typography, Button, Grid, Box, Card, CardContent, List, ListItem, ListItemText, ImageList, ImageListItem, TextField, Rating } from '@mui/material';

import RatingDisplay from '../listings/RatingDisplay';

const DEFAULT_CARD_IMG = 'https://files.catbox.moe/owobms.png';

const ViewSelectedListingPage = () => {
  const { id } = useParams();
  const { authEmail, authToken } = useAuth();
  const [listingData, setListingData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [review, setReview] = useState({
    score: 0,
    comment: '',
  })
  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const sendBookingRequest = async (body) => {
    const response = await apiCall('POST', authToken, '/bookings/new/' + id, body);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      alert('Booking has been sent!');
    } else {
      const data = await response.json();
      console.log(data);
      alert('Error occurred while booking listing.');
    }
  }

  const sendBooking = () => {
    let success = true;
    let timeDifference = 0;
    let daysDifference = 0;
    if (startDate && endDate) {
      if (startDate < endDate) {
        timeDifference = endDate - startDate;
        daysDifference = timeDifference / (1000 * 3600 * 24);
      } else {
        alert('Start date must be before end date');
        success = false;
      }
    } else {
      alert('Please select both startDate and endDate.');
      success = false;
    }

    if (success) {
      if (authEmail !== null && authToken !== null) {
        // Send booking
        const totalPrice = daysDifference * listingData.price;
        // Use shorthand since key and value are same
        const body = {
          dateRange: {
            startDate,
            endDate,
          },
          totalPrice,
        };
        sendBookingRequest(body);
      } else {
        alert('You must be logged in to book.');
      }
    }
  }

  const getAllBookings = async () => {
    const response = await apiCall('GET', authToken, '/bookings', undefined);
    if (response.ok) {
      const data = await response.json();
      setBookings(data.bookings);

      // MyBookings are bookings by the user for this property...
      const myBookings = bookings.filter((booking) => booking.listingId === id && booking.owner === authEmail);
      setMyBookings(myBookings);
    } else {
      const data = await response.json();
      console.log(data);
    }
  }

  const sendReview = async () => {
    getAllBookings();
    const myBooking = bookings.find((booking) => booking.listingId === id && booking.owner === authEmail && booking.status === 'accepted');
    if (myBooking) {
      const bookingId = myBooking.id;
      const body = {
        review: {
          score: review.score,
          name: authEmail,
          bookingId,
          comment: review.comment,
        }
      }
      const response = await apiCall('PUT', authToken, '/listings/' + id + '/review/' + bookingId, body);
      if (!(response.ok)) {
        alert('Error occurred while leaving review.');
      } else {
        getListingInfo();
        setReview({
          score: 0,
          comment: '',
        });
      }
    } else {
      alert('No booking found for this user.');
    }
  }

  const handleReviewInputChange = (event) => {
    const { name, value } = event.target;
    setReview({ ...review, [name]: value });
  }

  const getListingInfo = async () => {
    const response = await apiCall('GET', authToken, '/listings/' + id, undefined);
    if (response.ok) {
      const data = await response.json();
      setListingData(data.listing);
    } else {
      console.error('Getting specific listing data failed.');
    }
  }

  useEffect(() => {
    getListingInfo();
    if (authEmail !== null && authToken !== null) {
      getAllBookings();
    }
  }, [id, authToken]);

  return (
    <Box section="section" sx={{ p: 1, m: 1 }}>
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
          <Typography variant="caption">{listingData.published ? null : 'Property is NOT live. Cannot book.'}</Typography>
          <Typography variant="h6">
            Details for {listingData.title}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="body1">
                    Address: {listingData.address && `${listingData.address.street}, ${listingData.address.city}, ${listingData.address.state}`}
                  </Typography>
                  <Typography variant="body1">
                    Property Type: {listingData.metadata && listingData.metadata.propertyType}
                  </Typography>
                  <Typography variant="body1">
                    Price per night: ${listingData.price}
                  </Typography>
                  <RatingDisplay listing={listingData}/>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">
                Rooms and Ammenities
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {listingData.metadata && listingData.metadata.bedrooms && listingData.metadata.bedrooms.map((bedroom, index) => (
                <Card key={index} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Room {index + 1}</Typography>
                    <Typography variant="body1">Name: {bedroom.name}</Typography>
                    <Typography variant="body1">Beds: {bedroom.beds}</Typography>
                  </CardContent>
                </Card>
              ))}
              <List>
                {listingData.metadata && listingData.metadata.amenities && listingData.metadata.amenities.map((amenity, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`✅ ${amenity.name}`} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">
                Photos
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ImageList rowHeight={160} cols={4}>
              {listingData.metadata && listingData.metadata.images && (listingData.metadata.images).map(obj => Object.entries(obj)[0]).map(([filename, fileUrl]) => (
                <ImageListItem key={filename} cols={1}>
                  <img src={fileUrl} alt={filename} />
                </ImageListItem>
              ))}
              </ImageList>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">
                Reviews
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {listingData.reviews &&
                listingData.reviews
                  .filter((review) => review.status === 'accepted')
                  .map((review, index) => (
                    <Card key={index} sx={{ marginBottom: 2 }}>
                      <CardContent>
                        <Typography variant="h6">Score: {review.score}</Typography>
                        <Typography variant="body1">Name: {review.name}</Typography>
                        <Typography variant="body1">{review.comment}</Typography>
                      </CardContent>
                    </Card>
                  ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Current Bookings</Typography>
            </Grid>
            <Grid item xs={12}>
              {myBookings.map((booking) => (
                <Card key={booking.id} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <div>
                      <Typography variant="caption">Start Date: {formatDate(booking.dateRange.startDate)}</Typography>
                    </div>
                    <div>
                      <Typography variant="caption">End Date: {formatDate(booking.dateRange.endDate)}</Typography>
                    </div>
                    <Alert severity="info">Status: {booking.status}</Alert>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Make a booking</Typography>
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={sendBooking}>Send in booking</Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Leave a review!</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box component="fieldset" borderColor="transparent">
                <Rating
                  name="score"
                  value={review.score}
                  precision={1.0} // Allows half-star ratings
                  onChange={handleReviewInputChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="comment"
                label="Review Comment"
                value={review.comment}
                onChange={handleReviewInputChange}
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={sendReview}>Submit Review</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ViewSelectedListingPage;
