import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Tab, Tabs, Typography, Button } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

const ImageCarousel = ({ images }) => {
  const [tabValue, setTabValue] = useState(0);
  const [showCarousel, setshowCarousel] = useState(true);

  const handleChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const toggleCarousel = () => {
    setshowCarousel(!showCarousel);
  }

  return (
    <>
      {showCarousel
        ? (<>
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
            </CardContent>
          </Card>
        </>)
        : (<ImageList sx={{ width: '100%', height: 450 }} >
          {
            images.map((item, index) => (
              <ImageListItem key={index}>
                <img
                  srcSet={`${item.imageUrl}`}
                  src={`${item.imageUrl}`}
                  alt={item.title}
                  style={{ maxHeight: 400 }}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.title}
                />
              </ImageListItem>
            ))
          }
        </ImageList >)}
        <Button onClick={toggleCarousel} variant="outlined" sx={{ m: 2 }}>Toggle Image View</Button>
    </>
  );
}

export default ImageCarousel;
