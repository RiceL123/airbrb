import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Typography, CircularProgress } from '@mui/material';
import { apiCall } from '../../helpers';
import ListingToEdit from './ListingToEdit';

const EditListingPage = () => {
  const { authEmail, authToken } = useAuth();
  const { id } = useParams();
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listingInfo, setListingInfo] = useState(null);

  useEffect(() => {
    const getListing = async () => {
      const response = await apiCall('GET', authToken, `/listings/${id}`);
      if (response.ok) {
        const { listing } = await response.json();
        if (listing.owner === authEmail) {
          setListingInfo(listing);
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } else {
        console.error(`Could not find listing id: ${id}. Error ${response.status}`);
      }
      setIsLoading(false);
    }

    getListing();
  }, [authToken, authEmail, id]);

  return (
    <>
      {isLoading
        ? <CircularProgress />
        : (<>
          {hasPermission
            ? (<>
              <ListingToEdit listingInfo={listingInfo}/>
            </>)
            : (<Typography variant="h2">
              403 {authEmail} Cannot edit listing {id}
            </Typography>)}
        </>)}
    </>
  );
}

export default EditListingPage;
