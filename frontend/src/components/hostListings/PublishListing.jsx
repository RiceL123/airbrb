import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

const initialValue = dayjs(); // current date

const ServerDay = (props) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '❌' : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PublishListing = ({ availability, listingId }) => {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);

  const handleMonthChange = (date) => {
    setIsLoading(true);
    setHighlightedDays([]);

    // Extract the start and end dates from the availability array
    const tempAvailability = [
      { startDate: '2022-04-17', endDate: '2022-07-17' },
      { startDate: '2022-07-19', endDate: '2022-08-19' },
      { startDate: '2023-11-01', endDate: '2023-11-03' }
    ]

    const availabilityDates = tempAvailability.map((range) => {
      const startDate = dayjs(range.startDate);
      const endDate = dayjs(range.endDate);
      return {
        startDate,
        endDate,
      };
    });

    // Calculate the days within the availability range for the current month
    const currentMonth = date.startOf('month');
    const daysToHighlight = [];
    availabilityDates.forEach((range) => {
      for (let day = currentMonth; day.isBefore(range.endDate); day = day.add(1, 'day')) {
        if (day.isAfter(range.startDate) || day.isSame(range.startDate, 'day')) {
          daysToHighlight.push(day.date());
        }
      }
    });

    setHighlightedDays(daysToHighlight);
    setIsLoading(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Go Live
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Availabilities for ${listingId}`}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              defaultValue={initialValue}
              loading={isLoading}
              onMonthChange={handleMonthChange}
              renderLoading={() => <DayCalendarSkeleton />}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: {
                  highlightedDays,
                },
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>Go Live</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PublishListing;
