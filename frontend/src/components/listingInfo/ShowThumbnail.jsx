import React from 'react';
import CardMedia from '@mui/material/CardMedia';
import { DEFAULT_IMG } from '../../helpers';

const ShowThumbnail = ({ thumbnail, style }) => {
  const imageUrl = thumbnail && thumbnail.isYoutubeVideoId
    ? `https://www.youtube.com/embed/${thumbnail.src}`
    : thumbnail?.src || DEFAULT_IMG;

  const altText = thumbnail && thumbnail.isYoutubeVideoId
    ? 'listing yt iframe thumbnail'
    : 'listing image thumbnail';

  return (
    <CardMedia
      component={thumbnail && thumbnail.isYoutubeVideoId ? 'iframe' : 'img'}
      image={imageUrl}
      style={style}
      alt={altText}
      aria-label={altText}
    />
  );
}

export default ShowThumbnail;
