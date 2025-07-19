import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backImg from '../assets/background.png';
import farmerImg from '../assets/farmer.png';
import logo from '../assets/agroSIDE.png';
// TODO: Replace this with your own background image asset if desired
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Image - You can replace the URL in backgroundImage with your own asset */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backImg})`,
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
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box sx={{ position: 'fixed', top: 0, left: 0, m: 1, zIndex: 10 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: 120, sm: 180, md: 260, lg: 340, xl: 440 },
              minWidth: { xs: 80, sm: 120, md: 180, lg: 220, xl: 220 },
              maxWidth: '30vw',
              height: 'auto',
            }}
          >
            <img
              src={logo}
              alt='Logo'
              style={{
                width: '100%',
                height: 'auto',
                marginRight: 10,
                borderRadius: 0,
                display: 'block',
              }}
            />
          </Box>
        </Box>
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, md: 8 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 1200,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 4,
            }}
          >
            {/* Text Section */}
            <Box
              sx={{
                flex: 1,
                color: 'white',
                textAlign: { xs: 'center', md: 'left' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Typography
                variant='h4'
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                  fontFamily: 'Rubik, sans-serif',
                  mt: { xs: 10, sm: 6, md: 2, lg: 0 },
                }}
              >
                Grow Your Farm, Grow Your Knowledge.
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  mb: 3,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  maxWidth: 600,
                  mx: { xs: 'auto', md: 0 },
                  fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                This platform empowers farmers with essential knowledge and
                innovative tools. Gain valuable insights, and achieve better
                harvests. Whether you seek modern techniques, market trends, or
                solutions to common farming challenges, we're here to help you
                cultivate success and grow. <br />
              </Typography>
              {/* Move Get Started Button here for better flow */}
              <Button
                variant='contained'
                sx={{
                  backgroundColor: '#43A047',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.4rem',
                  px: 4,
                  py: 2.2,
                  borderRadius: 3,
                  boxShadow: '0 4px 16px 0 rgba(67,160,71,0.25)',
                  border: '2px solid #388E3C',
                  mt: 2,
                  minWidth: 'unset',
                  width: isButtonHovered ? 'auto' : 'auto',
                  transition:
                    'background 0.2s, box-shadow 0.2s, width 0.35s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    backgroundColor: '#388E3C',
                    boxShadow: '0 6px 24px 0 rgba(67,160,71,0.35)',
                  },
                }}
                onClick={() => navigate('/signup')}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <Typography
                  component='span'
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    fontFamily: 'Rubik, sans-serif',
                    fontSize: '2rem',
                  }}
                >
                  Get Started
                  <span
                    style={{
                      marginLeft: isButtonHovered ? 16 : 0,
                      opacity: isButtonHovered ? 1 : 0,
                      fontSize: '1.5em',
                      transition:
                        'margin-left 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
                      display: 'inline-block',
                      width: isButtonHovered ? 'auto' : 0,
                    }}
                  >
                    &rarr;
                  </span>
                </Typography>
              </Button>
            </Box>
            {/* Farmer Illustration - Add white glow */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                alignItems: 'center',
                height: { xs: 200, md: 350 },
                minWidth: 250,
              }}
            >
              <img
                src={farmerImg}
                alt='Farmer'
                style={{
                  width: '100%',
                  maxWidth: 500,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default LandingPage;
