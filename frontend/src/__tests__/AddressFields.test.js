import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddressFields from '../components/hostListings/listingProperties/AddressFields';

describe('show inputs for address fields', () => {
  it('renders correctly with default values', () => {
    render(<AddressFields street="123 Main St" city="Sydney" state="NSW" />);

    expect(screen.getByLabelText('Address (Street)').value).toBe('123 Main St');
    expect(screen.getByLabelText('Address (City)').value).toBe('Sydney');
    expect(screen.getByLabelText('Address (State)').value).toBe('NSW');
  });

  it('takes input correctly', () => {
    render(<AddressFields street="123 Main St" city="Sydney" state="NSW" />);

    const streetInput = screen.getByLabelText('Address (Street)');
    const cityInput = screen.getByLabelText('Address (City)');
    const stateInput = screen.getByLabelText('Address (State)');

    fireEvent.change(streetInput, { target: { value: '456 New St' } });
    fireEvent.change(cityInput, { target: { value: 'Brisbane' } });
    fireEvent.change(stateInput, { target: { value: 'QLD' } });

    expect(streetInput.value).toBe('456 New St');
    expect(cityInput.value).toBe('Brisbane');
    expect(stateInput.value).toBe('QLD');
  });
})
