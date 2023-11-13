import React from 'react';
import { render, screen, fireEvent  } from '@testing-library/react';
import ImageCarousel from '../components/listings/ImageCarousel';

describe('image carousel renders correctly', () => {
  const images = [
    { title: 'Image 1', imageUrl: 'url1' },
    { title: 'Image 2', imageUrl: 'url2' },
    { title: 'Image 3', imageUrl: 'url3' },
  ];

  it('renders with one image', () => {
    render(<ImageCarousel images={[images[0]]} />);
    const toggleButton = screen.getByRole('button', { name: 'Toggle Image View' });
    expect(toggleButton).toBeInTheDocument();
    expect(screen.getAllByText('Image 1')[0]).toBeInTheDocument();
  });

  it('renders with multiple image', () => {
    render(<ImageCarousel images={images} />);
    const toggleButton = screen.getByRole('button', { name: 'Toggle Image View' });
    expect(toggleButton).toBeInTheDocument();
    expect(screen.getAllByText('Image 1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Image 2')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Image 3')[0]).toBeInTheDocument();
  });

  it('handles input to change image', () => {
    render(<ImageCarousel images={images} />);
    const toggleButton = screen.getByRole('button', { name: 'Toggle Image View' });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.getAllByAltText('Image 1')[0]).toBeInTheDocument();
    expect(screen.getAllByAltText('Image 2')[0]).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.getAllByText('Image 1')[0]).toBeInTheDocument();
    expect(screen.queryByAltText('Image 2')).toBeNull();
  });
})