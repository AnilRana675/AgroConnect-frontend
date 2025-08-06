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
  InputAdornment,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  nepalDistricts,
  getDistrictsByProvince,
} from '../constants/nepalDistricts';
import { registrationService, authService } from '../services';
import LanguageSwitcher from '../components/LanguageSwitcher';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    // Load sessionId from localStorage if present
    const savedSessionId = localStorage.getItem('registrationSessionId');
    if (savedSessionId) setSessionId(savedSessionId);
    const checkSession = async () => {
      try {
        if (authService.isAuthenticated()) {
          navigate('/user');
        }
      } catch (err) {
        console.log('Session check error:', err);
      }
    };
    checkSession();
  }, [navigate]);

  const [step, setStep] = useState(1);
  const [sessionId, setSessionId] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    province: '',
    location: '',
    farmerType: '',
    economicScale: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const economicScales = [
    { value: 'Small', label: 'Small (50,000 – 100,000 NPR)' },
    { value: 'Medium', label: 'Medium (100,001 – 500,000 NPR)' },
    { value: 'Large', label: 'Large (500,001+ NPR)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Reset district if province changes
    if (name === 'province') {
      setFormData(prev => ({
        ...prev,
        province: value,
        location: '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    if (error) setError('');
  };

  const handleNext = async () => {
    setLoading(true);
    setError('');

    try {
      switch (step) {
        case 1:
          if (!formData.firstName || !formData.lastName) {
            setError(t('signup.firstNameRequired'));
            return;
          }
          const step1Response = await registrationService.step1({
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            sessionId:
              (sessionId || localStorage.getItem('registrationSessionId')) ??
              undefined,
          });
          // Robustly extract sessionId from response
          const newSessionId =
            step1Response.sessionId ||
            (step1Response.data && step1Response.data.sessionId);
          if (newSessionId) {
            setSessionId(newSessionId);
            localStorage.setItem('registrationSessionId', newSessionId);
          }
          break;

        case 2:
          if (!formData.province) {
            setError(t('signup.selectProvinceError'));
            return;
          }
          if (!formData.location) {
            setError(t('signup.selectDistrictError'));
            return;
          }
          const sessionIdToSend =
            sessionId || localStorage.getItem('registrationSessionId') || '';
          console.log('Step 2 sessionId:', sessionIdToSend);
          await registrationService.step2({
            province: formData.province,
            district: formData.location,
            municipality: formData.location, // Using district as municipality for now
            sessionId: sessionIdToSend,
          });
          break;

        case 3:
          if (!formData.farmerType) {
            setError(t('signup.selectFarmerTypeError'));
            return;
          }
          await registrationService.step3({
            farmerType: formData.farmerType,
            sessionId:
              sessionId || localStorage.getItem('registrationSessionId') || '',
          });
          break;

        case 4:
          if (!formData.economicScale) {
            setError(t('signup.selectEconomicScaleError'));
            return;
          }
          await registrationService.step4({
            economicScale: formData.economicScale,
            sessionId:
              sessionId || localStorage.getItem('registrationSessionId') || '',
          });
          break;

        case 5:
          if (!formData.email) {
            setError(t('signup.emailRequired'));
            return;
          }
          await registrationService.step5({
            email: formData.email,
            sessionId:
              sessionId || localStorage.getItem('registrationSessionId') || '',
          });
          break;

        case 6:
          if (!formData.password || !formData.confirmPassword) {
            setError(t('signup.passwordRequired'));
            return;
          }
          if (formData.password !== formData.confirmPassword) {
            setError(t('signup.passwordsDontMatch'));
            return;
          }
          if (formData.password.length < 6) {
            setError(t('signup.passwordTooShort'));
            return;
          }

          // Complete registration
          const completeResponse = await registrationService.complete({
            password: formData.password,
            sessionId:
              sessionId || localStorage.getItem('registrationSessionId') || '',
          });

          if (completeResponse.registrationComplete) {
            setSuccess(t('signup.accountCreated'));
            // Show options for email verification or continue to app
            setTimeout(() => {
              const shouldVerify = window.confirm(
                'Registration successful! Would you like to verify your email now for enhanced security features?',
              );
              if (shouldVerify) {
                navigate('/verify-email');
              } else {
                navigate('/user');
              }
            }, 2000);
            return;
          }
          break;

        default:
          break;
      }

      setError('');
      if (step < 6) setStep(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || t('signup.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleNext();
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
                {t('signup.joinAgroConnect')}
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                {t('signup.createAccount')}
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

            {/* Step Form */}
            <form
              onSubmit={step === 6 ? handleSubmit : e => e.preventDefault()}
            >
              {/* Question Number Indicator */}
              {step >= 1 && step <= 6 && (
                <Typography
                  variant='subtitle1'
                  sx={{
                    mb: 1,
                    color: '#388E3C',
                    fontWeight: 'bold',
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  {t('signup.questionOf', { step })}
                </Typography>
              )}
              {step === 1 && (
                <>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}
                  >
                    {t('signup.whatIsYourName')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      label={t('signup.firstName')}
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <TextField
                      fullWidth
                      label={t('signup.middleName')}
                      name='middleName'
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      label={t('signup.lastName')}
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Box>
                </>
              )}
              {step === 2 && (
                <>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}
                  >
                    {t('signup.whichArea')}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label={t('signup.selectProvince')}
                    name='province'
                    value={formData.province}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                  >
                    {Object.keys(nepalDistricts).map(province => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label={t('signup.selectDistrict')}
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    disabled={!formData.province}
                  >
                    {formData.province &&
                      getDistrictsByProvince(formData.province).map(
                        district => (
                          <MenuItem key={district} value={district}>
                            {district}
                          </MenuItem>
                        ),
                      )}
                  </TextField>
                </>
              )}
              {step === 3 && (
                <>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}
                  >
                    {t('signup.whatType')}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label={t('signup.selectFarmerType')}
                    name='farmerType'
                    value={formData.farmerType}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                  >
                    {farmerTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
              {step === 4 && (
                <>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}
                  >
                    {t('signup.economicScale')}
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label={t('signup.selectEconomicScale')}
                    name='economicScale'
                    value={formData.economicScale}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                  >
                    {economicScales.map(scale => (
                      <MenuItem key={scale.value} value={scale.value}>
                        {scale.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
              {step === 5 && (
                <>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}
                  >
                    {t('signup.emailAddress')}
                  </Typography>
                  <TextField
                    fullWidth
                    label={t('signup.emailLabel')}
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                  />
                </>
              )}
              {step === 6 && (
                <>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontFamily: 'Rubik, sans-serif' }}
                  >
                    {t('signup.createPassword')}
                  </Typography>
                  <TextField
                    fullWidth
                    label={t('signup.password')}
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge='end'
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t('signup.confirmPassword')}
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge='end'
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
              >
                {step > 1 && (
                  <Button
                    variant='outlined'
                    onClick={handlePrev}
                    disabled={loading}
                  >
                    {t('signup.previous')}
                  </Button>
                )}
                {step < 6 && (
                  <Button
                    variant='contained'
                    onClick={handleNext}
                    disabled={loading}
                  >
                    {loading ? t('signup.processing') : t('signup.next')}
                  </Button>
                )}
                {step === 6 && (
                  <Button type='submit' variant='contained' disabled={loading}>
                    {loading
                      ? t('signup.creatingAccount')
                      : t('signup.finishSignUp')}
                  </Button>
                )}
              </Box>
            </form>

            {/* Links - Only show on step 1 */}
            {step === 1 && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography
                  variant='body2'
                  sx={{ fontFamily: 'Nunito, sans-serif', mb: 2 }}
                >
                  {t('signup.alreadyHaveAccount')}{' '}
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
                    {t('signup.signIn')}
                  </Link>
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ fontFamily: 'Nunito, sans-serif', mb: 2 }}
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
                    {t('signup.forgotPassword')}
                  </Link>
                </Typography>
                <Button
                  variant='contained'
                  onClick={() => navigate('/')}
                  sx={{
                    backgroundColor: '#43A047',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px 0 rgba(67,160,71,0.15)',
                    border: '2px solid #388E3C',
                    mt: 2,
                    textTransform: 'none',
                    fontFamily: 'Nunito, sans-serif',
                    '&:hover': {
                      backgroundColor: '#388E3C',
                      boxShadow: '0 4px 16px 0 rgba(67,160,71,0.25)',
                    },
                  }}
                >
                  {t('signup.backToHome')}
                </Button>
              </Box>
            )}

            {/* For steps after 1, just show the back to home button */}
            {step > 1 && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant='contained'
                  onClick={() => navigate('/')}
                  sx={{
                    backgroundColor: '#43A047',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px 0 rgba(67,160,71,0.15)',
                    border: '2px solid #388E3C',
                    mt: 2,
                    textTransform: 'none',
                    fontFamily: 'Nunito, sans-serif',
                    '&:hover': {
                      backgroundColor: '#388E3C',
                      boxShadow: '0 4px 16px 0 rgba(67,160,71,0.25)',
                    },
                  }}
                >
                  {t('signup.backToHome')}
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default SignUpPage;
