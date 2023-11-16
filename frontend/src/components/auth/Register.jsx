import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { apiCall } from '../../helpers';
import { useAuth } from './AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError(false);
    setNameError(false);
    setPasswordError(false);

    if (email === '') {
      setEmailError(true);
      return;
    }
    if (name === '') {
      setNameError(true);
      return;
    }
    if (password === '') {
      setPasswordError(true);
      return;
    }

    const response = await apiCall('POST', undefined, '/user/auth/register', {
      email,
      name,
      password
    });

    if (response.status === 200) {
      const { token } = await response.json();
      setEmail('');
      setName('');
      setPassword('');
      login(email, token);
      navigate('/');
    } else {
      setEmailError(true);
      setNameError(true);
      setPasswordError(true);
    }
  }

  return (
    <>
      <Typography variant="h2" component="h2">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label='Email'
          onChange={(e) => setEmail(e.target.value)}
          required
          type='email'
          fullWidth
          value={email}
          error={emailError}
          sx={{ mb: 3 }}
        />
        <TextField
          label='Name'
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          type='name'
          value={name}
          error={nameError}
          sx={{ mb: 3 }}
        />
        <TextField
          label='Password'
          onChange={(e) => setPassword(e.target.value)}
          required
          type='password'
          fullWidth
          value={password}
          error={passwordError}
          sx={{ mb: 3 }}
        />
        <Button variant='contained' type='submit'>Submit</Button>
      </form>
      <Typography variant="subtitle1" component="span">Already have an account? <Link to='/login'>Login</Link></Typography>
    </>
  );
}

export default Register;
