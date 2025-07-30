import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  InputBase,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ScienceIcon from '@mui/icons-material/Science';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import GrassIcon from '@mui/icons-material/Grass';
import BugReportIcon from '@mui/icons-material/BugReport';
import EcoIcon from '@mui/icons-material/Nature';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import axios from 'axios';
import authService from '../services/authService';
import plantService, {
  PlantIdentificationResult,
} from '../services/plantService';
import ReactMarkdown from 'react-markdown';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Helper function to parse agricultural guide content into sections
const parseAgriculturalGuide = (content: string) => {
  const sections = [];
  const lines = content.split('\n');
  let currentSection = {
    title: '',
    content: '',
    icon: InfoIcon,
    color: '#1976d2',
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for headers that indicate new sections
    if (
      trimmedLine.match(/^#+\s*(cultivation|cultivating|planting|growing)/i)
    ) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: 'Cultivation',
        content: '',
        icon: GrassIcon,
        color: '#388e3c',
      };
    } else if (trimmedLine.match(/^#+\s*(care|maintenance|caring|upkeep)/i)) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: 'Care & Maintenance',
        content: '',
        icon: EcoIcon,
        color: '#689f38',
      };
    } else if (
      trimmedLine.match(/^#+\s*(harvest|harvesting|picking|collecting)/i)
    ) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: 'Harvesting',
        content: '',
        icon: AgricultureIcon,
        color: '#8bc34a',
      };
    } else if (trimmedLine.match(/^#+\s*(growth|growing|development)/i)) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: 'Growth Info',
        content: '',
        icon: LocalFloristIcon,
        color: '#4caf50',
      };
    } else if (
      trimmedLine.match(
        /^#+\s*(issue|issues|problem|problems|pest|disease|common)/i,
      )
    ) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: 'Common Issues',
        content: '',
        icon: BugReportIcon,
        color: '#d32f2f',
      };
    } else if (trimmedLine.match(/^#+\s*(watering|water|irrigation)/i)) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: 'Watering',
        content: '',
        icon: WaterDropIcon,
        color: '#0288d1',
      };
    } else if (trimmedLine.match(/^#+\s*(sunlight|light|sun)/i)) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: 'Sunlight Requirements',
        content: '',
        icon: WbSunnyIcon,
        color: '#f57c00',
      };
    } else if (trimmedLine.match(/^#+\s*(season|time|schedule|timing)/i)) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: 'Seasonal Care',
        content: '',
        icon: ScheduleIcon,
        color: '#7b1fa2',
      };
    } else if (
      trimmedLine.match(
        /^#+\s*(current|condition|diagnosis|health|plant condition|analysis)/i,
      )
    ) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: 'Current Plant Condition & Diagnosis',
        content: '',
        icon: HealthAndSafetyIcon,
        color: '#ff5722',
      };
    } else if (trimmedLine.startsWith('#')) {
      if (currentSection.content || currentSection.title)
        sections.push({ ...currentSection });
      currentSection = {
        title: trimmedLine.replace(/^#+\s*/, ''),
        content: '',
        icon: InfoIcon,
        color: '#1976d2',
      };
    } else if (trimmedLine || line.trim() === '') {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection.content || currentSection.title) {
    sections.push(currentSection);
  }

  // If no sections were created or only one generic section,
  // try to split by common agricultural topics
  if (sections.length <= 1) {
    const fallbackSections = [];

    // Split content by common patterns or create default sections
    const contentLower = content.toLowerCase();

    if (
      contentLower.includes('cultivation') ||
      contentLower.includes('planting')
    ) {
      fallbackSections.push({
        title: 'Cultivation',
        content: extractSectionContent(content, [
          'cultivation',
          'planting',
          'growing',
        ]),
        icon: GrassIcon,
        color: '#388e3c',
      });
    }

    if (contentLower.includes('care') || contentLower.includes('maintenance')) {
      fallbackSections.push({
        title: 'Care & Maintenance',
        content: extractSectionContent(content, [
          'care',
          'maintenance',
          'caring',
        ]),
        icon: EcoIcon,
        color: '#689f38',
      });
    }

    if (contentLower.includes('harvest')) {
      fallbackSections.push({
        title: 'Harvesting',
        content: extractSectionContent(content, [
          'harvest',
          'picking',
          'collecting',
        ]),
        icon: AgricultureIcon,
        color: '#8bc34a',
      });
    }

    if (
      contentLower.includes('issue') ||
      contentLower.includes('problem') ||
      contentLower.includes('pest')
    ) {
      fallbackSections.push({
        title: 'Common Issues',
        content: extractSectionContent(content, [
          'issue',
          'problem',
          'pest',
          'disease',
        ]),
        icon: BugReportIcon,
        color: '#d32f2f',
      });
    }

    if (
      contentLower.includes('condition') ||
      contentLower.includes('diagnosis') ||
      contentLower.includes('health') ||
      contentLower.includes('current')
    ) {
      fallbackSections.push({
        title: 'Current Plant Condition & Diagnosis',
        content: extractSectionContent(content, [
          'condition',
          'diagnosis',
          'health',
          'current',
          'analysis',
          'observe',
        ]),
        icon: HealthAndSafetyIcon,
        color: '#ff5722',
      });
    }

    // If we found specific sections, use them; otherwise use the original content
    if (fallbackSections.length > 0) {
      return fallbackSections;
    }

    // Last resort: return the entire content as general information
    return [
      {
        title: 'Agricultural Information',
        content: content,
        icon: AgricultureIcon,
        color: '#1976d2',
      },
    ];
  }

  return sections;
};

// Helper function to extract content related to specific topics
const extractSectionContent = (content: string, keywords: string[]) => {
  const lines = content.split('\n');
  const relevantLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    // Check if this line contains any of our keywords
    if (keywords.some(keyword => lineLower.includes(keyword))) {
      relevantLines.push(line);

      // Include the next few lines as context
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        if (lines[j].trim() && !lines[j].startsWith('#')) {
          relevantLines.push(lines[j]);
        } else {
          break;
        }
      }
    }
  }

  return relevantLines.length > 0
    ? relevantLines.join('\n')
    : 'No specific information available.';
};

const navItems = [
  { label: 'Question' },
  { label: 'Message' },
  { label: 'Image Query' },
];

const UserPage: React.FC = () => {
  // Real user profile state
  const [userProfile, setUserProfile] = useState<any>(null);
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

  // Personalized messages state with caching
  const [personalizedTips, setPersonalizedTips] = useState<string | null>(null);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState('');
  const [lastTipsFetch, setLastTipsFetch] = useState<number | null>(null);

  // More menu state
  const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);
  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };
  const handleMoreMenuClose = () => {
    setMoreAnchorEl(null);
  };

  // Image Query state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [plantResult, setPlantResult] =
    useState<PlantIdentificationResult | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [imageError, setImageError] = useState<string>('');

  // Fetch user profile on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await authService.getCurrentUser();
        setUserProfile(user);
      } catch (err: any) {
        // ignore error
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

  // Load cached weekly tips on mount
  React.useEffect(() => {
    const loadCachedTips = () => {
      try {
        const cached = localStorage.getItem('agroConnect_weeklyTips');
        if (cached) {
          const { tips, timestamp, userId } = JSON.parse(cached);
          const storedUser = authService.getStoredUser();

          // Only use cached tips if they belong to the current user
          if (storedUser && storedUser._id === userId) {
            const now = Date.now();
            const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

            // Check if cached tips are still valid (less than 1 week old)
            if (now - timestamp < oneWeekInMs) {
              setPersonalizedTips(tips);
              setLastTipsFetch(timestamp);
            } else {
              // Clear expired cache
              localStorage.removeItem('agroConnect_weeklyTips');
            }
          }
        }
      } catch (error) {
        console.error('Error loading cached tips:', error);
        // Clear corrupted cache
        localStorage.removeItem('agroConnect_weeklyTips');
      }
    };

    loadCachedTips();
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

      // Check if we have cached tips and if they're still valid (less than 1 week old)
      const now = Date.now();
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

      if (
        personalizedTips &&
        lastTipsFetch &&
        now - lastTipsFetch < oneWeekInMs
      ) {
        // Use cached tips if they're less than a week old
        return;
      }

      setTipsLoading(true);
      setTipsError('');
      try {
        const res = await axios.get(`/api/ai/weekly-tips/${user._id}`);
        const tips = res.data.data?.tips || 'No tips available.';
        setPersonalizedTips(tips);
        setLastTipsFetch(now);

        // Store in localStorage for persistence across sessions
        localStorage.setItem(
          'agroConnect_weeklyTips',
          JSON.stringify({
            tips,
            timestamp: now,
            userId: user._id,
          }),
        );
      } catch (err: any) {
        setTipsError(err.message || 'Failed to load personalized messages.');
        setPersonalizedTips(null);
      } finally {
        setTipsLoading(false);
      }
    };
    fetchTips();
  }, [selectedNav, personalizedTips, lastTipsFetch]);

  // Image handling functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate the image file
    const validation = plantService.validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || 'Invalid file');
      return;
    }

    setImageError('');
    setSelectedImage(file);
    setPlantResult(null);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleImageRemove = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    setPlantResult(null);
    setImageError('');
  };

  const handlePlantIdentification = async () => {
    if (!selectedImage) {
      setImageError('Please select an image first');
      return;
    }

    setIsIdentifying(true);
    setImageError('');

    try {
      // Convert image to base64
      const base64Image = await plantService.fileToBase64(selectedImage);

      // Call plant identification API
      const result = await plantService.identifyPlant(base64Image);

      setPlantResult(result);

      if (!result.success) {
        setImageError(result.error || 'Failed to identify plant');
      }
    } catch (error) {
      console.error('Plant identification error:', error);
      setImageError('An error occurred while identifying the plant');
    } finally {
      setIsIdentifying(false);
    }
  };

  // Clean up image preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Map onboardingStatus to user-friendly label
  const getFarmerLevelLabel = (status: string | undefined) => {
    if (status === 'I AM NEW TO FARMING') return 'New to Farming';
    if (status === 'I ALREADY HAVE AN ESTABLISHED FARM')
      return 'Has an Established Farm';
    if (status === 'I AM LOOKING FOR NEW IDEAS & TRENDS')
      return 'Looking for ideas';
    return status || 'N/A';
  };

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
        {selectedNav === 'UserInfo' && userProfile && (
          <Box
            sx={{
              width: 'auto',
              maxWidth: 400,
              mx: { xs: 1, sm: 'auto' },
              textAlign: 'left',
              bgcolor: 'rgba(245,255,245,0.97)',
              border: '1.5px solid #c8e6c9',
              borderRadius: { xs: 2, sm: 3 },
              p: { xs: 1.5, sm: 4 },
              mb: 2,
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: '#7A8B6F',
                  width: 56,
                  height: 56,
                  fontWeight: 'bold',
                  fontSize: 28,
                  mr: 2,
                }}
              >
                {userProfile.personalInfo?.firstName?.[0] || '?'}
                {userProfile.personalInfo?.lastName?.[0] || ''}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    color: '#29510A',
                    fontWeight: 'bold',
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: 20,
                    lineHeight: 1.2,
                  }}
                >
                  {userProfile.personalInfo?.firstName}{' '}
                  {userProfile.personalInfo?.middleName || ''}{' '}
                  {userProfile.personalInfo?.lastName}
                </Typography>
                <Typography
                  sx={{
                    color: '#388E3C',
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: 14,
                  }}
                >
                  {userProfile.loginCredentials?.email || 'N/A'}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography
              sx={{
                color: '#222',
                fontFamily: 'Nunito, sans-serif',
                fontSize: 16,
                mb: 1,
              }}
            >
              <b>Province:</b> {userProfile.locationInfo?.province || 'N/A'}
            </Typography>
            <Typography
              sx={{
                color: '#222',
                fontFamily: 'Nunito, sans-serif',
                fontSize: 16,
                mb: 1,
              }}
            >
              <b>District:</b> {userProfile.locationInfo?.district || 'N/A'}
            </Typography>
            <Typography
              sx={{
                color: '#222',
                fontFamily: 'Nunito, sans-serif',
                fontSize: 16,
                mb: 1,
              }}
            >
              <b>Type of Farmer (Sector):</b>{' '}
              {userProfile.farmInfo?.farmerType || 'N/A'}
            </Typography>
            <Typography
              sx={{
                color: '#222',
                fontFamily: 'Nunito, sans-serif',
                fontSize: 16,
                mb: 1,
              }}
            >
              <b>Economic Scale of Farming:</b>{' '}
              {userProfile.farmInfo?.economicScale || 'N/A'}
            </Typography>
            <Typography
              sx={{
                color: '#222',
                fontFamily: 'Nunito, sans-serif',
                fontSize: 16,
                mb: 1,
              }}
            >
              <b>Current Level of Farmer:</b>{' '}
              {getFarmerLevelLabel(userProfile.onboardingStatus)}
            </Typography>
            <Typography
              sx={{
                color: '#222',
                fontFamily: 'Nunito, sans-serif',
                fontSize: 16,
                mb: 1,
              }}
            >
              <b>Email:</b> {userProfile.loginCredentials?.email || 'N/A'}
            </Typography>
          </Box>
        )}
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
          <Box
            sx={{
              width: '100%',
              maxWidth: 800,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography
              variant='h3'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 2 }}
            >
              Plant Identification
            </Typography>

            <Typography
              sx={{
                color: '#bbb',
                fontFamily: 'Nunito, sans-serif',
                textAlign: 'center',
                mb: 2,
              }}
            >
              Upload an image of a plant to get identification and agricultural
              guidance
            </Typography>

            {/* Image Upload Section */}
            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                border: '2px dashed #2196f3',
                borderRadius: 3,
                p: 3,
                textAlign: 'center',
                bgcolor: 'rgba(255,255,255,0.05)',
              }}
            >
              {!imagePreview ? (
                <Box>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    id='image-upload'
                  />
                  <label htmlFor='image-upload'>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                      }}
                    >
                      <CloudUploadIcon
                        sx={{ fontSize: 48, color: '#2196f3' }}
                      />
                      <Typography
                        sx={{
                          color: 'white',
                          fontFamily: 'Nunito, sans-serif',
                          fontSize: 16,
                        }}
                      >
                        Click to upload an image
                      </Typography>
                      <Typography
                        sx={{
                          color: '#bbb',
                          fontFamily: 'Nunito, sans-serif',
                          fontSize: 12,
                        }}
                      >
                        Supports JPEG, PNG, GIF, WebP (max 10MB)
                      </Typography>
                    </Box>
                  </label>
                </Box>
              ) : (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <img
                    src={imagePreview}
                    alt='Selected plant'
                    style={{
                      maxWidth: '100%',
                      maxHeight: 300,
                      borderRadius: 8,
                      objectFit: 'contain',
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant='contained'
                      startIcon={<PhotoCameraIcon />}
                      onClick={handlePlantIdentification}
                      disabled={isIdentifying}
                      sx={{
                        bgcolor: '#4A7C1B',
                        '&:hover': { bgcolor: '#29510A' },
                        fontFamily: 'Nunito, sans-serif',
                      }}
                    >
                      {isIdentifying ? (
                        <>
                          <CircularProgress
                            size={20}
                            color='inherit'
                            sx={{ mr: 1 }}
                          />
                          Identifying...
                        </>
                      ) : (
                        'Identify Plant'
                      )}
                    </Button>
                    <Button
                      variant='outlined'
                      startIcon={<DeleteIcon />}
                      onClick={handleImageRemove}
                      sx={{
                        borderColor: '#f44336',
                        color: '#f44336',
                        '&:hover': {
                          borderColor: '#d32f2f',
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                        },
                        fontFamily: 'Nunito, sans-serif',
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Error Display */}
            {imageError && (
              <Alert severity='error' sx={{ width: '100%', maxWidth: 400 }}>
                {imageError}
              </Alert>
            )}

            {/* Plant Identification Results */}
            {plantResult && (
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 700,
                  bgcolor: 'rgba(255,255,255,0.98)',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                }}
              >
                {plantResult.success && plantResult.data ? (
                  <>
                    {/* Header Section */}
                    <Box
                      sx={{
                        background:
                          'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                        color: 'white',
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <LocalFloristIcon sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography
                          variant='h5'
                          sx={{
                            fontFamily: 'Rubik, sans-serif',
                            fontWeight: 'bold',
                            mb: 0.5,
                          }}
                        >
                          Plant Identified Successfully!
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 14,
                            opacity: 0.9,
                            fontFamily: 'Nunito, sans-serif',
                          }}
                        >
                          Analysis complete • {new Date().toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 0 }}>
                      {/* Warning for non-plant detection */}
                      {!plantResult.data.isPlant && (
                        <Alert
                          severity='warning'
                          icon={<WarningIcon />}
                          sx={{
                            m: 2,
                            borderRadius: 2,
                            '& .MuiAlert-message': {
                              fontFamily: 'Nunito, sans-serif',
                            },
                          }}
                        >
                          This image might not contain a plant. Results may be
                          inaccurate.
                        </Alert>
                      )}

                      {/* Main Content Grid */}
                      <Box sx={{ p: 3 }}>
                        {/* Scientific Name Section */}
                        <Paper
                          elevation={1}
                          sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 3,
                            border: '1px solid #e0e0e0',
                            background:
                              'linear-gradient(145deg, #fafafa 0%, #f5f5f5 100%)',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <ScienceIcon sx={{ color: '#1976d2', mr: 1 }} />
                            <Typography
                              variant='h6'
                              sx={{
                                color: '#1976d2',
                                fontFamily: 'Rubik, sans-serif',
                                fontWeight: 'bold',
                              }}
                            >
                              Scientific Classification
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              color: '#2c3e50',
                              fontFamily: 'Georgia, serif',
                              fontStyle: 'italic',
                              fontSize: 20,
                              fontWeight: 500,
                              letterSpacing: 0.5,
                            }}
                          >
                            {plantResult.data.scientificName ||
                              'Unknown species'}
                          </Typography>
                        </Paper>

                        {/* Common Names Section */}
                        {plantResult.data.commonNames &&
                          plantResult.data.commonNames.length > 0 && (
                            <Paper
                              elevation={1}
                              sx={{
                                p: 3,
                                mb: 3,
                                borderRadius: 3,
                                border: '1px solid #e0e0e0',
                                background:
                                  'linear-gradient(145deg, #fafafa 0%, #f5f5f5 100%)',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 2,
                                }}
                              >
                                <InfoIcon sx={{ color: '#4caf50', mr: 1 }} />
                                <Typography
                                  variant='h6'
                                  sx={{
                                    color: '#4caf50',
                                    fontFamily: 'Rubik, sans-serif',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Common Names
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                }}
                              >
                                {plantResult.data.commonNames.map(
                                  (name, index) => (
                                    <Chip
                                      key={index}
                                      label={name}
                                      variant='outlined'
                                      sx={{
                                        fontFamily: 'Nunito, sans-serif',
                                        fontSize: 14,
                                        fontWeight: 500,
                                        borderColor: '#4caf50',
                                        color: '#2e7d32',
                                        '&:hover': {
                                          backgroundColor: '#e8f5e8',
                                        },
                                      }}
                                    />
                                  ),
                                )}
                              </Box>
                            </Paper>
                          )}

                        {/* Confidence Level Section */}
                        <Paper
                          elevation={1}
                          sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 3,
                            border: '1px solid #e0e0e0',
                            background:
                              'linear-gradient(145deg, #fafafa 0%, #f5f5f5 100%)',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <VerifiedIcon sx={{ color: '#ff9800', mr: 1 }} />
                            <Typography
                              variant='h6'
                              sx={{
                                color: '#ff9800',
                                fontFamily: 'Rubik, sans-serif',
                                fontWeight: 'bold',
                              }}
                            >
                              Confidence Level
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                color:
                                  plantResult.data.confidence > 70
                                    ? '#2e7d32'
                                    : plantResult.data.confidence > 40
                                      ? '#f57c00'
                                      : '#d32f2f',
                                fontFamily: 'Rubik, sans-serif',
                                fontSize: 24,
                                fontWeight: 'bold',
                              }}
                            >
                              {plantResult.data.confidence}%
                            </Typography>
                            <Chip
                              label={
                                plantResult.data.confidence > 70
                                  ? 'High Confidence'
                                  : plantResult.data.confidence > 40
                                    ? 'Medium Confidence'
                                    : 'Low Confidence'
                              }
                              size='small'
                              sx={{
                                backgroundColor:
                                  plantResult.data.confidence > 70
                                    ? '#e8f5e8'
                                    : plantResult.data.confidence > 40
                                      ? '#fff3e0'
                                      : '#ffebee',
                                color:
                                  plantResult.data.confidence > 70
                                    ? '#2e7d32'
                                    : plantResult.data.confidence > 40
                                      ? '#f57c00'
                                      : '#d32f2f',
                                fontWeight: 'bold',
                              }}
                            />
                          </Box>
                          {/* Confidence Bar */}
                          <Box
                            sx={{
                              width: '100%',
                              height: 8,
                              backgroundColor: '#e0e0e0',
                              borderRadius: 4,
                              mt: 2,
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                width: `${plantResult.data.confidence}%`,
                                height: '100%',
                                background:
                                  plantResult.data.confidence > 70
                                    ? 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)'
                                    : plantResult.data.confidence > 40
                                      ? 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)'
                                      : 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)',
                                transition: 'width 0.3s ease-in-out',
                              }}
                            />
                          </Box>
                        </Paper>

                        {/* Agricultural Guide Section */}
                        {plantResult.data.agriGuide && (
                          <Paper
                            elevation={1}
                            sx={{
                              borderRadius: 3,
                              border: '1px solid #e0e0e0',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                background:
                                  'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                color: 'white',
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <AgricultureIcon />
                              <Typography
                                variant='h6'
                                sx={{
                                  fontFamily: 'Rubik, sans-serif',
                                  fontWeight: 'bold',
                                }}
                              >
                                Agricultural Guide
                              </Typography>
                            </Box>
                            <Box sx={{ backgroundColor: '#fafafa' }}>
                              {parseAgriculturalGuide(
                                plantResult.data?.agriGuide || '',
                              ).map((section, index) => {
                                const IconComponent = section.icon;
                                return (
                                  <Accordion
                                    key={index}
                                    defaultExpanded={index === 0}
                                    sx={{
                                      '&:before': { display: 'none' },
                                      boxShadow: 'none',
                                      borderBottom:
                                        index <
                                        parseAgriculturalGuide(
                                          plantResult.data?.agriGuide || '',
                                        ).length -
                                          1
                                          ? '1px solid #e0e0e0'
                                          : 'none',
                                    }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      sx={{
                                        backgroundColor: 'white',
                                        borderLeft: `4px solid ${section.color}`,
                                        '&:hover': {
                                          backgroundColor: '#f5f5f5',
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1.5,
                                        }}
                                      >
                                        <IconComponent
                                          sx={{
                                            color: section.color,
                                            fontSize: 24,
                                          }}
                                        />
                                        <Typography
                                          variant='subtitle1'
                                          sx={{
                                            fontFamily: 'Rubik, sans-serif',
                                            fontWeight: 'bold',
                                            color: section.color,
                                          }}
                                        >
                                          {section.title ||
                                            `Section ${index + 1}`}
                                        </Typography>
                                      </Box>
                                    </AccordionSummary>
                                    <AccordionDetails
                                      sx={{
                                        backgroundColor: 'white',
                                        pt: 0,
                                        pb: 2,
                                        px: 3,
                                        borderLeft: `4px solid ${section.color}`,
                                        borderTop: `1px solid #e0e0e0`,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          textAlign: 'left',
                                          width: '100%',
                                          '& p': {
                                            margin: '8px 0',
                                            fontFamily: 'Nunito, sans-serif',
                                            lineHeight: 1.6,
                                            color: '#333',
                                            fontSize: '14px',
                                            textAlign: 'left',
                                          },
                                          '& ul, & ol': {
                                            margin: '8px 0',
                                            paddingLeft: 24,
                                            marginLeft: 0,
                                            textAlign: 'left',
                                            fontFamily: 'Nunito, sans-serif',
                                            listStylePosition: 'outside',
                                            direction: 'ltr',
                                          },
                                          '& li': {
                                            marginBottom: 4,
                                            lineHeight: 1.5,
                                            color: '#555',
                                            fontSize: '14px',
                                            textAlign: 'left',
                                            listStylePosition: 'outside',
                                            direction: 'ltr',
                                            paddingLeft: 0,
                                            marginLeft: 0,
                                          },
                                          '& h1, & h2, & h3, & h4, & h5, & h6':
                                            {
                                              color: section.color,
                                              marginTop: 12,
                                              marginBottom: 8,
                                              fontFamily: 'Rubik, sans-serif',
                                              fontWeight: 'bold',
                                              fontSize: '16px',
                                            },
                                          '& strong': {
                                            color: section.color,
                                            fontWeight: 'bold',
                                          },
                                          '& em': {
                                            color: '#666',
                                            fontStyle: 'italic',
                                          },
                                        }}
                                      >
                                        <ReactMarkdown
                                          components={{
                                            ul: ({ children }) => (
                                              <ul
                                                style={{
                                                  textAlign: 'left',
                                                  paddingLeft: '24px',
                                                  marginLeft: 0,
                                                  listStylePosition: 'outside',
                                                }}
                                              >
                                                {children}
                                              </ul>
                                            ),
                                            ol: ({ children }) => (
                                              <ol
                                                style={{
                                                  textAlign: 'left',
                                                  paddingLeft: '24px',
                                                  marginLeft: 0,
                                                  listStylePosition: 'outside',
                                                }}
                                              >
                                                {children}
                                              </ol>
                                            ),
                                            li: ({ children }) => (
                                              <li
                                                style={{
                                                  textAlign: 'left',
                                                  listStylePosition: 'outside',
                                                  marginLeft: 0,
                                                  paddingLeft: 0,
                                                }}
                                              >
                                                {children}
                                              </li>
                                            ),
                                          }}
                                        >
                                          {section.content.trim() ||
                                            'No specific information available for this section.'}
                                        </ReactMarkdown>
                                      </Box>
                                    </AccordionDetails>
                                  </Accordion>
                                );
                              })}
                            </Box>
                          </Paper>
                        )}
                      </Box>
                    </CardContent>
                  </>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <WarningIcon
                      sx={{
                        fontSize: 60,
                        color: '#d32f2f',
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant='h5'
                      sx={{
                        color: '#d32f2f',
                        fontFamily: 'Rubik, sans-serif',
                        fontWeight: 'bold',
                        mb: 2,
                      }}
                    >
                      Identification Failed
                    </Typography>
                    <Typography
                      sx={{
                        color: '#666',
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: 16,
                        lineHeight: 1.5,
                        maxWidth: 400,
                        mx: 'auto',
                      }}
                    >
                      {plantResult.error ||
                        'Unable to identify the plant. Please try with a clearer, well-lit image showing the plant clearly.'}
                    </Typography>
                  </Box>
                )}
              </Card>
            )}
          </Box>
        )}
        {selectedNav === 'FAQ' && (
          <Box
            sx={{
              width: 'auto',
              maxWidth: { xs: '95vw', sm: 900 },
              mx: { xs: 1, sm: 'auto' },
              minHeight: 300,
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: 3,
              p: { xs: 1.5, sm: 4 },
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
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${require('../assets/background.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'blur(0.5px) brightness(0.95)',
          zIndex: 1,
        }}
      />
      {/* Green Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background:
            'linear-gradient(180deg, rgba(33,65,0,0.85) 0%, rgba(33,65,0,0.5) 60%, rgba(33,65,0,0) 100%)',
          opacity: 1,
          zIndex: 2,
        }}
      />
      {/* Layout */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        {/* Top Navbar */}
        <Box
          sx={{
            width: '100%',
            minWidth: 'unset',
            background: 'linear-gradient(180deg, #4A7C1B 0%, #29510A 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            py: 1,
            px: 2,
            justifyContent: 'center',
            gap: 1,
            boxShadow: 2,
            position: 'static',
            zIndex: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 },
              overflowX: { xs: 'auto', sm: 'visible' },
              whiteSpace: { xs: 'nowrap', sm: 'normal' },
              pb: { xs: 0.5, sm: 0 },
              mb: { xs: 1, sm: 0 },
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': { height: 4 },
            }}
          >
            {navItems.map(item => (
              <Button
                key={item.label}
                onClick={() => setSelectedNav(item.label)}
                sx={{
                  display: 'inline-block',
                  width: 'auto',
                  minWidth: 'unset',
                  textAlign: { xs: 'center', sm: 'left' },
                  color: 'white',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: { xs: 13, sm: 22 },
                  mb: { xs: 0, sm: 1 },
                  fontWeight: selectedNav === item.label ? 'bold' : 'normal',
                  background:
                    selectedNav === item.label ? 'rgba(0,0,0,0.15)' : 'none',
                  borderRadius: 1,
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.2, sm: 0.5 },
                  mx: { xs: 0.5, sm: 0 },
                  minHeight: { xs: 32, sm: 40 },
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    background: 'rgba(0,0,0,0.10)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            {/* More menu button */}
            <IconButton
              onClick={handleMoreMenuOpen}
              sx={{
                color: 'white',
                ml: { xs: 0.5, sm: 0 },
                minWidth: 0,
                p: { xs: 0.5, sm: 1 },
                fontSize: { xs: 20, sm: 28 },
              }}
              aria-label='more'
              aria-controls='more-menu'
              aria-haspopup='true'
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
          {/* More dropdown menu */}
          <Menu
            id='more-menu'
            anchorEl={moreAnchorEl}
            open={Boolean(moreAnchorEl)}
            onClose={handleMoreMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                setSelectedNav('FAQ');
                handleMoreMenuClose();
              }}
            >
              FAQ
            </MenuItem>
            <Divider />
            {userProfile && (
              <MenuItem
                onClick={() => {
                  setSelectedNav('UserInfo');
                  handleMoreMenuClose();
                }}
                sx={{ display: 'flex', alignItems: 'center', minWidth: 180 }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#7A8B6F',
                    width: 32,
                    height: 32,
                    fontWeight: 'bold',
                    fontSize: 16,
                    mr: 1,
                  }}
                >
                  {userProfile.personalInfo?.firstName?.[0] || '?'}
                  {userProfile.personalInfo?.lastName?.[0] || ''}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      color: '#29510A',
                      fontWeight: 'bold',
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: 14,
                      lineHeight: 1.2,
                    }}
                  >
                    {userProfile.personalInfo?.firstName}{' '}
                    {userProfile.personalInfo?.lastName}
                  </Typography>
                </Box>
              </MenuItem>
            )}
            <MenuItem
              onClick={async () => {
                await authService.logout();
                window.location.href = '/login';
              }}
              sx={{ color: '#29510A' }}
            >
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 'calc(100vh - 64px)', // leave space for navbar
            pt: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: { xs: 1, sm: 4 },
              px: { xs: 1, sm: 2 },
            }}
          >
            {renderMainContent()}
          </Box>
        </Box>
      </Box>

      {/* Logout Menu removed, now in More menu */}
    </Box>
  );
};

export default UserPage;
