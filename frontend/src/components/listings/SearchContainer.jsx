import React, { useState } from 'react';
import { TextField, Slider, Typography, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const SearchContainer = () => {
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [maxBedrooms, setMaxBedrooms] = useState(25);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(1);
  const [maxRating, setMaxRating] = useState(5);

  const handleBedroomsChange = (event, newValue) => {
    setMinBedrooms(newValue[0]);
    setMaxBedrooms(newValue[1]);
  };

  const handlePriceChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleRatingChange = (event, newValue) => {
    setMinRating(newValue[0]);
    setMaxRating(newValue[1]);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Typography variant="subtitle1">Number of Bedrooms</Typography>
        <Slider
          value={[minBedrooms, maxBedrooms]}
          onChange={handleBedroomsChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => (value === 0 ? 'Any' : value)}
          max={25}
        />
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle1">Review Ratings</Typography>
        <Slider
          value={[minRating, maxRating]}
          onChange={handleRatingChange}
          valueLabelDisplay="auto"
          max={5}
        />
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle1">Date Range</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="subtitle1">Price Range</Typography>
        <Slider
          value={[minPrice, maxPrice]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `$${value}`}
          max={5000}
        />
      </Grid>
    </Grid>
  );
};

export default SearchContainer;
