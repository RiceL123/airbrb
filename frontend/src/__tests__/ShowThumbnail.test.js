import React from 'react';
import { render, screen } from '@testing-library/react';
import ShowThumbnail from '../components/listingInfo/ShowThumbnail';

describe('show thumbnail component', () => {
  const setup = () => {
    const thumb = { src: 'sampleUrl', isYoutubeVideoId: false };
    render(<ShowThumbnail thumbnail={ thumb } style={{ height: '200px', maxWidth: '100%' }} />);
  };
  beforeEach(() => setup());

  it('renders with correct alt text', () => {
    const altText = screen.getByAltText('listing image thumbnail');
    expect(altText).toBeInTheDocument();
  });

  it('renders with normal image URL', () => {
    const image = screen.getByRole('img');
    const expectedImageUrl = 'sampleUrl';
    expect(image).toHaveAttribute('src', expectedImageUrl);
  });

  it('renders with correct style', () => {
    const image = screen.getByRole('img');
    const expectedStyle = 'height: 200px; max-width: 100%;';
    expect(image).toHaveStyle(expectedStyle);
  });
})

describe('show thumbnail component with youtube thumb', () => {
  const setup = () => {
    const thumb = { src: '2JyW4yAyTl0', isYoutubeVideoId: true };
    render(<ShowThumbnail thumbnail={ thumb } style={{ height: '200px', maxWidth: '100%' }} />);
  };

  beforeEach(() => setup());

  it('renders with correct alt text for YouTube video thumbnail', () => {
    const iframe = screen.getByLabelText('listing yt iframe thumbnail');
    expect(iframe).toBeInTheDocument();
  });
})

describe('show broken thumbnail', () => {
  const setup = () => {
    render(<ShowThumbnail thumbnail={ '' } style={{}} />);
  };

  beforeEach(() => setup());

  it('renders with DEFAULT image url', () => {
    const image = screen.getByRole('img');
    const expectedImageUrl = 'https://files.catbox.moe/0wvec0.png';
    expect(image).toHaveAttribute('src', expectedImageUrl);
  });
})
