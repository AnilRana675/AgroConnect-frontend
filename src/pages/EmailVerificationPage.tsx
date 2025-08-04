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
  const tokenFromUrl = searchParams.get('token') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [token, setToken] = useState(tokenFromUrl);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoVerifying, setAutoVerifying] = useState(false);

  const handleAutoVerify = useCallback(async () => {
    setAutoVerifying(true);
    try {
      await emailService.verifyEmail({
        email: emailFromUrl,
        token: tokenFromUrl,
      });

      setSuccess(`Email verified successfully! Welcome to AgroConnect.`);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(
        'This verification link is invalid or expired. You can request a new one below.',
      );
    } finally {
      setAutoVerifying(false);
    }
  }, [emailFromUrl, tokenFromUrl, navigate]);

  // Auto-verify if token and email are in URL
  useEffect(() => {
    if (tokenFromUrl && emailFromUrl) {
      handleAutoVerify();
    }
  }, [tokenFromUrl, emailFromUrl, handleAutoVerify]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
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

    if (!token.trim()) {
      setError('Please enter the verification token.');
      setLoading(false);
      return;
    }

    try {
      await emailService.verifyEmail({ email, token });
      setSuccess('Email verified successfully! You can now sign in.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(
        err.message ||
          'Verification failed. Please check your token and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await emailService.resendVerificationEmail({ email });
      setSuccess('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email.');
    } finally {
      setLoading(false);
    }
  };

  if (autoVerifying) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
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
    );
  }

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
              <MarkEmailRead sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant='h4'
              component='h1'
              sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}
            >
              Verify Email
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary', mb: 2 }}>
              {tokenFromUrl
                ? 'Your email is being verified...'
                : 'Enter your email and verification token to activate your account.'}
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
          {!tokenFromUrl && (
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
              <TextField
                fullWidth
                label='Verification Token'
                name='token'
                type='text'
                value={token}
                onChange={handleTokenChange}
                required
                sx={{ mb: 3 }}
                placeholder='Enter the verification code from your email'
                helperText='Check your email for the verification token'
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
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>

              {/* Resend Verification */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  variant='body2'
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Didn't receive the email?
                </Typography>
                <Button
                  variant='text'
                  onClick={handleResendVerification}
                  disabled={loading}
                  sx={{
                    color: '#4caf50',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.04)',
                    },
                  }}
                >
                  Resend Verification Email
                </Button>
              </Box>
            </Box>
          )}

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
  );
};

export default EmailVerificationPage;
