import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Typography, Grid, Button } from '@mui/material';
import { Box } from '@mui/system';
import ListingCard from '../listings/ListingCard';
import CreateListing from './CreateListing';
import { apiCall } from '../../helpers';

const HostListingsPage = () => {
  const { authEmail, authToken } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  const handleEdit = (listingId) => () => {
    console.log(listingId);
    navigate(`/hosted/${listingId}/edit`);
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
            <Typography variant="h6">Here are your hosted properties, {authEmail}.</Typography>
            <Grid container spacing={1}>
              {Array.isArray(listings) && listings.filter(x => x.owner === authEmail).map((listing) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
                  <ListingCard listing={listing} key={listing.id} />
                  <Button variant="contained" onClick={handleEdit(listing.id)}>Edit</Button>
                </Grid>
              ))}
            </Grid>
          </>)
        }
      </Box>
    </>
  );
}

export default HostListingsPage;
