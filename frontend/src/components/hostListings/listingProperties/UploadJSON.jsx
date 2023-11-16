import React from 'react';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Tooltip, Typography, Button } from '@mui/material';

const UploadJSON = ({ handleJSONFile }) => {
  const info = (<div>
    <Typography>Upload a JSON file of the listing in the format</Typography>
    <Typography sx={{ fontSize: 8 }}>&#123;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&quot;title&quot;: &quot;My house&quot;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&quot;address&quot;: &#123;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;street&quot;: &quot;375 Anzac Parade&quot;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;city&quot;: &quot;Sydney&quot;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;state&quot;: &quot;NSW&quot;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&#125;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&quot;price&quot;: 100,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&quot;thumbnail&quot;: &#123;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;isYoutubeVideoId&quot;: true,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;src&quot;: &quot;miIruPhFOK0&quot;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&#125;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&quot;metadata&quot;: &#123;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;propertyType&quot;: &quot;entirePlace&quot;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;bedrooms&quot;: [</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;name&quot;: &quot;bed 1&quot;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;beds&quot;: &quot;1&quot;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;],</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;numberBathrooms&quot;: 0,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;amenities&quot;: [</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;swimming pool&quot;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;air conditioner&quot;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;],</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&quot;images&quot;: [</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;title&quot;: &quot;WIN_20230623_16_01_19_Pro.jpg&quot;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;imageUrl&quot;: &quot;https://img.freepik.com/premium-photo/girl-with-white-hair-blue-eyes-looks-camera_706163-765.jpg&quot;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;title&quot;: &quot;swimming_pool.jpg&quot;,</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;imageUrl&quot;: &quot;https://wallpapers.com/images/featured/anime-girl-pictures-t7rj97cpxsunxus8.jpg&quot;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&nbsp;&nbsp;]</Typography>
    <Typography sx={{ fontSize: 8 }}>&nbsp;&nbsp;&#125;</Typography>
    <Typography sx={{ fontSize: 8 }}>&#125;</Typography>
  </div>)

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const parseJsonFile = async (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = event => {
        if (file.type !== 'application/json') {
          reject(new Error('file must be a json file'));
        } else {
          resolve(JSON.parse(event.target.result))
        }
      }
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
  }

  const defaultListing = {
    title: '',
    address: {
      street: '',
      city: '',
      state: ''
    },
    price: 0.0,
    thumbnail: { isYoutubeVideoId: false, src: '' },
    metadata: {
      numberBeds: 0,
      propertyType: 'entirePlace',
      bedrooms: [],
      numberBathrooms: 0,
      amenities: [],
      images: [],
      isLive: false,
      bookings: [],
    }
  }

  const validateFile = async (e) => {
    const currListing = defaultListing;
    parseJsonFile(e.target.files[0])
      .then(listing => {
        for (const [key, value] of Object.entries(listing)) {
          if (key === 'metadata') {
            for (const [metaDataKey, metaDataValue] of Object.entries(listing.metadata)) {
              currListing.metadata[metaDataKey] = metaDataValue;
            }
          } else if (key === 'address') {
            for (const [addressKey, addressValue] of Object.entries(listing.address)) {
              currListing.address[addressKey] = addressValue;
            }
          } else {
            currListing[key] = value;
          }
        }
        handleJSONFile(e, currListing);
      })
      .catch(msg => alert(msg))
  }

  return (
    <>
      <Tooltip disableFocusListener disableTouchListener title={info} placement="top" sx={{ whiteSpace: 'pre-line', maxWidth: '1000px' }}>
        <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
          Upload JSON file
          <VisuallyHiddenInput type="file" onChange={validateFile} />
        </Button>
      </Tooltip>
    </>
  );
}

export default UploadJSON;
