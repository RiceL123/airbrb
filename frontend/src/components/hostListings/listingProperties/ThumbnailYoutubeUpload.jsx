import React, { useState } from 'react';
import CardMedia from '@mui/material/CardMedia';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DoneIcon from '@mui/icons-material/Done';

const ThumbnailYoutubeUpload = ({ thumbnail, onChange }) => {
  const [youtubeVideoId, setYoutubeVideoId] = useState(thumbnail.isYoutubeVideoId ? thumbnail.src : '');
  const [youtubeVideoLink, setYoutubeVideoLink] = useState(thumbnail.src !== '' && thumbnail.isYoutubeVideoId ? `https://www.youtube.com/embed/${youtubeVideoId}` : '');
  const [isValidLink, setIsValidLink] = useState(false);

  // youtube id extraction from https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url/27728417#27728417
  const extractIdFromLink = (link) => {
    const pattern = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
    const result = link.match(pattern);
    if (!result) {
      return undefined;
    }
    const id = result[1];
    return id;
  };

  const updateThumbnail = (e) => {
    const id = extractIdFromLink(youtubeVideoLink);
    if (id) {
      setYoutubeVideoId(id);
      onChange(e, { isYoutubeVideoId: true, src: id });
      setIsValidLink(true);
      setTimeout(() => setIsValidLink(false), 2000);
    } else {
      setYoutubeVideoId('');
    }
  };

  const updateYoutubeVideoLink = (e) => {
    setYoutubeVideoLink(e.target.value);
  }

  return (
    <div>
      <Typography variant="body1">YouTube Link</Typography>
      <CardMedia sx={{ height: 200, width: 600 }}>
        {youtubeVideoId
          ? (<>
            <Typography variant="body1">Embedding with video id: {youtubeVideoId}</Typography>
            <iframe
              name="thumbnailYoutube"
              width="auto"
              height="170"
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              allowFullScreen
            />
          </>)
          : (<Typography color="error">Invalid YouTube Link</Typography>)}
      </CardMedia>
      <Stack direction="row">
        <Input
          name="youtubeVideoLink"
          label="YouTube Link"
          type="text"
          value={youtubeVideoLink}
          onChange={updateYoutubeVideoLink}
          sx={{ flexGrow: 1 }}
        />
        <Button
          name="thumbnail"
          endIcon={isValidLink ? <DoneIcon /> : null}
          onClick={updateThumbnail}>
          Save YouTube Link
        </Button>
      </Stack>
    </div>
  );
};

export default ThumbnailYoutubeUpload;
