import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Typography, Grid, Button } from '@mui/material';
import { Box } from '@mui/system';
import ListingCard from '../listings/ListingCard';
import CreateListing from './CreateListing';
import { apiCall } from '../../helpers';
import PublishListing from './PublishListing';

const HostListingsPage = () => {
  const { authEmail, authToken } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  const handleEdit = (listingId) => () => {
    console.log(listingId);
    navigate(`/hosted/${listingId}/edit`);
  }

  const handleUnPublish = (listingId) => () => {
    console.log('handle unpublish');
  }

  const handleDelete = (listingId) => () => {
    console.log('delete')
  }

  const HostListingCard = ({ listings, isLive }) => {
    return listings.map(listing => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
        <ListingCard listing={listing} key={listing.id} />
        <Button variant="contained" onClick={handleEdit(listing.id)}>Edit</Button>
        {isLive
          ? <Button variant="contained" onClick={handleUnPublish(listing.id)}>unPublish</Button>
          : <PublishListing availability={listing.availability} listingId={listing.id} />}
        <Button color='error' variant="outlined" onClick={handleDelete(listing.id)}>Delete</Button>
      </Grid>
    ))
  }

  useEffect(() => {
    if (!authToken) return;
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
  }, [authToken]);

  return (
    <>
      <Box section="section" sx={{ p: 1, m: 1 }}>
        {!authEmail && !authToken
          ? <Typography variant="h6">To view your listings, please <Link to='/login'>Login</Link></Typography>
          : (<>
            <CreateListing />
            <Typography variant="h2">Listings for {authEmail}.</Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>Published Listings</Typography>
            {listings.filter(x => x.owner === authEmail && x.isLive).length === 0
              ? (<Typography variant="body2">No published listings</Typography>)
              : (<Grid container spacing={1}>
                <HostListingCard listings={listings.filter(x => x.owner === authEmail && x.isLive)} isLive={true} />
              </Grid>)}
            <Typography variant="h4" sx={{ mb: 1 }}>Unpublished Listings</Typography>
            {listings.filter(x => x.owner === authEmail && !x.isLive).length === 0
              ? (<Typography variant='body2'>No unpublished listings</Typography>)
              : (<Grid container spacing={1}>
                <HostListingCard listings={listings.filter(x => x.owner === authEmail && !x.isLive)} isLive={false} />
              </Grid>)}
          </>)
        }
      </Box>
    </>
  );
}

export default HostListingsPage;
