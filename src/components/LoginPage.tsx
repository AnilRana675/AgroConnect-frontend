import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        'http://localhost:3001/api/auth/login',
        formData,
      );

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Navigate to user page
        navigate('/user');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${require('../assets/background.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(0.5px) brightness(0.95)',
          zIndex: 2,
        }}
      />
      {/* Green Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(33,65,0,0.85) 0%, rgba(33,65,0,0.5) 60%, rgba(33,65,0,0) 100%)',
          opacity: 1,
          zIndex: 1,
        }}
      />
      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
        }}
      >
        <Container maxWidth='sm'>
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Logo and Title */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <img
                  src={require('../assets/soloLogo.png')}
                  alt='AgroConnect Logo'
                  style={{
                    maxWidth: '100%',
                    maxHeight: 120,
                    height: 'auto',
                    width: 'auto',
                    display: 'block',
                  }}
                />
              </Box>
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  fontWeight: 'bold',
                  color: '#2e7d32',
                  mb: 1,
                  fontFamily: 'Rubik, sans-serif',
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                Sign in to your AgroConnect account
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
              <TextField
                fullWidth
                label='Email Address'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder='Enter your email'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Email sx={{ color: '#4caf50' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder='Enter your password'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Lock sx={{ color: '#4caf50' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={togglePasswordVisibility} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                disabled={loading}
                sx={{
                  backgroundColor: '#4caf50',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  mb: 3,
                  '&:hover': {
                    backgroundColor: '#45a049',
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Demo Button */}
              <Button
                fullWidth
                variant='outlined'
                size='large'
                onClick={() => navigate('/')}
                sx={{
                  borderColor: '#4caf50',
                  color: '#4caf50',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  mb: 3,
                  '&:hover': {
                    borderColor: '#45a049',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  },
                }}
              >
                Cancel
              </Button>

              {/* Links */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant='body2'
                  sx={{ mb: 2, fontFamily: 'Nunito, sans-serif' }}
                >
                  Don't have an account?{' '}
                  <Link
                    component='button'
                    type='button'
                    onClick={() => navigate('/signup')}
                    sx={{
                      color: '#4caf50',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                      fontFamily: 'Nunito, sans-serif',
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  <Link
                    component='button'
                    type='button'
                    onClick={() => navigate('/forgot-password')}
                    sx={{
                      color: '#4caf50',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                      fontFamily: 'Nunito, sans-serif',
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Typography>
              </Box>
            </Box>

            {/* Back to Landing */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant='text'
                onClick={() => navigate('/')}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontFamily: 'Nunito, sans-serif',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                ← Back to Home
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;
