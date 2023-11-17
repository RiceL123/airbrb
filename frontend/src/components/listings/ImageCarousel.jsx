import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Tab, Tabs, Typography, Switch, Button } from '@mui/material';
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
                key={index}
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
        : (<ImageList rowHeight={160} cols={4} >
          {
            images.map((item, index) => (
              <ImageListItem key={index}>
                <img
                  srcSet={`${item.imageUrl}`}
                  src={`${item.imageUrl}`}
                  alt={item.title}
                  style={{ maxHeight: '100%' }}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.title}
                />
              </ImageListItem>
            ))
          }
        </ImageList >)}
      <label htmlFor='toggle-image-view' style={{ fontFamily: 'sans-serif' }}>Toggle Image View</label>
      <Button onClick={toggleCarousel} name='Toggle Image View'>
        <Switch id='toggle-image-view' aria-label='toggle image grid' role='button' />
      </Button>
    </>
  );
}

export default ImageCarousel;
