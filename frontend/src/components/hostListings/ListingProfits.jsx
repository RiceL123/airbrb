import React from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const ListingProfits = ({ listings, bookings }) => {
  // const uData = [25, 60, 90, 10, 3, 0, 0, 10, 90, 200, 200]
  const xLabels = [...Array(30).keys()];

  const profitPerDay = Array(30).fill(0);

  // Calculate total profits
  const calculateProfits = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    console.log(`today = ${today}; thirtydaysago = ${thirtyDaysAgo}`);
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    let totalProfits = 0;

    // Iterate through bookings and sum up total prices
    for (const bookingId in bookings) {
      const booking = bookings[bookingId];
      const startDate = new Date(booking.dateRange.startDate);
      const endDate = new Date(booking.dateRange.endDate);

      const listing = listings.find(x => x.id === booking.listingId);
      console.log(listing);

      // only looking at dates in the last 30 days
      if (startDate > today || endDate <= thirtyDaysAgo) {
        continue;
      }

      console.log(booking)
      while (startDate.getDate() <= endDate.getDate()) {
        const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const utc2 = Date.UTC(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate());

        const dateDifference = Math.floor((utc2 - utc1) / _MS_PER_DAY);

        console.log(`dateDifference ${dateDifference} of ${startDate} - ${thirtyDaysAgo}`);

        if (dateDifference >= 0 || dateDifference < 30) {
          profitPerDay[dateDifference] = 5
        }

        startDate.setDate(startDate.getDate() + 1);
      }

      totalProfits += parseFloat(booking.totalPrice);
    }

    console.log(profitPerDay);
    return totalProfits;
  };

  const totalProfits = calculateProfits();

  return (
    <>
      <Card>
        <Typography>Profits for past 30 days</Typography>
        <CardContent>
          <Typography>Total Profits: ${totalProfits.toFixed(2)}</Typography>
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
