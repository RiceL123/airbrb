import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiCall } from '../../helpers';

import { Typography } from '@mui/material';

const ViewSelectedListingPage = () => {
  const { id } = useParams();
  const { authEmail, authToken } = useAuth();
  const [listingData, setListingData] = useState({});

  useEffect(() => {
    // const getListingInfo = async () => {
    //   const response = await apiCall('GET', authToken, '/listings/' + id, undefined);
    //   if (response.ok) {
    //     const data = await response.json();
    //     setListingData(data);
    //     console.log(data);
    //   } else {
    //     console.error('Getting specific listing data failed.');
    //   }
    // }

    // getListingInfo();
  });

  return (
    <>
      <Typography variant="h2">
        Details for Listing ID: {id}
      </Typography>
    </>
  );
}

export default ViewSelectedListingPage;
