import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';

const AvailabiltyList = ({ availabilites }) => {
  const [availability, setAvailability] = useState(availabilites);

  const handleDelete = async (e) => {
    console.log(e)
    if (availabilites.length === 1) {
      setAvailability([])
    } else {
      const newAvailability = availability.splice(e.target.key, 1);
      console.log(newAvailability);
      setAvailability(newAvailability);
    }
  }
  return (
    <>
      {availability === 0
        ? <Typography variant='body2'> no availabilites ❌🗓️</Typography>
        : (<List dense={false}>
          {availability.map(({ startDate, endDate }, index) => {
            return (<ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon onClick={handleDelete} />
                </IconButton>
              }
            >
              <Typography variant='body1'>{startDate.substring(0, 10)} to {endDate.substring(0, 10)}</Typography>
            </ListItem>)
          })}
        </List>)}
    </>
  )
}

export default AvailabiltyList;
