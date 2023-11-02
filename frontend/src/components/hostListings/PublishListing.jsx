import React, { useState } from 'react';
import { Button, Typography, Alert, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from '../auth/AuthContext';
import { apiCall } from '../../helpers';
import AvailabiltyList from './AvailabiltyList';

const PublishListing = ({ id, availability, setAvailability }) => {
  const { authToken } = useAuth();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const publishListingRequest = async () => {
    const newAvailability = availability.slice(); // make a copy
    newAvailability.push({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    });

    const response = await apiCall('PUT', authToken, '/listings/publish/' + id, { availability: newAvailability });
    if (response.ok) {
      setAvailability(newAvailability);
    } else {
      alert('Error occurred while publishing liting.');
    }
  }

  const publishListing = () => {
    if (!startDate && !endDate) {
      alert('Please select both startDate and endDate.');
      return;
    }

    if (startDate > endDate) {
      alert('Start date must be before end date');
      return;
    }

    publishListingRequest()
  }

  const unPublishListing = async () => {
    const response = await apiCall('PUT', authToken, `/listings/unpublish/${id}`);
    if (response.ok) setAvailability([]);
    else alert('Error occurred while unpublishing listing.');
  }
  return (
    <>
      {availability && availability.length >= 1
        ? (<>
          <Typography variant="h6">Current Availabilities</Typography>
          <AvailabiltyList availabilites={availability} />
          <Button variant="outlined" onClick={unPublishListing}>
            Unpublish
          </Button>
        </>)
        : (<>
          <Typography variant="h6">Publishing</Typography>
          <Alert severity="info">Pick certain dates to make available for guests.</Alert>
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
          <Button variant="outlined" onClick={publishListing}>
            Publish!
          </Button>
        </>)}
    </>
  );
};

export default PublishListing;
