import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, Grid } from '@mui/material';

const ListingCard = ({ listing }) => {
  return (
    <Link to={`/selectedListing/${listing.id}`} key={listing.id}>
      <Card>
        <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <img src={listing.thumbnail} alt="Thumbnail for listing on Airbrb" style={{ maxWidth: '100%' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{listing.title}</Typography>
          </Grid>
          <Grid item xs={12}>
          <Typography variant="body1">{listing.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">Price (per night):</Typography>
            <Typography variant="body2">{listing.price}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">Owner:</Typography>
            <Typography variant="body2">{listing.owner}</Typography>
          </Grid>
        </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListingCard;
