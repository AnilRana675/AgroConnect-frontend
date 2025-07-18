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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: pin, 3: password
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4));
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (error) setError('');
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
    if (error) setError('');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }
    try {
      // Replace with your actual email verification API endpoint
      const response = await axios.post(
        'http://localhost:3001/api/auth/check-email',
        { email },
      );
      if (response.data.exists) {
        setStep(2);
        setSuccess('Email verified! Please enter your 4-digit PIN.');
      } else {
        setError('Email not found. Please check and try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (pin.length !== 4) {
      setError('Please enter a valid 4-digit PIN.');
      setLoading(false);
      return;
    }
    try {
      // Replace with your actual PIN verification API endpoint
      const response = await axios.post(
        'http://localhost:3001/api/auth/verify-pin',
        { email, pin },
      );
      if (response.data.success) {
        setStep(3);
        setSuccess('PIN verified! Please enter your new password.');
      } else {
        setError('Invalid PIN. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'PIN verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual password reset API endpoint
      const response = await axios.post(
        'http://localhost:3001/api/auth/reset-password',
        { pin, newPassword },
      );
      if (response.data.success) {
        setSuccess('Password reset successful! You can now sign in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
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
                Reset Password
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                {step === 1
                  ? 'Enter your email address to begin password reset.'
                  : step === 2
                    ? 'Enter your 4-digit PIN to verify your identity.'
                    : 'Enter your new password below.'}
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

            {/* Step 1: Email Entry */}
            {step === 1 && (
              <Box
                component='form'
                onSubmit={handleEmailSubmit}
                sx={{ width: '100%' }}
              >
                <TextField
                  fullWidth
                  label='Email Address'
                  name='email'
                  type='email'
                  value={email}
                  onChange={handleEmailChange}
                  required
                  sx={{ mb: 3 }}
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
                  {loading ? 'Checking...' : 'Next'}
                </Button>
              </Box>
            )}

            {/* Step 2: PIN Entry */}
            {step === 2 && (
              <Box
                component='form'
                onSubmit={handlePinSubmit}
                sx={{ width: '100%' }}
              >
                <TextField
                  fullWidth
                  label='4-digit PIN'
                  name='pin'
                  type='text'
                  value={pin}
                  onChange={handlePinChange}
                  required
                  sx={{ mb: 3 }}
                  inputProps={{
                    maxLength: 4,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  placeholder='Enter your 4-digit PIN'
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
                  {loading ? 'Verifying...' : 'Verify PIN'}
                </Button>
              </Box>
            )}

            {/* Step 3: New Password Entry */}
            {step === 3 && (
              <Box
                component='form'
                onSubmit={handlePasswordSubmit}
                sx={{ width: '100%' }}
              >
                <TextField
                  fullWidth
                  label='New Password'
                  name='newPassword'
                  type='password'
                  value={newPassword}
                  onChange={handlePasswordChange}
                  required
                  sx={{ mb: 3 }}
                  placeholder='Enter your new password'
                />
                <TextField
                  fullWidth
                  label='Confirm New Password'
                  name='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  sx={{ mb: 3 }}
                  placeholder='Confirm your new password'
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
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Box>
            )}

            {/* Links */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant='body2'
                sx={{ mb: 2, fontFamily: 'Nunito, sans-serif' }}
              >
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
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  Sign In
                </Link>
              </Typography>
              <Typography
                variant='body2'
                sx={{ fontFamily: 'Nunito, sans-serif' }}
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
    </Box>
  );
};

export default ForgotPasswordPage;
