import React from 'react';
import { useParams } from 'react-router-dom';

import { Typography } from '@mui/material';

const ViewSelectedListingPage = () => {
  const { id } = useParams();

  return (
    <>
      <Typography variant="h2">
        Details for Listing ID: {id}
      </Typography>
    </>
  );
}

export default ViewSelectedListingPage;
