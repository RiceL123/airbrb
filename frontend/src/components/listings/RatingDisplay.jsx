import React from 'react';
import { Typography } from '@mui/material';

const RatingDisplay = ({ listing }) => {
  const calculateAverageScore = () => {
    let totalScore = 0;
    if (listing.reviews && listing.reviews.length > 0) {
      listing.reviews.forEach((review) => {
        totalScore += parseInt(review.score);
      });
    }

    const averageScore = totalScore / listing.reviews.length;
    return averageScore;
  }

  return (
    <Typography variant='body1'>{'Reviews: ' + listing.reviews.length + ' (Avg: ' + calculateAverageScore() + '/5 ⭐)'}</Typography>
  );
};

export default RatingDisplay;
