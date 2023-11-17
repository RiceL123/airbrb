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

  it('renders correctly with empty values', () => {
    render(<AddressFields street="" city="" state="" />);

    expect(screen.getByLabelText('Address (Street)').value).toBe('');
    expect(screen.getByLabelText('Address (City)').value).toBe('');
    expect(screen.getByLabelText('Address (State)').value).toBe('');
  });

  it('takes street input correctly', () => {
    const handleChangeMock = jest.fn();
    const { getByLabelText } = render(<AddressFields street="" city="" state="" handleChange={handleChangeMock} />);
    fireEvent.change(getByLabelText('Address (Street)'), { target: { value: 'New Street' } });
    expect(handleChangeMock).toHaveBeenCalled();
  });

  it('takes city input correctly', () => {
    const handleChangeMock = jest.fn();
    const { getByLabelText } = render(<AddressFields street="" city="" state="" handleChange={handleChangeMock} />);
    fireEvent.change(getByLabelText('Address (City)'), { target: { value: 'New City' } });
    expect(handleChangeMock).toHaveBeenCalled();
  });

  it('takes state input correctly', () => {
    const handleChangeMock = jest.fn();
    const { getByLabelText } = render(<AddressFields street="" city="" state="" handleChange={handleChangeMock} />);
    fireEvent.change(getByLabelText('Address (State)'), { target: { value: 'New State' } });
    expect(handleChangeMock).toHaveBeenCalled();
  });
})
