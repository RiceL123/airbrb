import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Nav from './components/Nav';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ViewBookingsPage from './components/hostListings/ViewBookingsPage';
import HostListingsPage from './components/hostListings/HostListingsPage';
import ListingsLandingPage from './components/hostListings/ListingsLandingPage';
import EditBookingsPage from './components/hostListings/EditBookingsPage';
import ViewSelectedListingPage from './components/hostListings/ViewSelectedListingPage';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<ListingsLandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/hosted' element={<HostListingsPage />} />
          <Route path='/bookings' element={<ViewBookingsPage />} />
          <Route path='/editHosted' element={<EditBookingsPage />} />
          <Route path='/selectedListing' element={<ViewSelectedListingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
