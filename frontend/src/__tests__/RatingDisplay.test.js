import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RatingDisplay from '../components/listings/RatingDisplay';

describe('show listing with correct scores', () => {
  it('renders with no ratings', () => {
    const sampleListing = {
      reviews: [],
    }

    render(<RatingDisplay listing={ sampleListing } />);

    // Use regex to match... text is broken up
    const text = screen.getByText(/Reviews: 0/);
    expect(text).toBeInTheDocument();
    const score = screen.getByText(/Avg: 0\/5/);
    expect(score).toBeInTheDocument();
  });

  it('renders with one ratings', () => {
    const sampleListing = {
      reviews: [
        {
          score: 5,
        }
      ],
    }

    render(<RatingDisplay listing={ sampleListing } />);

    // Use regex to match... text is broken up
    const text = screen.getByText(/Reviews: 1/);
    expect(text).toBeInTheDocument();
    const score = screen.getByText(/Avg: 5.00\/5/);
    expect(score).toBeInTheDocument();
  });

  it('renders with multiple ratings', () => {
    const sampleListing = {
      reviews: [
        {
          score: 5,
        },
        {
          score: 4,
        },
        {
          score: 1,
        }
      ],
    }

    render(<RatingDisplay listing={ sampleListing } />);

    // Use regex to match... text is broken up
    const text = screen.getByText(/Reviews: 3/);
    expect(text).toBeInTheDocument();
    const score = screen.getByText(/Avg: 3.33\/5/);
    expect(score).toBeInTheDocument();
  });
})
