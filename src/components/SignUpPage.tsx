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
  Visibility,
  VisibilityOff,
  AgricultureOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  nepalDistricts,
  getDistrictsByProvince,
} from '../constants/nepalDistricts';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
    pin: '',
    confirmPin: '',
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

  const economicScales = ['Small', 'Medium', 'Large'];

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

  const handleNext = () => {
    // Validation for each step
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName) {
          setError('First and Last Name are required.');
          return;
        }
        break;
      case 2:
        if (!formData.province) {
          setError('Please select your province.');
          return;
        }
        if (!formData.location) {
          setError('Please select your district.');
          return;
        }
        break;
      case 3:
        if (!formData.farmerType) {
          setError('Please select your farmer type.');
          return;
        }
        break;
      case 4:
        if (!formData.economicScale) {
          setError('Please select your economic scale.');
          return;
        }
        break;
      case 5:
        if (!formData.email) {
          setError('Email is required.');
          return;
        }
        break;
      case 6:
        if (!formData.password || !formData.confirmPassword) {
          setError('Please enter and confirm your password.');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }
        break;
      case 7:
        if (!formData.pin || !formData.confirmPin) {
          setError('Please enter and confirm your 4-digit PIN.');
          return;
        }
        if (formData.pin !== formData.confirmPin) {
          setError('PINs do not match.');
          return;
        }
        if (!/^[0-9]{4}$/.test(formData.pin)) {
          setError('PIN must be exactly 4 digits.');
          return;
        }
        break;
      default:
        break;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        'http://localhost:3001/api/auth/register',
        {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          province: formData.province,
          location: formData.location,
          farmerType: formData.farmerType,
          economicScale: formData.economicScale,
          email: formData.email,
          password: formData.password,
          pin: formData.pin,
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
              Join AgroConnect
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary', mb: 2 }}>
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

          {/* Step Form */}
          <form onSubmit={step === 7 ? handleSubmit : e => e.preventDefault()}>
            {step === 1 && (
              <>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  What is your name?
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label='First Name'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label='Middle Name (optional)'
                    name='middleName'
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label='Last Name'
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
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Which area are you located in?
                </Typography>
                <TextField
                  select
                  fullWidth
                  label='Select your province'
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
                  label='Select your district'
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                  disabled={!formData.province}
                >
                  {formData.province &&
                    getDistrictsByProvince(formData.province).map(district => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                </TextField>
              </>
            )}
            {step === 3 && (
              <>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  What type of agriculture are you primarily involved in?
                </Typography>
                <TextField
                  select
                  fullWidth
                  label='Select farmer type'
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
                <Typography variant='h6' sx={{ mb: 2 }}>
                  What is the economic scale of your agriculture?
                </Typography>
                <TextField
                  select
                  fullWidth
                  label='Select economic scale'
                  name='economicScale'
                  value={formData.economicScale}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                >
                  {economicScales.map(scale => (
                    <MenuItem key={scale} value={scale}>
                      {scale}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}
            {step === 5 && (
              <>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  What is your email address?
                </Typography>
                <TextField
                  fullWidth
                  label='Email Address'
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
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Create a password for your account.
                </Typography>
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
                  label='Confirm Password'
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
            {step === 7 && (
              <>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Create a 4-digit PIN (for password reset)
                </Typography>
                <TextField
                  fullWidth
                  label='4-digit PIN'
                  name='pin'
                  type='password'
                  value={formData.pin}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                  inputProps={{
                    maxLength: 4,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  placeholder='Enter a 4-digit PIN'
                />
                <TextField
                  fullWidth
                  label='Confirm 4-digit PIN'
                  name='confirmPin'
                  type='password'
                  value={formData.confirmPin}
                  onChange={handleChange}
                  required
                  sx={{ mb: 3 }}
                  inputProps={{
                    maxLength: 4,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  placeholder='Re-enter your 4-digit PIN'
                />
                <Typography
                  variant='body2'
                  sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}
                >
                  Please remember this PIN. You will need it to reset your
                  password if you forget it.
                </Typography>
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
                  Previous
                </Button>
              )}
              {step < 7 && (
                <Button
                  variant='contained'
                  onClick={handleNext}
                  disabled={loading}
                >
                  Next
                </Button>
              )}
              {step === 7 && (
                <Button type='submit' variant='contained' disabled={loading}>
                  {loading ? 'Creating Account...' : 'Finish & Sign Up'}
                </Button>
              )}
            </Box>
          </form>

          {/* Links */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant='body2'>
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
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUpPage;
