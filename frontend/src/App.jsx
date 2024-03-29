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
import HostListingsPage from './components/hostListings/HostListingsPage';
import ListingsLandingPage from './components/listings/ListingsLandingPage';
import ViewSelectedListingPage from './components/listingInfo/ViewSelectedListingPage';
import EditListingPage from './components/hostListings/EditListingPage';
import ViewBookingsPage from './components/hostListings/ViewBookingsPage';

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
            <Route path='/hosted/:id/edit' element={<EditListingPage />} />
            <Route path='/selectedListing/:id' element={<ViewSelectedListingPage />} />
            <Route path='/viewBookings' element={<ViewBookingsPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
