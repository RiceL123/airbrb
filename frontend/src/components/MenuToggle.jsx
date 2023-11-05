import * as React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AddHomeIcon from '@mui/icons-material/AddHome';
import HomeIcon from '@mui/icons-material/Home';

const MenuToggle = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem key='View Hosted' disablePadding>
          <ListItemButton component={Link} to="/hosted">
            <ListItemIcon><AddBusinessIcon /></ListItemIcon>
            <ListItemText primary={'View Hosted'} />
          </ListItemButton>
        </ListItem>
        <ListItem key='View All Listings' disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={'View All Listings'} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem key='Bookings' disablePadding>
          <ListItemButton component={Link} to="/bookings">
            <ListItemIcon><AddHomeIcon /></ListItemIcon>
            <ListItemText primary={'Bookings'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key='left'>
        <Button variant="contained" onClick={toggleDrawer(true)} sx={{ mr: 2 }}><MenuIcon /></Button>
        <Drawer
          open={isOpen}
          onClose={toggleDrawer(false)}
        >
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

export default MenuToggle;
