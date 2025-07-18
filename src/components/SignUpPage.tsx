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
  MenuItem,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AgricultureOutlined,
  Person,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { allDistricts } from '../constants/nepalDistricts';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmerType: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const farmerTypes = [
    'Crop Farmer',
    'Livestock Farmer',
    'Dairy Farmer',
    'Poultry Farmer',
    'Aquaculture Farmer',
    'Organic Farmer',
    'Greenhouse Farmer',
    'Fruit & Vegetable Farmer',
    'Grain Farmer',
    'Mixed Farmer',
    'Subsistence Farmer',
    'Commercial Farmer',
  ];

  // Use all 77 districts from constants
  const locations = allDistricts.sort(); // Sort alphabetically for better UX

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
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        'http://localhost:3001/api/auth/register',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          farmerType: formData.farmerType,
          location: formData.location,
        },
      );

      if (response.data.success) {
        setSuccess('Account created successfully! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
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
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                backgroundColor: '#4caf50',
                borderRadius: '50%',
                mb: 2,
              }}
            >
              <AgricultureOutlined sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant='h4'
              component='h1'
              sx={{
                fontWeight: 'bold',
                color: '#2e7d32',
                mb: 1,
              }}
            >
              Join AgroConnect
            </Typography>
            <Typography
              variant='body1'
              sx={{
                color: 'text.secondary',
                mb: 2,
              }}
            >
              Create your account and start your farming journey
            </Typography>
          </Box>

          {/* Error/Success Alert */}
          {error && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity='success' sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Sign Up Form */}
          <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label='First Name'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Person sx={{ color: '#4caf50' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label='Last Name'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Person sx={{ color: '#4caf50' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TextField
              fullWidth
              label='Email Address'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Email sx={{ color: '#4caf50' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                select
                label='Farmer Type'
                name='farmerType'
                value={formData.farmerType}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AgricultureOutlined sx={{ color: '#4caf50' }} />
                    </InputAdornment>
                  ),
                }}
              >
                {farmerTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label='Location'
                name='location'
                value={formData.location}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LocationOn sx={{ color: '#4caf50' }} />
                    </InputAdornment>
                  ),
                }}
              >
                {locations.map(location => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              fullWidth
              label='Password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
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

            <TextField
              fullWidth
              label='Confirm Password'
              name='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Lock sx={{ color: '#4caf50' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge='end'
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Links */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Already have an account?{' '}
                <Link
                  component='button'
                  type='button'
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#4caf50',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign In
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
  );
};

export default SignUpPage;
