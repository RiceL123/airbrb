import React from 'react';
import { Card, CardContent, CardMedia, Tab, Tabs, Typography, Button } from '@mui/material';

const ImageCarousel = ({ images }) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {images.map(({ title, imageUrl }, index) => (
          <Tab
            key={title}
            label={title}
            value={index}
          />
        ))}
      </Tabs>

      <Card>
        <CardMedia
          sx={{ height: 200, width: 200 }}
          image={images[tabValue].imageUrl}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {images[tabValue].title}
          </Typography>
          <Button color="error" variant="outlined">Delete</Button>
        </CardContent>
      </Card>
    </>
  );
}

export default ImageCarousel;
