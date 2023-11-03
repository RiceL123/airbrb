import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, Grid, CardMedia } from '@mui/material';

export const DEFAULT_CARD_IMG = 'https://files.catbox.moe/owobms.png';

const ListingCard = ({ listing }) => {
  return (
    <Link to={`/selectedListing/${listing.id}`} key={listing.id}>
      <Card>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <CardMedia
                component='img'
                image={listing.thumbnail === '' ? DEFAULT_CARD_IMG : listing.thumbnail}
                style={{ maxHeight: '8em' }}
                alt={`${listing.id} thumbnail`}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>{listing.title}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>{listing.address.street + ', ' + listing.address.city + ', ' + listing.address.state}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='caption'>Price (per night):</Typography>
              <Typography variant='body2'>{listing.price}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='caption'>Owner:</Typography>
              <Typography variant='body2'>{listing.owner}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListingCard;
