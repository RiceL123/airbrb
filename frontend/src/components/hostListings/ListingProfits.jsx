import React from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const ListingProfits = ({ listings, bookings }) => {
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
  ];

  const profitPerDay = []

  // Calculate total profits
  const calculateProfits = () => {
    console.log(listings)
    console.log(bookings);

    let totalProfits = 0;

    // Iterate through bookings and sum up total prices
    for (const bookingId in bookings) {
      const booking = bookings[bookingId];
      const startDate = new Date(booking.dateRange.startDate);
      const endDate = new Date(booking.dateRange.endDate);

      const listing = listings.find(x => x.id === booking.listingId);
      console.log(listing);

      while (startDate.getDate() <= endDate.getDate()) {
        // Add the date and the price per night to the profitPerDay array
        profitPerDay.push({
          date: new Date(startDate), // Convert to a new date object to avoid reference issues
          price: 1,
        });
        startDate.setDate(startDate.getDate() + 1); // Move to the next day
      }

      totalProfits += parseFloat(booking.totalPrice);
    }

    console.log(profitPerDay);
    return totalProfits;
  };

  const totalProfits = calculateProfits();

  return (
    <>
      <Typography>Profits</Typography>
      <Card>
        <CardContent>
          <Typography>Total Profits: ${totalProfits.toFixed(2)}</Typography>
          <BarChart
            width={500}
            height={300}
            series={[
              { data: uData, label: 'uv', id: 'uvId' },
            ]}
            xAxis={[{ data: xLabels, scaleType: 'band' }]}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ListingProfits;
