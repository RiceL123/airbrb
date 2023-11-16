import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Typography from '@mui/material/Typography';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ImageIcon from '@mui/icons-material/Image';

import ThumbnailYoutubeUpload from './ThumbnailYoutubeUpload';
import ThumbnailUpload from './ThumbnailUpload';

const ImageOrYTLinkUpload = ({ thumbnail, onChange }) => {
  const [value, setValue] = useState(thumbnail.isYoutubeVideoId ? '2' : '1');

  useEffect(() => {
    setValue(thumbnail.isYoutubeVideoId ? '2' : '1');
  }, [thumbnail.isYoutubeVideoId])

  const handleChange = (e, newValue) => {
    if (newValue === '1') {
      onChange(e, { isYoutubeVideoId: false, src: '' });
    } else {
      onChange(e, { isYoutubeVideoId: true, src: '' });
    }
    setValue(newValue);
  };

  return (
    <>
      <Typography variant='h6'>Upload an Image or copy a valid YouTube Link to use as your listings thumbnail</Typography>
      <TabContext value={value}>
        <Box sx={{ width: '100%' }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Image" icon={<ImageIcon />} iconPosition="start" value="1" />
            <Tab label="YouTube" icon={<YouTubeIcon />} iconPosition="start" value="2" />
          </Tabs>
        </Box>
        <TabPanel value="1"><ThumbnailUpload defaultThumbnail={thumbnail} onChange={onChange} /></TabPanel>
        <TabPanel value="2"><ThumbnailYoutubeUpload thumbnail={thumbnail} onChange={onChange} /></TabPanel>
      </TabContext>
    </>
  );
}

export default ImageOrYTLinkUpload;
