import React, { useState } from 'react';
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
  const [updatedThumbnail, setThumbnail] = useState(thumbnail);

  const handleChange = (e, newValue) => {
    if (newValue === '1') {
      setThumbnail({ isYoutubeVideoId: false, src: '' })
    } else {
      setThumbnail({ isYoutubeVideoId: true, src: '' })
    }
    setValue(newValue);
  };

  return (
    <>
     <Typography>Upload an Image or copy a valid YouTube Link to use as your listings thumbnail</Typography>
      <TabContext value={value}>
        <Box sx={{ width: '100%' }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Image" icon={<ImageIcon />} iconPosition="start" value="1"/>
            <Tab label="YouTube" icon={<YouTubeIcon />} iconPosition="start" value="2"/>
          </Tabs>
        </Box>
        <TabPanel value="1"><ThumbnailUpload defaultThumbnail={updatedThumbnail} onChange={onChange} /></TabPanel>
        <TabPanel value="2"><ThumbnailYoutubeUpload thumbnail={updatedThumbnail} onChange={onChange} /></TabPanel>
      </TabContext>
    </>
  );
}

export default ImageOrYTLinkUpload;
