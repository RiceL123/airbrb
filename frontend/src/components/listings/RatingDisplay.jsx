import React from 'react';
import { Tooltip, Typography } from '@mui/material';

const RatingDisplay = ({ listing }) => {
  const numReviews = (<>
    {!listing.reviews || listing.reviews.length === 0
      ? <Typography>No reviews</Typography>
      : (<>
      {
        [0, 1, 2, 3, 4, 5].map(x => (
          <Typography key={x}>{x} stars: {listing.reviews.filter(review => review.score === `${x}`).length}, {(listing.reviews.filter(review => review.score === `${x}`).length * 100 / listing.reviews.length).toFixed(2)}%</Typography>
        ))
      }
      </>)
    }
  </>)
  const calculateAverageScore = () => {
    let totalScore = 0;
    if (listing.reviews && listing.reviews.length > 0) {
      listing.reviews.forEach((review) => {
        totalScore += parseInt(review.score);
      });
    } else {
      return 0;
    }

    const averageScore = totalScore / listing.reviews.length;
    return averageScore.toFixed(2);
  }

  return (
    <>
      <Tooltip title={numReviews} placement="top-start">
        <Typography variant='body1'>{'Reviews: ' + (listing.reviews && listing.reviews.length) + ' (Avg: ' + calculateAverageScore() + '/5 ⭐)'}</Typography>
      </Tooltip>
    </>
  );
};

export default RatingDisplay;
