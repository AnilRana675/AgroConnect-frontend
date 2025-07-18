import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
} from '@mui/material';
import {
  AgricultureOutlined,
  ShoppingCart,
  TrendingUp,
  People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AgricultureOutlined sx={{ fontSize: 40 }} />,
      title: 'Farm Management',
      description:
        'Track your crops, livestock, and farming activities with ease.',
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      title: 'Marketplace',
      description: 'Buy and sell agricultural products directly with farmers.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Market Insights',
      description:
        'Get real-time market prices and trends for better decisions.',
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Community',
      description: 'Connect with other farmers and agricultural experts.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white',
          py: 8,
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth='lg'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant='h1'
                component='h1'
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 'bold',
                  mb: 2,
                }}
              >
                AgroConnect
              </Typography>
              <Typography
                variant='h5'
                component='p'
                sx={{
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  mb: 4,
                  opacity: 0.9,
                }}
              >
                Connecting Farmers to Markets, Technology, and Community
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  fontSize: '1.1rem',
                  mb: 4,
                  opacity: 0.8,
                  lineHeight: 1.6,
                }}
              >
                Join thousands of farmers who are transforming their
                agricultural practices with our comprehensive platform. From
                farm management to market access, we've got you covered.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Button
                  variant='contained'
                  size='large'
                  sx={{
                    backgroundColor: 'white',
                    color: '#2e7d32',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
              </Box>
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: '300px', md: '400px' },
                }}
              >
                {/* Placeholder for hero image */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed rgba(255,255,255,0.3)',
                  }}
                >
                  <Typography variant='h6' sx={{ opacity: 0.7 }}>
                    Hero Image Placeholder
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth='lg' sx={{ py: 8 }}>
        <Typography
          variant='h3'
          component='h2'
          align='center'
          sx={{
            color: '#2e7d32',
            fontWeight: 'bold',
            mb: 6,
          }}
        >
          Why Choose AgroConnect?
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <Box sx={{ color: '#4caf50', mb: 2 }}>{feature.icon}</Box>
              <CardContent sx={{ p: 0 }}>
                <Typography
                  variant='h6'
                  component='h3'
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    color: '#2e7d32',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.5,
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: '#2e7d32',
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth='lg'>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='h4'
              component='h2'
              sx={{
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              Ready to Transform Your Farming?
            </Typography>
            <Typography
              variant='h6'
              sx={{
                mb: 4,
                opacity: 0.9,
              }}
            >
              Join our community of successful farmers today
            </Typography>
            <Button
              variant='contained'
              size='large'
              sx={{
                backgroundColor: 'white',
                color: '#2e7d32',
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
              onClick={() => navigate('/login')}
            >
              Start Your Journey
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
