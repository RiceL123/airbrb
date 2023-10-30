import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import { AuthProvider } from './components/auth/AuthContext';

import Nav from './components/Nav';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ViewBookingsPage from './components/hostListings/ViewBookingsPage';
import HostListingsPage from './components/hostListings/HostListingsPage';
import ListingsLandingPage from './components/listings/ListingsLandingPage';
import EditBookingsPage from './components/hostListings/EditBookingsPage';
import ViewSelectedListingPage from './components/listingInfo/ViewSelectedListingPage';

const App = () => {
  return (
    <>
      <AuthProvider>
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
      </AuthProvider>
    </>
  );
}

export default App;
