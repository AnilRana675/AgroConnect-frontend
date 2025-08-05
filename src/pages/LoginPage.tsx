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
import { useTranslation } from 'react-i18next';
import { authService } from '../services';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Common styles
const commonStyles = {
  buttonBase: {
    py: 1.5,
    fontSize: '1rem',
    fontWeight: 'bold',
    fontFamily: 'Nunito, sans-serif',
  },
  primaryButton: {
    backgroundColor: '#4caf50',
    '&:hover': { backgroundColor: '#45a049' },
  },
  secondaryButton: {
    backgroundColor: '#43A047',
    color: 'white',
    borderRadius: 2,
    boxShadow: '0 2px 8px 0 rgba(67,160,71,0.15)',
    border: '2px solid #388E3C',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#388E3C',
      boxShadow: '0 4px 16px 0 rgba(67,160,71,0.25)',
    },
  },
  linkStyle: {
    color: '#4caf50',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontFamily: 'Nunito, sans-serif',
    '&:hover': { textDecoration: 'underline' },
  },
};

interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
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
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      if (response.token) {
        navigate('/user');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err: any) {
      setError(err.message || t('login.loginFailed'));
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
      <LanguageSwitcher />
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
                {t('login.welcomeBack')}
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                {t('login.signInAccount')}
              </Typography>
            </Box>

            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
              <TextField
                fullWidth
                label={t('login.emailAddress')}
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder={t('login.enterEmail')}
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
                label={t('login.password')}
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder={t('login.enterPassword')}
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
                  ...commonStyles.buttonBase,
                  ...commonStyles.primaryButton,
                }}
              >
                {loading ? t('login.signingIn') : t('login.signIn')}
              </Button>
            </Box>

            {/* Navigation Links */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography
                variant='body2'
                sx={{ mb: 2, fontFamily: 'Nunito, sans-serif' }}
              >
                {t('login.noAccount')}{' '}
                <Link
                  component='button'
                  onClick={() => navigate('/signup')}
                  sx={commonStyles.linkStyle}
                >
                  {t('login.signUp')}
                </Link>
              </Typography>
              <Typography
                variant='body2'
                sx={{ mb: 2, fontFamily: 'Nunito, sans-serif' }}
              >
                <Link
                  component='button'
                  onClick={() => navigate('/forgot-password')}
                  sx={commonStyles.linkStyle}
                >
                  {t('login.forgotPassword')}
                </Link>
              </Typography>
              <Button
                variant='contained'
                onClick={() => navigate('/')}
                sx={{
                  ...commonStyles.buttonBase,
                  ...commonStyles.secondaryButton,
                  px: 3,
                  mt: 2,
                }}
              >
                {t('login.backToHome')}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;
