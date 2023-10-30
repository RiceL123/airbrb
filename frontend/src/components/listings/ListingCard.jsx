import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const ListingCard = ({ listing }) => {
  return (
    <Link to={`/selectedListing/${listing.id}`} key={listing.id}>
      <Card>
        <CardContent>
          <h3>{listing.title}</h3>
          <p>Owner: {listing.owner}</p>
          <p>Property Type: {listing.propertyType}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListingCard;
