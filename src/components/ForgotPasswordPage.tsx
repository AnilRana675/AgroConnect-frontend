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
} from '@mui/material';
import { Email, AgricultureOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        'http://localhost:3001/api/auth/forgot-password',
        { email },
      );

      if (response.data.success) {
        setSuccess(
          'Password reset link has been sent to your email address. Please check your inbox.',
        );
        setEmail('');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to send reset email. Please try again.',
      );
    } finally {
      setLoading(false);
    }
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
              Reset Password
            </Typography>
            <Typography
              variant='body1'
              sx={{
                color: 'text.secondary',
                mb: 2,
              }}
            >
              Enter your email address and we'll send you a link to reset your
              password
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

          {/* Reset Form */}
          <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label='Email Address'
              name='email'
              type='email'
              value={email}
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
              placeholder='Enter your registered email address'
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
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </Button>

            {/* Demo Button - For testing purposes */}
            <Button
              fullWidth
              variant='outlined'
              size='large'
              onClick={() => {
                setSuccess(
                  'Demo: Password reset link sent! (This is a demo message)',
                );
                setEmail('');
              }}
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
              Demo Reset (Skip Email)
            </Button>

            {/* Links */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Remember your password?{' '}
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
              <Typography variant='body2'>
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
                  }}
                >
                  Sign Up
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

export default ForgotPasswordPage;
