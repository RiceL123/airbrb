import React from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const ListingProfits = ({ listings, bookings }) => {
  const lastNDays = 30;
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - lastNDays);
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  const xLabels = [...Array(lastNDays).keys()];

  const profitPerDay = Array(lastNDays).fill(0);

  // Calculate total profits
  const calculateProfits = () => {
    let totalProfits = 0;

    // Iterate through bookings and sum up total prices
    for (const bookingId in bookings) {
      const booking = bookings[bookingId];
      const startDate = new Date(booking.dateRange.startDate);
      const endDate = new Date(booking.dateRange.endDate);

      const listing = listings.find(x => `${x.id}` === booking.listingId);

      if (!listing) {
        continue;
      }

      while (startDate.getDate() <= endDate.getDate()) {
        const utc2 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const utc1 = Date.UTC(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate());

        const dateDifference = Math.floor((utc2 - utc1) / _MS_PER_DAY);

        if (dateDifference >= 0 || dateDifference < lastNDays) {
          profitPerDay[dateDifference] = parseFloat(listing.price);
          totalProfits += parseFloat(listing.price);
        }

        startDate.setDate(startDate.getDate() + 1);
      }
    }

    return totalProfits;
  };

  const totalProfits = calculateProfits();

  return (
    <>
      <Card sx={{ p: 1 }}>
        <Typography>Profits for past {lastNDays} days from {thirtyDaysAgo.toDateString()} to {today.toDateString()}: ${totalProfits}</Typography>
        <CardContent>
          <BarChart
            width={500}
            height={300}
            series={[
              { data: profitPerDay, id: 'uvId', stack: 'total' }
            ]}
            xAxis={[
              { label: 'how many days ago', data: xLabels, scaleType: 'band' }
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ListingProfits;
