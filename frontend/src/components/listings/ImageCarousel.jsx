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
        {images.map(([fileName, fileUrl], index) => (
          <Tab
            key={fileName}
            label={fileName}
            value={index}
          />
        ))}
      </Tabs>

      <Card>
        <CardMedia
          sx={{ height: 200, width: 200 }}
          image={images[tabValue][1]}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {images[tabValue][0]}
          </Typography>
          <Button color="error" variant="outlined">Delete</Button>
        </CardContent>
      </Card>
    </>
  );
}

export default ImageCarousel;
