import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MarkEmailRead } from '@mui/icons-material';
import { emailService } from '../services';

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get email and token from URL params
  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoVerifying, setAutoVerifying] = useState(false);

  const handleAutoVerify = useCallback(async () => {
    setAutoVerifying(true);
    try {
      await emailService.resendVerificationEmail({
        email: emailFromUrl,
      });

      setSuccess(`Verification email has been sent. Please check your inbox.`);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      setAutoVerifying(false);
    }
  }, [emailFromUrl, navigate]);

  // Auto-send verification if email is in URL
  useEffect(() => {
    if (emailFromUrl) {
      handleAutoVerify();
    }
  }, [emailFromUrl, handleAutoVerify]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
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
      await emailService.resendVerificationEmail({ email });
      setSuccess('Verification email sent! Please check your inbox.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(
        err.message || 'Failed to send verification email. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (autoVerifying) {
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
          }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              textAlign: 'center',
              maxWidth: 400,
            }}
          >
            <CircularProgress sx={{ color: '#4caf50', mb: 2 }} size={60} />
            <Typography variant='h6' sx={{ color: '#2e7d32', mb: 1 }}>
              Verifying your email...
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Please wait while we verify your account.
            </Typography>
          </Paper>
        </Box>
      </Box>
    );
  }

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
                <MarkEmailRead sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography
                variant='h4'
                component='h1'
                sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}
              >
                Verify Email
              </Typography>
              <Typography
                variant='body1'
                sx={{ color: 'text.secondary', mb: 2 }}
              >
                Enter your email address to receive a verification link
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

            {/* Verification Form */}
            <Box
              component='form'
              onSubmit={handleVerifySubmit}
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
                {loading ? 'Sending...' : 'Send Verification Email'}
              </Button>
            </Box>

            {/* Links */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Already verified?{' '}
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
                Need to register?{' '}
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

export default EmailVerificationPage;
