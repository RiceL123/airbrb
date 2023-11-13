import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AmenitiesFields from '../components/hostListings/listingProperties/AmenitiesFields';

describe('AmenitiesFields component', () => {
  it('renders correctly', () => {
    const amenities = ['Amenity 1', 'Amenity 2'];
    render(<AmenitiesFields amenities={amenities} />);
    
    amenities.forEach((amenity) => {
      expect(screen.getByDisplayValue(amenity)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Add Amenity' })).toBeInTheDocument();
  });

  it('handles input for delete button', () => {
    const amenities = ['Amenity 1', 'Amenity 2'];
    const deleteAmenityMock = jest.fn();
    render(<AmenitiesFields amenities={amenities} deleteAmenity={deleteAmenityMock} />);

    const deleteButtons = screen.getAllByLabelText('Delete Amenity');
    fireEvent.click(deleteButtons[0]);
    expect(deleteAmenityMock).toHaveBeenCalledWith(0);
  });

  it('handles input for add button', () => {
    const addAmenityMock = jest.fn();
    render(<AmenitiesFields amenities={[]} addAmenity={addAmenityMock} />);

    const addButton = screen.getByRole('button', { name: 'Add Amenity' });
    fireEvent.click(addButton);
    expect(addAmenityMock).toHaveBeenCalled();
  });
});