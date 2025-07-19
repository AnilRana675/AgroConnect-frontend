import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  InputBase,
  IconButton,
  Button,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import axios from 'axios';
import authService from '../services/authService';
import ReactMarkdown from 'react-markdown';

const navItems = [
  { label: 'Question' },
  { label: 'Message' },
  { label: 'Image Query' },
  { label: 'FAQ' },
];

const UserPage: React.FC = () => {
  // Real user profile state
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  // Track if this is the user's first visit (simulate with state)
  const [firstVisit, setFirstVisit] = useState(() => {
    const storedUser = authService.getStoredUser();
    return !(storedUser && storedUser.onboardingStatus);
  });
  // Track which nav item is selected
  const [selectedNav, setSelectedNav] = useState('Question');

  // First-time prompt options
  const promptOptions = [
    'I AM NEW TO FARMING',
    'I ALREADY HAVE AN ESTABLISHED FARM',
    'I AM LOOKING FOR NEW IDEAS & TRENDS',
  ];

  // Chat state
  type Message = { from: 'user' | 'bot'; text: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // Personalized messages state
  const [personalizedTips, setPersonalizedTips] = useState<string | null>(null);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState('');

  // Fetch user profile on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError('');
        const user = await authService.getCurrentUser();
        setUserProfile(user);
      } catch (err: any) {
        setProfileError(err.message || 'Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // On mount, if user has onboardingStatus, set firstVisit to false
  React.useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser && storedUser.onboardingStatus) {
      setFirstVisit(false);
    }
  }, []);

  // Handle onboarding option select
  const handleOnboardingSelect = async (option: string) => {
    try {
      // Get user from localStorage
      const user = authService.getStoredUser();
      if (!user || !user._id) {
        alert('User not found. Please log in again.');
        return;
      }
      // Send onboarding status to backend
      await axios.post(`/api/users/${user._id}/onboarding`, {
        onboardingStatus: option,
      });
      // Update onboardingStatus in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, onboardingStatus: option }),
      );
      setFirstVisit(false);
      // Add a personalized AgroBOT message based on the selected option
      let botMessage = '';
      if (option === 'I AM NEW TO FARMING') {
        botMessage =
          'Welcome to AgroConnect! I am AgroBOT, here to guide you as you begin your farming journey. Ask me anything to get started!';
      } else if (option === 'I ALREADY HAVE AN ESTABLISHED FARM') {
        botMessage =
          'Welcome back to AgroConnect! I am AgroBOT. Let me know what you need help with to grow your established farm.';
      } else if (option === 'I AM LOOKING FOR NEW IDEAS & TRENDS') {
        botMessage =
          'Hi! I am AgroBOT. I can help you discover new ideas, trends, and innovations in agriculture. What would you like to explore today?';
      } else {
        botMessage = 'Hello! I am AgroBOT. How can I assist you today?';
      }
      setMessages([{ from: 'bot', text: botMessage }]);
    } catch (error) {
      // Handle error (show a message, etc.)
      console.error('Failed to update onboarding status', error);
      setFirstVisit(false); // For demo, proceed even if API fails
    }
  };

  // Handle sending a chat message
  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input }]);
      setInput('');
      const user = authService.getStoredUser();
      if (!user || !user._id) {
        setMessages(prev => [
          ...prev,
          { from: 'bot', text: 'User not found. Please log in again.' },
        ]);
        return;
      }
      // Show loading message
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: 'AgroBOT is thinking...' },
      ]);
      try {
        const res = await axios.post('/api/ai/ask', {
          question: input,
          userId: user._id,
        });
        // Remove loading message and add AI response
        setMessages(prev => [
          ...prev.slice(0, -1),
          { from: 'bot', text: res.data.data.answer },
        ]);
      } catch (err) {
        setMessages(prev => [
          ...prev.slice(0, -1),
          {
            from: 'bot',
            text: 'Sorry, AgroBOT could not answer your question.',
          },
        ]);
      }
    }
  };

  // Fetch personalized messages (weekly tips) when 'Message' tab is selected
  React.useEffect(() => {
    const fetchTips = async () => {
      if (selectedNav !== 'Message') return;
      const user = authService.getStoredUser();
      if (!user || !user._id) {
        setTipsError('User not found. Please log in again.');
        setPersonalizedTips(null);
        return;
      }
      setTipsLoading(true);
      setTipsError('');
      try {
        const res = await axios.get(`/api/ai/weekly-tips/${user._id}`);
        setPersonalizedTips(res.data.data?.tips || 'No tips available.');
      } catch (err: any) {
        setTipsError(err.message || 'Failed to load personalized messages.');
        setPersonalizedTips(null);
      } finally {
        setTipsLoading(false);
      }
    };
    fetchTips();
  }, [selectedNav]);

  // Main content for each nav item
  const renderMainContent = () => {
    if (firstVisit) {
      return (
        <Box
          sx={{
            bgcolor: 'rgba(20,30,10,0.85)',
            borderRadius: 8,
            boxShadow: 6,
            px: { xs: 2, sm: 8 },
            py: { xs: 4, sm: 6 },
            minWidth: { xs: '90vw', sm: 500 },
            maxWidth: 600,
            mx: 'auto',
            textAlign: 'center',
            border: '2px solid #2196f3',
          }}
        >
          <Typography
            variant='h5'
            sx={{
              fontWeight: 'bold',
              fontFamily: 'Rubik, sans-serif',
              color: 'white',
              mb: 2,
            }}
          >
            Let’s help you get started…
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {promptOptions.map(option => (
              <Button
                key={option}
                variant='contained'
                sx={{
                  background:
                    'linear-gradient(90deg, #4A7C1B 0%, #29510A 100%)',
                  color: 'white',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 'bold',
                  fontSize: 18,
                  borderRadius: 3,
                  boxShadow: 2,
                  '&:hover': {
                    background:
                      'linear-gradient(90deg, #29510A 0%, #4A7C1B 100%)',
                  },
                }}
                onClick={() => handleOnboardingSelect(option)}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>
      );
    }
    // Main content area after prompt
    return (
      <Box
        sx={{
          bgcolor: 'rgba(20,30,10,0.85)',
          borderRadius: 8,
          boxShadow: 6,
          px: { xs: 2, sm: 8 },
          py: { xs: 4, sm: 6 },
          minWidth: { xs: '90vw', sm: 500 },
          maxWidth: 900,
          mx: 'auto',
          textAlign: 'center',
          border: '2px solid #2196f3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {selectedNav === 'Question' && (
          <>
            {/* Chatbot UI */}
            <Typography
              variant='h3'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 2 }}
            >
              AgroBOT
            </Typography>
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                minHeight: 300,
                maxHeight: 400,
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 3,
                p: 2,
                mb: 2,
                overflowY: 'auto',
                flex: 1,
                whiteSpace: 'pre-line',
                '& p': {
                  margin: '0 0 2px 0',
                },
                '& ul, & ol': {
                  margin: '0 0 2px 16px',
                  padding: 0,
                },
                '& li': {
                  marginBottom: '2px',
                },
              }}
            >
              {messages.length === 0 ? (
                <Typography
                  sx={{
                    color: '#bbb',
                    fontFamily: 'Nunito, sans-serif',
                    mt: 8,
                  }}
                >
                  Start the conversation by typing your question below.
                </Typography>
              ) : (
                messages.map((msg, idx) => (
                  <Typography
                    key={idx}
                    align={msg.from === 'user' ? 'right' : 'left'}
                    sx={{
                      color: msg.from === 'user' ? '#fff' : '#b2ff59',
                      fontFamily: 'Nunito, sans-serif',
                      mb: 1,
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.from === 'bot' ? <b>AgroBOT: </b> : null}
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </Typography>
                ))
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#e6f2d9',
                borderRadius: 3,
                px: 2,
                py: 0.5,
                boxShadow: 2,
                width: { xs: '90%', sm: 400 },
                maxWidth: 500,
                mt: 2,
              }}
            >
              <InputBase
                placeholder='Type your query here...'
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                sx={{
                  flex: 1,
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: 18,
                  color: '#29510A',
                }}
              />
              <IconButton onClick={handleSend}>
                <MicIcon sx={{ color: '#29510A', fontSize: 28 }} />
              </IconButton>
            </Box>
          </>
        )}
        {selectedNav === 'Message' && (
          <Box
            sx={{
              width: '100%',
              maxWidth: 600,
              minHeight: 300,
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: 3,
              p: 2,
              mb: 2,
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              variant='h4'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 2 }}
            >
              Personalized Messages
            </Typography>
            <Box
              sx={{
                width: '100%',
                flex: 1,
                overflowY: 'auto',
                bgcolor: 'rgba(0,0,0,0.10)',
                borderRadius: 2,
                p: 2,
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {tipsLoading ? (
                <Typography
                  sx={{
                    color: '#bbb',
                    fontFamily: 'Nunito, sans-serif',
                    textAlign: 'center',
                  }}
                >
                  Loading personalized tips...
                </Typography>
              ) : tipsError ? (
                <Typography
                  sx={{
                    color: 'red',
                    fontFamily: 'Nunito, sans-serif',
                    textAlign: 'center',
                  }}
                >
                  {tipsError}
                </Typography>
              ) : personalizedTips ? (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  {personalizedTips
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((tip, idx) => (
                      <Typography
                        key={idx}
                        sx={{
                          color: '#b2ff59',
                          fontFamily: 'Nunito, sans-serif',
                          textAlign: 'left',
                          whiteSpace: 'pre-line',
                          background: 'rgba(33,65,0,0.85)',
                          borderRadius: 3,
                          px: 2,
                          py: 1,
                          mb: 1,
                          boxShadow: 2,
                          maxWidth: '100%',
                        }}
                      >
                        <b>AgroBOT:</b> <ReactMarkdown>{tip}</ReactMarkdown>
                      </Typography>
                    ))}
                </Box>
              ) : (
                <Typography
                  sx={{
                    color: '#bbb',
                    fontFamily: 'Nunito, sans-serif',
                    textAlign: 'center',
                  }}
                >
                  No personalized messages yet.
                </Typography>
              )}
            </Box>
          </Box>
        )}
        {selectedNav === 'Image Query' && (
          <Typography
            variant='h3'
            sx={{ color: 'white', fontFamily: 'Rubik, sans-serif' }}
          >
            Image Query area (coming soon)
          </Typography>
        )}
        {selectedNav === 'FAQ' && (
          <Box
            sx={{
              width: '100%',
              maxWidth: 900,
              minHeight: 300,
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: 3,
              p: 3,
              mb: 2,
              overflowY: 'auto',
              flex: 1,
            }}
          >
            <Typography
              variant='h4'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 2 }}
            >
              Frequently Asked Questions (FAQ)
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 1 }}
            >
              1. What is AgroConnect Nepal?
            </Typography>
            <Typography
              sx={{ color: '#eee', fontFamily: 'Nunito, sans-serif', mb: 2 }}
            >
              AgroConnect Nepal is a smart web/mobile platform empowering Nepali
              farmers. We provide personalized agricultural support, relevant
              information, and tools to help you improve practices, increase
              yields, and navigate farming challenges.
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 1 }}
            >
              2. How can AgroConnect Nepal help me?
            </Typography>
            <Typography
              sx={{ color: '#eee', fontFamily: 'Nunito, sans-serif', mb: 2 }}
            >
              We offer tailored information and tools:
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>
                  Personalized Updates: After providing your farm details,
                  receive weekly, personalized tips based on your farm type,
                  location, and crops. This includes crop-specific advice,
                  pest/disease alerts, weather forecasts, and government
                  resource availability, all in Nepali.
                </li>
                <li>
                  Future AI Integration: Our roadmap includes an AI Assistant
                  (voice-based Nepali chatbot), an Image Recognition Tool for
                  crop disease identification, and Yield Prediction & Smart
                  Planning using your farm data.
                </li>
              </ul>
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 1 }}
            >
              3. How do I get started and use the platform effectively?
            </Typography>
            <Typography
              sx={{ color: '#eee', fontFamily: 'Nunito, sans-serif', mb: 2 }}
            >
              <b>Explore & Engage:</b>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>
                  <b>Message Tab:</b> Check the "Messages" tab for your weekly
                  personalized agricultural tips and updates.
                </li>
                <li>
                  <b>Ask Questions:</b> Use the question feature to ask specific
                  queries; our AI/ML will provide personalized answers.
                </li>
                <li>
                  <b>Image Query (Future):</b> Soon, you'll be able to upload
                  images of diseased crops for AI-powered identification and
                  remedies.
                </li>
                <li>Utilize new features as they become available.</li>
                <li>
                  <b>Provide Feedback:</b> Your input helps us improve and grow!
                </li>
              </ul>
              By engaging, you maximize the benefits of AgroConnect Nepal's
              personalized support.
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 1 }}
            >
              4. How can I give feedback?
            </Typography>
            <Typography
              sx={{ color: '#eee', fontFamily: 'Nunito, sans-serif', mb: 2 }}
            >
              We value your input! Please feel free to give feedback to us at{' '}
              <a
                href='mailto:agroconnect.nepal.feedback@gmail.com'
                style={{ color: '#b2ff59' }}
              >
                agroconnect.nepal.feedback@gmail.com
              </a>
              .
            </Typography>
          </Box>
        )}
      </Box>
    );
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
      {/* Layout */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: 120, sm: 200 },
            minWidth: 100,
            background: 'linear-gradient(180deg, #4A7C1B 0%, #29510A 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4,
            px: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ width: '100%', textAlign: 'left' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
              }}
            >
              <img
                src={require('../assets/agroSIDE.png')}
                alt='Logo'
                style={{
                  maxWidth: '90%',
                  maxHeight: '160px',
                  height: 'auto',
                  width: 'auto',
                  display: 'block',
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              {navItems.map(item => (
                <Button
                  key={item.label}
                  onClick={() => setSelectedNav(item.label)}
                  sx={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    color: 'white',
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: 22,
                    mb: 1,
                    fontWeight: selectedNav === item.label ? 'bold' : 'normal',
                    background:
                      selectedNav === item.label ? 'rgba(0,0,0,0.15)' : 'none',
                    borderRadius: 1,
                    px: 2,
                    py: 0.5,
                    '&:hover': {
                      background: 'rgba(0,0,0,0.10)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>
          {/* User info at bottom */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#e6f2d9',
                borderRadius: 2,
                p: 1.2,
                boxShadow: 1,
                minHeight: 48,
                gap: 1.2,
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}
            >
              {profileLoading ? (
                <Typography
                  sx={{
                    color: '#29510A',
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: 16,
                  }}
                >
                  Loading profile...
                </Typography>
              ) : profileError ? (
                <Typography
                  sx={{
                    color: 'red',
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: 16,
                  }}
                >
                  {profileError}
                </Typography>
              ) : userProfile ? (
                <>
                  <Avatar
                    sx={{
                      bgcolor: '#7A8B6F',
                      width: 48,
                      height: 48,
                      fontWeight: 'bold',
                      fontSize: 24,
                      mr: 2,
                    }}
                  >
                    {userProfile.personalInfo?.firstName?.[0] || '?'}
                    {userProfile.personalInfo?.lastName?.[0] || ''}
                  </Avatar>
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography
                      sx={{
                        color: '#29510A',
                        fontWeight: 'bold',
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: 18,
                        lineHeight: 1.2,
                      }}
                    >
                      {userProfile.personalInfo?.firstName}{' '}
                      {userProfile.personalInfo?.lastName}
                    </Typography>
                  </Box>
                </>
              ) : null}
            </Box>
          </Box>
        </Box>
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {renderMainContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default UserPage;
