import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Set Nepali as default language on component mount
  useEffect(() => {
    if (!localStorage.getItem('i18nextLng')) {
      i18n.changeLanguage('ne');
    }
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false); // Close the switcher after language change
  };

  const toggleLanguageSwitcher = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 10, sm: 20 },
        left: { xs: 10, sm: 'auto' },
        right: { xs: 'auto', sm: 20 },
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {/* Main Language Button */}
      <Button
        variant='outlined'
        size='small'
        onClick={toggleLanguageSwitcher}
        sx={{
          minWidth: 'auto',
          px: { xs: 1, sm: 2 },
          py: { xs: 0.3, sm: 0.5 },
          fontSize: { xs: '0.6rem', sm: '0.75rem' },
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#4A7C1B',
          borderColor: '#4A7C1B',
          whiteSpace: 'nowrap',
          maxWidth: { xs: '80px', sm: 'none' },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#29510A',
          },
        }}
      >
        {i18n.language === 'en' ? 'भाषा छान्नुहोस्' : 'Choose Language'}
      </Button>

      {/* Language Switcher Dropdown */}
      {isOpen && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            padding: { xs: 1, sm: 1.5 },
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.2s ease-in-out',
            minWidth: { xs: '120px', sm: '140px' },
          }}
        >
          {/* Language Label */}
          <Typography
            sx={{
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              fontWeight: 'bold',
              color: '#4A7C1B',
              textAlign: 'center',
              fontFamily: 'Nunito, sans-serif',
              mb: 0.5,
            }}
          >
            {i18n.language === 'en' ? 'भाषा छान्नुहोस्' : 'Choose Language'}
          </Typography>

          {/* Language Buttons */}
          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
            <Button
              variant={i18n.language === 'en' ? 'contained' : 'outlined'}
              size='small'
              onClick={() => changeLanguage('en')}
              sx={{
                minWidth: 'auto',
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.3, sm: 0.5 },
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                fontWeight: 'bold',
                backgroundColor:
                  i18n.language === 'en' ? '#4A7C1B' : 'transparent',
                color: i18n.language === 'en' ? 'white' : '#4A7C1B',
                borderColor: '#4A7C1B',
                '&:hover': {
                  backgroundColor:
                    i18n.language === 'en'
                      ? '#29510A'
                      : 'rgba(74, 124, 27, 0.1)',
                },
              }}
            >
              EN
            </Button>
            <Button
              variant={i18n.language === 'ne' ? 'contained' : 'outlined'}
              size='small'
              onClick={() => changeLanguage('ne')}
              sx={{
                minWidth: 'auto',
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.3, sm: 0.5 },
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                fontWeight: 'bold',
                backgroundColor:
                  i18n.language === 'ne' ? '#4A7C1B' : 'transparent',
                color: i18n.language === 'ne' ? 'white' : '#4A7C1B',
                borderColor: '#4A7C1B',
                '&:hover': {
                  backgroundColor:
                    i18n.language === 'ne'
                      ? '#29510A'
                      : 'rgba(74, 124, 27, 0.1)',
                },
              }}
            >
              ने
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LanguageSwitcher;
