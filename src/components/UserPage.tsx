import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Container maxWidth='sm'>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant='h3'
            component='h1'
            fontWeight='bold'
            color='#2e7d32'
            mb={2}
          >
            Welcome to Your Dashboard
          </Typography>
          <Typography variant='body1' color='text.secondary' mb={4}>
            Here is where you manage your activities and profile.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            size='large'
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#4caf50',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              mb: 2,
              '&:hover': {
                backgroundColor: '#45a049',
              },
            }}
          >
            Go to Landing Page
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default UserPage;
