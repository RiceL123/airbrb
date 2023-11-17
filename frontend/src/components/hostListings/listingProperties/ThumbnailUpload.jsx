import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';

import { fileToDataUrl, DEFAULT_IMG } from '../../../helpers';

const ThumbnailUpload = ({ defaultThumbnail, onChange }) => {
  const [thumbnail, setThumbnail] = useState(defaultThumbnail);

  const updateThumbnail = (e) => {
    const thumbnailFile = e.target.files[0];
    fileToDataUrl(thumbnailFile)
      .then((fileUrl) => {
        onChange(e, { isYoutubeVideoId: false, src: fileUrl });
        setThumbnail({ isYoutubeVideoId: false, src: fileUrl });
      })
      .catch(msg => alert(msg));
  }

  return (
    <Card sx={{ mb: 2, p: 1 }}>
      <Typography variant="body1">Thumbnail</Typography>
      <CardMedia
        sx={{ height: 200, width: 200 }}
        image={thumbnail.src === '' ? DEFAULT_IMG : thumbnail.src}
        alt='listing thumbnail'
        aria-label='listing thumbnail'
      />
      <Input
        name="thumbnail"
        label="Thumbnail"
        type="file"
        onChange={updateThumbnail}
      />
    </Card>
  );
}

export default ThumbnailUpload;
