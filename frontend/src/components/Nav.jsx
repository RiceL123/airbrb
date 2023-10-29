import React from 'react';
import {
  Link
} from 'react-router-dom';

const Nav = () => {
  let isAuthenticated = false;
  const logout = () => {
    console.log('logging out ig');
    isAuthenticated = false;
  }
  return (
    <nav className='bg-primary-subtle d-flex justify-content-between'>
      <Link to="/" className='btn btn-outline-primary'>Home</Link>
      <div>
        {isAuthenticated
          ? (<button onClick={logout} className='btn btn-outline-primary'>Logout</button>)
          : (<>
            <Link to="/login" className='btn btn-outline-primary'>Login</Link>
            <Link to="/register" className='btn btn-outline-primary'>Register</Link>
          </>
            )}
      </div>
    </nav>
  );
}

export default Nav;
