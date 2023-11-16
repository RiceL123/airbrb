import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuToggle from '../components/MenuToggle';
import { MemoryRouter } from 'react-router-dom';

describe('MenuToggle component', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <MenuToggle />
      </MemoryRouter>
    );

    expect(screen.queryByText('View Hosted')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('View Hosted')).toBeInTheDocument();
  })

  it('handles button press correctly for hosted', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <MenuToggle />
      </MemoryRouter>
    );

    expect(screen.queryByText('View Hosted')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('View Hosted')).toBeInTheDocument();

    fireEvent.click(screen.getByText('View Hosted'));
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('View Hosted')).toBeInTheDocument();
  })

  it('handles button press correctly for all listings', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <MenuToggle />
      </MemoryRouter>
    );

    expect(screen.queryByText('View All Listings')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('View All Listings')).toBeInTheDocument();

    fireEvent.click(screen.getByText('View All Listings'));
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('View All Listings')).toBeInTheDocument();
  })

  it('handles incorrect input for toggle', () => {
    render(
      <MemoryRouter>
        <MenuToggle />
      </MemoryRouter>
    );

    expect(screen.queryByText('View Hosted')).toBeNull();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByText('View Hosted')).toBeNull();
  })
});
