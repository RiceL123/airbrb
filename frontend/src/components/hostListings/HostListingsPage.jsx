import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Typography, Grid, Button } from '@mui/material';
import { Box } from '@mui/system';

import { useAuth } from '../auth/AuthContext';
import ListingCard from '../listings/ListingCard';
import CreateListing from './CreateListing';
import ListingProfits from './ListingProfits';
import { apiCall } from '../../helpers';

const HostListingsPage = () => {
  const { authEmail, authToken } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);

  const getListings = async () => {
    const response = await apiCall('GET', authToken, '/listings', undefined);
    if (response.ok) {
      const data = await response.json();
      setListings(data.listings);
    } else {
      console.error('Getting all listings failed.');
    }
  }

  const getBookings = async () => {
    const response = await apiCall('GET', authToken, '/bookings', undefined);
    if (response.ok) {
      const data = await response.json();
      setBookings(data.bookings);
    } else {
      console.error('Getting all bookings failed.');
    }
  }

  useEffect(() => {
    if (!authToken) return;
    getListings();
    getBookings();
  }, [authToken]);

  const handleEdit = (listingId) => () => {
    navigate(`/hosted/${listingId}/edit`);
  }

  const handleUnPublish = (listingId) => async () => {
    const response = await apiCall('PUT', authToken, `/listings/unpublish/${listingId}`);
    if (response.ok) getListings();
    else alert('Error occurred while unpublishing listing.');
  }

  const handleDelete = (listingId) => async () => {
    const response = await apiCall('DELETE', authToken, `/listings/${listingId}`);
    if (response.ok) getListings();
    else alert('Error could not delete listing');
  }

  const HostListingCard = ({ listings, published }) => {
    return listings.map(listing => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
        <ListingCard listing={listing} key={listing.id} />
        {published
          ? (<>
            <Button variant="contained" onClick={handleEdit(listing.id)}>Edit</Button>
            <Button variant="contained" onClick={handleUnPublish(listing.id)}>unPublish</Button>
          </>)
          : <Button variant="contained" onClick={handleEdit(listing.id)}>Edit / Publish</Button>}
        <Button color='error' variant="outlined" onClick={handleDelete(listing.id)}>Delete</Button>
      </Grid>
    ))
  }

  return (
    <>
      <Box section="section" sx={{ p: 1, m: 1 }}>
        {!authEmail && !authToken
          ? <Typography variant="h6">To view your listings, please <Link to='/login'>Login</Link></Typography>
          : (<>
            <ListingProfits listings={listings.filter(x => x.owner === authEmail)} bookings={bookings}/>
            <CreateListing reloadListings={getListings}/>
            <Typography variant="h2">Listings for {authEmail}.</Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>Published Listings</Typography>
            {listings.filter(x => x.owner === authEmail && x.published).length === 0
              ? (<Typography variant="body2">No published listings</Typography>)
              : (<Grid container spacing={1}>
                <HostListingCard listings={listings.filter(x => x.owner === authEmail && x.published)} published={true} />
              </Grid>)}
            <Typography variant="h4" sx={{ mb: 1 }}>Unpublished Listings</Typography>
            {listings.filter(x => x.owner === authEmail && !x.published).length === 0
              ? (<Typography variant='body2'>No unpublished listings</Typography>)
              : (<Grid container spacing={1}>
                <HostListingCard listings={listings.filter(x => x.owner === authEmail && !x.published)} published={false} />
              </Grid>)}
          </>)
        }
      </Box>
    </>
  );
}

export default HostListingsPage;
