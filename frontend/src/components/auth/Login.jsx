import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { apiCall } from '../../helpers';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()

    setEmailError(false)
    setPasswordError(false)

    if (email === '') {
      setEmailError(true)
      return
    }
    if (password === '') {
      setPasswordError(true)
      return
    }

    const res = await apiCall('POST', undefined, '/user/auth/login', {
      email,
      password
    });

    if (res.ok) {
      const { token } = await res.json()
      login(email, token)
      navigate('/');
    } else {
      setEmailError(true)
      setPasswordError(true)
    }
  }

  return (
    <>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <Typography variant="h2" component="h2">Login</Typography>
        <TextField
          label='Email'
          onChange={e => setEmail(e.target.value)}
          required
          type='email'
          sx={{ mb: 3 }}
          fullWidth
          value={email}
          error={emailError}
        />
        <TextField
          label='Password'
          onChange={e => setPassword(e.target.value)}
          required
          type='password'
          value={password}
          error={passwordError}
          fullWidth
          sx={{ mb: 3 }}
        />
        <Button variant='contained' color='primary' type='submit'>Login</Button>

      </form>
      <Typography variant="subtitle1" component="span">Need an account? <Link to='/register'>Register</Link></Typography>
    </>
  );
}

export default Login;
