import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

import { apiCall } from '../../helpers';

import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const ListingsLandingPage = () => {
  const { authEmail, authToken } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const getListings = async () => {
      const response = await apiCall('GET', authToken, '/listings', undefined);
      if (response.ok) {
        const data = await response.json();
        setListings(data);
        console.log(data);
      } else {
        console.error('Getting all listings failed.');
      }
    }

    getListings();
  }, []);

  return (
    <>
      <Typography variant="h2">
        airbrb
      </Typography>
      <Typography variant="body1">welcome ~➡️{!authEmail && !authToken ? 'Guest User' : authEmail}⬅️~</Typography>

      {Array.isArray(listings) && listings.map((listing) => (
        <Link to={`/selectedListing/${listing.id}`} key={listing.id}>
          <Card>
            <CardContent>
              <h3>{listing.title}</h3>
              <p>Owner: {listing.owner}</p>
              <p>Property Type: {listing.propertyType}</p>
            </CardContent>
          </Card>
        </Link>
      ))}

    </>
  );
}

export default ListingsLandingPage;
