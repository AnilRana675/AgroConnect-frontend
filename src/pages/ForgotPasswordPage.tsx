import React, { useState, useEffect } from 'react';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AgricultureOutlined } from '@mui/icons-material';
import { emailService } from '../services';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get email and token from URL params (for reset link)
  const emailFromUrl = searchParams.get('email') || '';
  const tokenFromUrl = searchParams.get('token') || '';

  const [step, setStep] = useState(tokenFromUrl ? 2 : 1); // 1: email, 2: new password
  const [email, setEmail] = useState(emailFromUrl);
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate token on mount if present
  useEffect(() => {
    if (tokenFromUrl && emailFromUrl) {
      validateToken();
    }
  }, [tokenFromUrl, emailFromUrl]);

  const validateToken = async () => {
    setLoading(true);
    try {
      const response = await emailService.validateResetToken({
        email: emailFromUrl,
        token: tokenFromUrl,
      });

      if (response.isValid) {
        setStep(2);
        setSuccess(
          `Hi ${response.firstName || 'there'}, you can now set your new password.`,
        );
      } else {
        setError(
          'This reset link is invalid or expired. Please request a new one.',
        );
        setStep(1);
      }
    } catch (err: any) {
      setError(
        'This reset link is invalid or expired. Please request a new one.',
      );
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
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
      const response = await emailService.requestPasswordReset({ email });
      setSuccess(
        'If an account with this email exists, a password reset link has been sent to your email.',
      );
      // Don't automatically advance step - user needs to check email
    } catch (err: any) {
      // Show generic message for security (don't reveal if email exists)
      setSuccess(
        'If an account with this email exists, a password reset link has been sent to your email.',
      );
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

    // If no token from URL, user needs to enter it manually
    if (!token && !tokenFromUrl) {
      setError('Please enter the reset token from your email.');
      setLoading(false);
      return;
    }

    try {
      const response = await emailService.resetPassword({
        email: email,
        token: token || tokenFromUrl,
        newPassword: newPassword,
      });

      setSuccess(
        'Password reset successful! You can now sign in with your new password.',
      );
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(
        err.message ||
          'Password reset failed. Please try again or request a new reset link.',
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
              sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}
            >
              Reset Password
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary', mb: 2 }}>
              {step === 1
                ? "Enter your email address and we'll send you a reset link."
                : tokenFromUrl
                  ? 'Enter your new password below.'
                  : 'Enter the reset token from your email and your new password.'}
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Typography
                variant='body2'
                sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}
              >
                Have a reset token?{' '}
                <Link
                  component='button'
                  type='button'
                  onClick={() => setStep(2)}
                  sx={{
                    color: '#4caf50',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Enter it here
                </Link>
              </Typography>
            </Box>
          )}

          {/* Step 2: Token and New Password Entry */}
          {step === 2 && (
            <Box
              component='form'
              onSubmit={handlePasswordSubmit}
              sx={{ width: '100%' }}
            >
              {!tokenFromUrl && (
                <>
                  <TextField
                    fullWidth
                    label='Email Address'
                    name='email'
                    type='email'
                    value={email}
                    onChange={handleEmailChange}
                    required
                    sx={{ mb: 3 }}
                    placeholder='Enter your email address'
                  />
                  <TextField
                    fullWidth
                    label='Reset Token'
                    name='token'
                    type='text'
                    value={token}
                    onChange={handleTokenChange}
                    required
                    sx={{ mb: 3 }}
                    placeholder='Enter the 6-digit code from your email'
                    helperText='Check your email for the reset token'
                  />
                </>
              )}
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
                helperText='Password must be at least 6 characters'
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
              {!tokenFromUrl && (
                <Typography
                  variant='body2'
                  sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}
                >
                  Need a reset link?{' '}
                  <Link
                    component='button'
                    type='button'
                    onClick={() => setStep(1)}
                    sx={{
                      color: '#4caf50',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Request one
                  </Link>
                </Typography>
              )}
            </Box>
          )}

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
