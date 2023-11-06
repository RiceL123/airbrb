import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Typography } from '@mui/material';

const AvailabiltyList = ({ availabilites }) => {
  return (
    <>
      {availabilites.length === 0
        ? <Typography variant='body2'> no availabilites ❌🗓️</Typography>
        : (<List dense={false}>
          {availabilites.map(({ startDate, endDate }, index) => {
            return (<ListItem key={index}>
              <Typography variant='body1'>{startDate.substring(0, 10)} to {endDate.substring(0, 10)}</Typography>
            </ListItem>)
          })}
        </List>)}
    </>
  )
}

export default AvailabiltyList;
