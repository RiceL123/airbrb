import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';

const RatingDisplay = ({ listing }) => {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [modalReviews, setModalReviews] = useState([]);

  const displayRatingModal = (e, starRating) => {
    e.preventDefault();

    if (listing.reviews) {
      setModalReviews(listing.reviews.filter(x => x.score === `${starRating}`));
    } else {
      setModalReviews([]);
    }

    setOpenReviewModal(true);
  }

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenReviewModal(false);
  }

  const numReviews = (<>
    {!listing.reviews || listing.reviews.length === 0
      ? <Typography>No reviews</Typography>
      : (<>
        {
          [0, 1, 2, 3, 4, 5].map(x => (
            <Button key={x} onClick={e => displayRatingModal(e, x)}>
              <Typography key={x} variant='body1' sx={{ color: 'white' }}>
                {x} stars: {listing.reviews.filter(review => review.score === `${x}`).length}, {(listing.reviews.filter(review => review.score === `${x}`).length * 100 / listing.reviews.length).toFixed(2)}%
              </Typography>
            </Button>
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }
  return (
    <>
      <Tooltip title={numReviews} placement="top-start">
        <Typography variant='body1'>{'Reviews: ' + (listing.reviews && listing.reviews.length) + ' (Avg: ' + calculateAverageScore() + '/5 ⭐)'}</Typography>
      </Tooltip>
      <Modal
        open={openReviewModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        {!modalReviews || modalReviews.length === 0
          ? <Typography variant="body1" sx={style}>No reviews of this star rating</Typography>
          : <Box sx={style}>
            <Typography variant="h5">{modalReviews[0].score} ⭐ Reviews</Typography>
            {modalReviews.map((x, index) => (
              <Card key={index} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="body2">Name: {x.name}</Typography>
                  <Typography variant="body2">{x.comment}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        }
      </Modal>
    </>
  );
};

export default RatingDisplay;
