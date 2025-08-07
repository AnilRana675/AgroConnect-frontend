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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
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
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import GrassIcon from '@mui/icons-material/Grass';
import BugReportIcon from '@mui/icons-material/BugReport';
import EcoIcon from '@mui/icons-material/Nature';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import api from '../services/api';
import aiService from '../services/aiService';
import authService from '../services/authService';
// import translationService from '../services/translationService';
import plantService, {
  PlantIdentificationResult,
} from '../services/plantService';
import ReactMarkdown from 'react-markdown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchTTSAudio } from '../services/TTSServices';
// Translation constants will be handled through i18n

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

const UserPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const navItems = [
    { label: t('user.question') },
    { label: t('user.message') },
    { label: t('user.imageQuery') },
  ];
  // Real user profile state
  const [userProfile, setUserProfile] = useState<any>(null);
  // Track if this is the user's first visit (simulate with state)
  const [firstVisit, setFirstVisit] = useState(() => {
    const storedUser = authService.getStoredUser();
    return !(storedUser && storedUser.onboardingStatus);
  });
  // Track which nav item is selected
  const [selectedNav, setSelectedNav] = useState(t('user.question'));

  // Update selectedNav when language changes to maintain consistency
  React.useEffect(() => {
    // Map the current selectedNav to the new language
    if (selectedNav === 'Question' || selectedNav === 'प्रश्न') {
      setSelectedNav(t('user.question'));
    } else if (selectedNav === 'Message' || selectedNav === 'सन्देश') {
      setSelectedNav(t('user.message'));
    } else if (
      selectedNav === 'Image Query' ||
      selectedNav === 'तस्बिरबाट प्रश्न'
    ) {
      setSelectedNav(t('user.imageQuery'));
    } else if (
      selectedNav === 'FAQ' ||
      selectedNav === 'बारम्बार सोधिने प्रश्नहरू'
    ) {
      setSelectedNav(t('user.faq'));
    } else if (
      selectedNav === 'User Info' ||
      selectedNav === 'प्रयोगकर्ता जानकारी'
    ) {
      setSelectedNav(t('user.userInfo'));
    }
  }, [i18n.language, t, selectedNav]);

  // Sync language preference with backend when i18n language changes
  React.useEffect(() => {
    const syncLanguageWithBackend = async () => {
      try {
        const user = authService.getStoredUser();
        if (user && user._id) {
          // Check if user's stored language differs from current i18n language
          const currentLanguage = i18n.language;
          if (user.preferredLanguage !== currentLanguage) {
            // Update backend
            await api.put('/auth/language', { language: currentLanguage });

            // Update stored user data
            const updatedUser = { ...user, preferredLanguage: currentLanguage };
            authService.setStoredUser(updatedUser);

            console.log(
              `Language preference synced with backend: ${currentLanguage}`,
            );
          }
        }
      } catch (error) {
        console.error(
          'Failed to sync language preference with backend:',
          error,
        );
      }
    };

    syncLanguageWithBackend();
  }, [i18n.language]);

  // First-time prompt options
  const promptOptions = [
    t('user.newToFarming'),
    t('user.establishedFarm'),
    t('user.lookingForIdeas'),
  ];

  // Chat state
  type Message = { from: 'user' | 'bot'; text: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );
  const [interimTranscript, setInterimTranscript] = useState(''); // For displaying interim results
  const [speechSupported, setSpeechSupported] = useState<boolean | null>(null); // null = checking, true/false = result

  // Personalized messages state with caching
  const [personalizedTips, setPersonalizedTips] = useState<string | null>(null);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState('');

  // Handle language switching for cached personalized tips
  React.useEffect(() => {
    const cachedTips = localStorage.getItem('agroConnect_weeklyTips');
    if (cachedTips) {
      try {
        const parsedCache = JSON.parse(cachedTips);
        const tipsMultilingual = parsedCache.tipsMultilingual;
        const user = authService.getStoredUser();

        // Only use cached tips if they belong to the current user
        if (tipsMultilingual && user && parsedCache.userId === user._id) {
          const currentLanguage = i18n.language || 'en';
          let newTips = '';

          if (currentLanguage === 'ne' && tipsMultilingual.ne) {
            newTips = tipsMultilingual.ne;
          } else if (tipsMultilingual.en) {
            newTips = tipsMultilingual.en;
          }

          if (newTips) {
            setPersonalizedTips(newTips);
          }
        }
      } catch (error) {
        console.error('Error parsing cached tips:', error);
      }
    }
  }, [i18n.language]); // Don't include personalizedTips to avoid infinite loops

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
  const [selectedGuideSection, setSelectedGuideSection] = useState<string>('');

  // Update selectedGuideSection when language changes to maintain consistency
  React.useEffect(() => {
    // Map the current selectedGuideSection to the new language
    if (
      selectedGuideSection === 'Scientific Classification' ||
      selectedGuideSection === 'वैज्ञानिक वर्गीकरण'
    ) {
      setSelectedGuideSection('Scientific Classification');
    } else if (
      selectedGuideSection === 'Common Names' ||
      selectedGuideSection === 'सामान्य नामहरू'
    ) {
      setSelectedGuideSection('Common Names');
    } else if (
      selectedGuideSection === 'Confidence Level' ||
      selectedGuideSection === 'विश्वसनीयताको स्तर'
    ) {
      setSelectedGuideSection('Confidence Level');
    }
  }, [i18n.language, selectedGuideSection]);

  // Fetch user profile on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching user profile...');

        // Check if token exists first
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        console.log(
          'Token value:',
          token ? `${token.substring(0, 20)}...` : 'null',
        );

        if (!token) {
          console.log('No token found, redirecting to login');
          window.location.href = '/login';
          return;
        }

        const user = await authService.getCurrentUser();
        console.log('User profile fetched successfully:', user);
        setUserProfile(user);

        // Initialize language from user profile if available
        if (
          user.preferredLanguage &&
          user.preferredLanguage !== i18n.language
        ) {
          console.log(
            `Initializing language from user profile: ${user.preferredLanguage}`,
          );
          i18n.changeLanguage(user.preferredLanguage);
        }
      } catch (err: any) {
        console.error('Failed to fetch user profile:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });

        // If it's a 401, redirect to login
        if (err.response?.status === 401) {
          console.log('Unauthorized - redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    };
    fetchProfile();
  }, [i18n]);

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
          const { tips, timestamp, userId, tipsMultilingual } =
            JSON.parse(cached);
          const storedUser = authService.getStoredUser();

          // Only use cached tips if they belong to the current user
          if (storedUser && storedUser._id === userId) {
            const now = Date.now();
            const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

            // Check if cached tips are still valid (less than 1 week old)
            if (now - timestamp < oneWeekInMs) {
              // Load tips in the user's current language if multilingual data is available
              if (tipsMultilingual) {
                const currentLanguage = i18n.language || 'en';
                let tipsToShow = '';

                if (currentLanguage === 'ne' && tipsMultilingual.ne) {
                  tipsToShow = tipsMultilingual.ne;
                } else if (tipsMultilingual.en) {
                  tipsToShow = tipsMultilingual.en;
                } else {
                  tipsToShow = tips; // Fallback to original tips
                }

                setPersonalizedTips(tipsToShow);
              } else {
                setPersonalizedTips(tips);
              }
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
  }, [i18n.language]); // Add i18n.language to reload cached tips when language changes

  // Initialize speech recognition
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);

        const recognitionInstance = new SpeechRecognition();

        // Configuration
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.maxAlternatives = 1;

        const language = i18n.language === 'ne' ? 'ne-NP' : 'en-US';
        recognitionInstance.lang = language;

        console.log(
          '🎤 Speech recognition initialized with language:',
          language,
        );

        // Event handlers
        recognitionInstance.onstart = () => {
          console.log('🎤 Speech recognition started');
          setIsListening(true);
          setVoiceError(null);
          setInterimTranscript('');
        };

        recognitionInstance.onresult = (event: any) => {
          console.log('🎤 Speech recognition result event:', event);

          let finalTranscript = '';
          let interim = '';

          // Process all results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;

            console.log(
              `🎤 Result ${i}: "${transcript}" (final: ${result.isFinal}, confidence: ${result[0].confidence})`,
            );

            if (result.isFinal) {
              finalTranscript += transcript;
            } else {
              interim += transcript;
            }
          }

          // Update interim results for visual feedback
          setInterimTranscript(interim);

          // Handle final results
          if (finalTranscript) {
            console.log('🎤 Final transcript received:', finalTranscript);

            // Replace the entire input with the final transcript (don't append)
            setInput(finalTranscript.trim());
            setInterimTranscript('');

            // Stop recognition after getting final result
            recognitionInstance.stop();
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('🎤 Speech recognition error:', event.error, event);

          let errorMessage = '';
          switch (event.error) {
            case 'no-speech':
              errorMessage =
                i18n.language === 'ne'
                  ? 'कुनै आवाज सुनिएन। फेरि प्रयास गर्नुहोस्।'
                  : 'No speech detected. Please try again.';
              break;
            case 'not-allowed':
            case 'service-not-allowed':
              errorMessage =
                i18n.language === 'ne'
                  ? 'माइक्रोफोन पहुँच अनुमति चाहिन्छ।'
                  : 'Microphone access is required.';
              break;
            case 'network':
              errorMessage =
                i18n.language === 'ne'
                  ? 'नेटवर्क त्रुटि। इन्टरनेट जडान जाँच गर्नुहोस्।'
                  : 'Network error. Please check your internet connection.';
              break;
            case 'aborted':
              errorMessage =
                i18n.language === 'ne'
                  ? 'आवाज पहिचान रद्द भयो।'
                  : 'Speech recognition was aborted.';
              break;
            case 'audio-capture':
              errorMessage =
                i18n.language === 'ne'
                  ? 'माइक्रोफोन काम गरिरहेको छैन।'
                  : 'Microphone is not working.';
              break;
            default:
              errorMessage =
                i18n.language === 'ne'
                  ? 'आवाज इनपुट त्रुटि।'
                  : 'Voice input error.';
          }

          setVoiceError(errorMessage);
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionInstance.onend = () => {
          console.log('🎤 Speech recognition ended');
          setIsListening(false);
          setInterimTranscript('');
        };

        setRecognition(recognitionInstance);
        console.log('🎤 Speech recognition setup complete');
      } else {
        setSpeechSupported(false);
        console.warn('🎤 Speech recognition not supported in this browser');
        setVoiceError(
          i18n.language === 'ne'
            ? 'यो ब्राउजरमा आवाज पहिचान समर्थित छैन। कृपया Chrome, Edge, वा Safari प्रयोग गर्नुहोस्।'
            : 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
        );
      }
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update recognition language when i18n language changes
  React.useEffect(() => {
    if (recognition) {
      const language = i18n.language === 'ne' ? 'ne-NP' : 'en-US';
      recognition.lang = language;
      console.log('🎤 Updated speech recognition language to:', language);

      // If currently listening, restart with new language
      if (isListening) {
        console.log('🎤 Restarting recognition with new language');
        recognition.stop();
        setTimeout(() => {
          if (!isListening) {
            // Only restart if not already restarted
            try {
              recognition.start();
            } catch (error) {
              console.error('🎤 Error restarting recognition:', error);
            }
          }
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, recognition]); // Remove isListening from dependencies to avoid loops

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
      await api.post(`/users/${user._id}/onboarding`, {
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
      if (option === t('user.newToFarming')) {
        botMessage = t('user.welcomeNewFarming');
      } else if (option === t('user.establishedFarm')) {
        botMessage = t('user.welcomeEstablishedFarm');
      } else if (option === t('user.lookingForIdeas')) {
        botMessage = t('user.welcomeLookingForIdeas');
      } else {
        botMessage = t('user.welcomeDefault');
      }
      setMessages([{ from: 'bot', text: botMessage }]);
    } catch (error) {
      // Handle error (show a message, etc.)
      console.error('Failed to update onboarding status', error);
      setFirstVisit(false); // For demo, proceed even if API fails
    }
  };

  // Voice control functions
  const toggleVoiceInput = () => {
    if (!recognition) {
      console.error('🎤 Speech recognition not initialized');
      setVoiceError(
        i18n.language === 'ne'
          ? 'आवाज पहिचान समर्थित छैन।'
          : 'Speech recognition not supported.',
      );
      return;
    }

    if (isListening) {
      console.log('🎤 Stopping speech recognition');
      recognition.stop();
      setIsListening(false);
      setInterimTranscript('');
    } else {
      console.log('🎤 Starting speech recognition');
      setVoiceError(null);
      setInterimTranscript('');

      // Clear any existing input to avoid confusion
      if (!input.trim()) {
        setInput('');
      }

      try {
        // Ensure recognition is properly configured before starting
        const language = i18n.language === 'ne' ? 'ne-NP' : 'en-US';
        recognition.lang = language;

        recognition.start();
        console.log('🎤 Speech recognition start requested');
      } catch (error) {
        console.error('🎤 Error starting speech recognition:', error);
        setVoiceError(
          i18n.language === 'ne'
            ? 'आवाज इनपुट सुरु गर्न सकिएन।'
            : 'Could not start voice input.',
        );
        setIsListening(false);
      }
    }
  };

  const handleMicClick = () => {
    if (input.trim()) {
      // If there's text, send it
      handleSend();
    } else {
      // If no text, toggle voice input
      toggleVoiceInput();
    }
  };

  // Handle sending a chat message
  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (textToSend.trim()) {
      const userMessage = { from: 'user' as const, text: textToSend };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      const user = authService.getStoredUser();
      if (!user || !user._id) {
        setMessages(prev => [
          ...prev,
          { from: 'bot', text: t('user.userNotFound') },
        ]);
        return;
      }
      // Show loading message
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: t('user.agroBOTThinking') },
      ]);
      try {
        const response = await aiService.getAdvice({
          question: textToSend,
          userId: user._id,
        });
        // Remove loading message and add AI response
        setMessages(prev => [
          ...prev.slice(0, -1),
          { from: 'bot', text: response.data.answer },
        ]);
      } catch (err) {
        setMessages(prev => [
          ...prev.slice(0, -1),
          {
            from: 'bot',
            text: t('user.agroBOTError'),
          },
        ]);
      }
    }
  };

  // Fetch personalized messages (weekly tips) when 'Message' tab is selected
  React.useEffect(() => {
    const fetchTips = async () => {
      if (
        selectedNav !== t('user.message') &&
        selectedNav !== 'Message' &&
        selectedNav !== 'सन्देश'
      )
        return;

      const user = authService.getStoredUser();
      if (!user || !user._id) {
        setTipsError('User not found. Please log in again.');
        setPersonalizedTips(null);
        return;
      }

      // Check if we have cached tips and if they're still valid (less than 1 week old)
      const now = Date.now();
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

      // Check cache first
      const cachedTips = localStorage.getItem('agroConnect_weeklyTips');
      if (cachedTips) {
        try {
          const parsedCache = JSON.parse(cachedTips);
          const { timestamp, userId, tipsMultilingual } = parsedCache;

          // Use cached tips if they're valid and belong to current user
          if (
            userId === user._id &&
            tipsMultilingual &&
            now - timestamp < oneWeekInMs
          ) {
            const currentLanguage = i18n.language || 'en';
            let tips = '';

            if (currentLanguage === 'ne' && tipsMultilingual.ne) {
              tips = tipsMultilingual.ne;
            } else if (tipsMultilingual.en) {
              tips = tipsMultilingual.en;
            }

            if (tips) {
              setPersonalizedTips(tips);
              return; // Use cached version, don't fetch
            }
          }
        } catch (error) {
          console.error('Error parsing cached tips:', error);
          localStorage.removeItem('agroConnect_weeklyTips');
        }
      }

      // Fetch new tips if cache is invalid or missing
      setTipsLoading(true);
      setTipsError('');
      try {
        const res = await api.get(`/ai/weekly-tips/${user._id}`);
        const tipsData =
          res.data.data?.tipsMultilingual || res.data.tipsMultilingual;
        const currentLanguage = i18n.language || 'en';

        // Extract tips in user's current language
        let tips = 'No tips available.';
        if (tipsData) {
          if (currentLanguage === 'ne' && tipsData.ne) {
            tips = tipsData.ne;
          } else if (tipsData.en) {
            tips = tipsData.en;
          } else {
            // Fallback to the single tips format if multilingual isn't available
            tips = res.data.data?.tips || res.data.tips || 'No tips available.';
          }
        } else {
          // Fallback to the single tips format if multilingual isn't available
          tips = res.data.data?.tips || res.data.tips || 'No tips available.';
        }

        setPersonalizedTips(tips);

        // Store both language versions in localStorage for persistence
        localStorage.setItem(
          'agroConnect_weeklyTips',
          JSON.stringify({
            tips,
            tipsMultilingual: tipsData,
            timestamp: now,
            userId: user._id,
          }),
        );
      } catch (err: any) {
        setTipsError(err.message || t('user.tipsError'));
        setPersonalizedTips(null);
      } finally {
        setTipsLoading(false);
      }
    };
    fetchTips();
  }, [selectedNav, t, i18n.language]); // Include i18n.language as required by lint

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
      setImageError(t('user.pleaseSelectImage'));
      return;
    }

    setIsIdentifying(true);
    setImageError('');

    try {
      // Convert image to base64
      const base64Image = await plantService.fileToBase64(selectedImage);

      // Call plant identification API with current language
      const result = await plantService.identifyPlant(
        base64Image,
        i18n.language,
      );

      setPlantResult(result);
      setSelectedGuideSection(''); // Reset selected section for new plant

      if (!result.success) {
        setImageError(result.error || t('user.identificationFailed'));
      }
    } catch (error) {
      console.error('Plant identification error:', error);
      setImageError(t('user.identificationError'));
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
    if (!status) return 'N/A';

    // Use translation keys for multilingual support
    if (status === 'I AM NEW TO FARMING') return t('user.newToFarming');
    if (status === 'I ALREADY HAVE AN ESTABLISHED FARM')
      return t('user.hasEstablishedFarm');
    if (status === 'I AM LOOKING FOR NEW IDEAS & TRENDS')
      return t('user.lookingForIdeas');

    return status;
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
            Let's help you get started…
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
          px: { xs: 1, sm: 8 },
          py: { xs: 4, sm: 6 },
          minWidth: { xs: '95vw', sm: 500 },
          maxWidth: { xs: '95vw', sm: 900 },
          mx: 'auto',
          textAlign: 'center',
          border: '2px solid #2196f3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {selectedNav === t('user.userInfo') && userProfile && (
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
              <b>{t('user.province')}</b>{' '}
              {userProfile.locationInfo?.province || 'N/A'}
            </Typography>
            <Typography
              sx={{
                color: '#222',
                fontFamily: 'Nunito, sans-serif',
                fontSize: 16,
                mb: 1,
              }}
            >
              <b>{t('user.district')}</b>{' '}
              {userProfile.locationInfo?.district || 'N/A'}
            </Typography>
            <Typography
              sx={{
                color: '#222',
                fontFamily: 'Nunito, sans-serif',
                fontSize: 16,
                mb: 1,
              }}
            >
              <b>{t('user.typeOfFarmer')}</b>{' '}
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
              <b>{t('user.economicScaleOfFarming')}</b>{' '}
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
              <b>{t('user.currentLevelOfFarmer')}</b>{' '}
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
              <b>{t('user.email')}</b>{' '}
              {userProfile.loginCredentials?.email || 'N/A'}
            </Typography>
          </Box>
        )}
        {selectedNav === t('user.question') && (
          <>
            {/* Chatbot UI */}
            <Typography
              variant='h3'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 2 }}
            >
              {t('user.agroBOT')}
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
                  {t('user.startConversation')}
                </Typography>
              ) : (
                messages.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      justifyContent:
                        msg.from === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '80%',
                        bgcolor:
                          msg.from === 'user'
                            ? '#4A7C1B'
                            : 'rgba(255,255,255,0.1)',
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        boxShadow: 1,
                        border:
                          msg.from === 'user'
                            ? 'none'
                            : '1px solid rgba(255,255,255,0.2)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Bot message: left-aligned, full width, speaker button bottom right */}
                        {msg.from === 'bot' ? (
                          <Box sx={{ width: '100%' }}>
                            <Typography
                              sx={{
                                color: '#b2ff59',
                                fontFamily: 'Nunito, sans-serif',
                                fontSize: 14,
                                lineHeight: 1.4,
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                                textAlign: 'left',
                                width: '100%',
                                display: 'block',
                              }}
                            >
                              <b>AgroBOT: </b>
                              <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </Typography>
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                mt: 0.5,
                                gap: 1,
                              }}
                            >
                              {isTTSProcessing && !isAudioPlaying && (
                                <Typography
                                  sx={{
                                    color: '#ff9800',
                                    fontFamily: 'Nunito, sans-serif',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    animation: 'pulse 1.5s infinite',
                                    '@keyframes pulse': {
                                      '0%': { opacity: 1 },
                                      '50%': { opacity: 0.5 },
                                      '100%': { opacity: 1 },
                                    },
                                  }}
                                >
                                  PLEASE WAIT...
                                </Typography>
                              )}
                              <IconButton
                                size='medium'
                                disabled={isTTSProcessing || isAudioPlaying}
                                sx={{
                                  background:
                                    isTTSProcessing || isAudioPlaying
                                      ? '#ccc'
                                      : '#fff',
                                  color:
                                    isTTSProcessing || isAudioPlaying
                                      ? '#666'
                                      : '#1976d2',
                                  border: '2px solid #1976d2',
                                  borderRadius: 2,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                                  padding: '4px',
                                  margin: '2px',
                                  transition: 'background 0.2s, color 0.2s',
                                  '&:hover': {
                                    background:
                                      isTTSProcessing || isAudioPlaying
                                        ? '#ccc'
                                        : '#b2ff59',
                                    color:
                                      isTTSProcessing || isAudioPlaying
                                        ? '#666'
                                        : '#222',
                                    borderColor: '#388e3c',
                                  },
                                }}
                                aria-label='Listen to response'
                                onClick={() => handleSpeak(msg.text)}
                              >
                                <span
                                  role='img'
                                  aria-label='speaker'
                                  style={{
                                    fontSize: 28,
                                    filter: 'drop-shadow(0 1px 2px #fff)',
                                  }}
                                >
                                  🔊
                                </span>
                              </IconButton>
                            </Box>
                          </Box>
                        ) : (
                          // User message: right-aligned as before
                          <Typography
                            sx={{
                              color: 'white',
                              fontFamily: 'Nunito, sans-serif',
                              fontSize: 14,
                              lineHeight: 1.4,
                              whiteSpace: 'pre-line',
                              wordBreak: 'break-word',
                              textAlign: 'right',
                              width: '100%',
                              display: 'block',
                            }}
                          >
                            <b>
                              {userProfile?.personalInfo?.firstName || 'You'}
                              :{' '}
                            </b>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
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
                placeholder={
                  isListening
                    ? i18n.language === 'ne'
                      ? 'बोल्नुहोस्...'
                      : 'Listening...'
                    : t('user.typeQuery')
                }
                value={input || interimTranscript}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                sx={{
                  flex: 1,
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: 18,
                  color: interimTranscript ? '#666' : '#29510A', // Gray for interim results
                  fontStyle: interimTranscript ? 'italic' : 'normal',
                  '& input': {
                    textAlign:
                      isListening && !input && !interimTranscript
                        ? 'center'
                        : 'left',
                  },
                }}
                disabled={isListening && !interimTranscript} // Disable typing while listening
              />
              <IconButton
                onClick={handleMicClick}
                disabled={speechSupported === false} // Disable if speech not supported
                sx={{
                  color: isListening ? '#f44336' : '#29510A',
                  opacity: speechSupported === false ? 0.5 : 1,
                  transition: 'all 0.2s',
                  animation: isListening ? 'pulse 1s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
                title={
                  speechSupported === false
                    ? i18n.language === 'ne'
                      ? 'आवाज पहिचान समर्थित छैन'
                      : 'Speech recognition not supported'
                    : isListening
                      ? i18n.language === 'ne'
                        ? 'रोक्नुहोस्'
                        : 'Stop listening'
                      : input.trim()
                        ? i18n.language === 'ne'
                          ? 'पठाउनुहोस्'
                          : 'Send message'
                        : i18n.language === 'ne'
                          ? 'बोल्नुहोस्'
                          : 'Start voice input'
                }
              >
                {isListening ? (
                  <StopIcon sx={{ color: '#f44336', fontSize: 28 }} />
                ) : input.trim() ? (
                  <SendIcon sx={{ color: '#29510A', fontSize: 28 }} />
                ) : (
                  <MicIcon sx={{ color: '#29510A', fontSize: 28 }} />
                )}
              </IconButton>
            </Box>

            {/* Voice Error Display */}
            {voiceError && (
              <Box sx={{ width: { xs: '90%', sm: 400 }, maxWidth: 500, mt: 1 }}>
                <Alert
                  severity='warning'
                  onClose={() => setVoiceError(null)}
                  sx={{ fontSize: 14 }}
                >
                  {voiceError}
                </Alert>
              </Box>
            )}

            {/* Voice Status */}
            {isListening && !voiceError && (
              <Box sx={{ width: { xs: '90%', sm: 400 }, maxWidth: 500, mt: 1 }}>
                <Alert severity='info' sx={{ py: 0.5 }}>
                  <Typography variant='body2'>
                    {i18n.language === 'ne'
                      ? '🎤 सुन्दै... स्पष्ट बोल्नुहोस्।'
                      : '🎤 Listening... Speak clearly.'}
                  </Typography>
                </Alert>
              </Box>
            )}
          </>
        )}
        {selectedNav === t('user.message') && (
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
              {t('user.personalizedMessages')}
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
                  {t('user.loadingTips')}
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
                      <Box
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
                          '& p': { margin: 0 },
                          '& ul, & ol': {
                            paddingLeft: '20px',
                            margin: '8px 0',
                          },
                          '& li': { margin: '4px 0' },
                        }}
                      >
                        <b>{t('user.agroBOT')}:</b>{' '}
                        <ReactMarkdown>{tip}</ReactMarkdown>
                      </Box>
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
                  {t('user.noMessages')}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        {selectedNav === t('user.imageQuery') && (
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: '95vw', sm: 800 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              px: { xs: 1, sm: 2 },
            }}
          >
            <Typography
              variant='h3'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 2 }}
            >
              {t('user.plantIdentification')}
            </Typography>

            <Typography
              sx={{
                color: '#bbb',
                fontFamily: 'Nunito, sans-serif',
                textAlign: 'center',
                mb: 2,
              }}
            >
              {t('user.uploadImageDescription')}
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
                        {t('user.clickToUpload')}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#bbb',
                          fontFamily: 'Nunito, sans-serif',
                          fontSize: 12,
                        }}
                      >
                        {t('user.imageSupport')}
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
                          {t('user.identifying')}
                        </>
                      ) : (
                        t('user.identifyPlant')
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
                      {t('user.remove')}
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
                  maxWidth: { xs: '95vw', sm: 700 },
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
                          {t('user.plantIdentifiedSuccessfully')}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 14,
                            opacity: 0.9,
                            fontFamily: 'Nunito, sans-serif',
                          }}
                        >
                          {t('user.analysisComplete')} •{' '}
                          {new Date().toLocaleDateString()}
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
                                {t('user.agriculturalGuide')}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                backgroundColor: '#fafafa',
                                minHeight: 300,
                              }}
                            >
                              {(() => {
                                const sections = parseAgriculturalGuide(
                                  plantResult.data?.agriGuide || '',
                                );

                                // Debug logging
                                console.log(
                                  'Agricultural Guide Data:',
                                  plantResult.data?.agriGuide,
                                );
                                console.log('Parsed Sections:', sections);

                                // Set default selected section if none is selected
                                if (!selectedGuideSection) {
                                  setSelectedGuideSection(
                                    'Scientific Classification',
                                  );
                                }

                                const currentSection =
                                  sections.find(
                                    section =>
                                      section.title === selectedGuideSection,
                                  ) || sections[0];

                                return (
                                  <>
                                    {/* Content Area */}
                                    <Box
                                      sx={{
                                        p: 3,
                                        minHeight: 250,
                                        maxHeight: 400,
                                        overflowY: 'auto',
                                      }}
                                    >
                                      {selectedGuideSection ===
                                        'Scientific Classification' && (
                                        <Box>
                                          <Typography
                                            sx={{
                                              color: '#2c3e50',
                                              fontFamily: 'Georgia, serif',
                                              fontStyle: 'italic',
                                              fontSize: 24,
                                              fontWeight: 500,
                                              letterSpacing: 0.5,
                                              textAlign: 'center',
                                              mb: 2,
                                            }}
                                          >
                                            {plantResult.data.scientificName ||
                                              'Unknown species'}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              color: '#666',
                                              fontFamily: 'Nunito, sans-serif',
                                              fontSize: 14,
                                              textAlign: 'center',
                                            }}
                                          >
                                            Scientific name of the identified
                                            plant
                                          </Typography>
                                        </Box>
                                      )}

                                      {selectedGuideSection ===
                                        'Common Names' && (
                                        <Box>
                                          <Typography
                                            variant='h6'
                                            sx={{
                                              color: '#4caf50',
                                              fontFamily: 'Rubik, sans-serif',
                                              fontWeight: 'bold',
                                              mb: 2,
                                            }}
                                          >
                                            {t('user.commonNames')}
                                          </Typography>
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              flexWrap: 'wrap',
                                              gap: 1,
                                              justifyContent: 'center',
                                            }}
                                          >
                                            {plantResult.data.commonNames &&
                                            plantResult.data.commonNames
                                              .length > 0 ? (
                                              plantResult.data.commonNames.map(
                                                (name, index) => {
                                                  // If Nepali language, translate common names if possible
                                                  const translatedName =
                                                    i18n.language === 'ne'
                                                      ? name // For now, no mapping, so show original
                                                      : name;
                                                  return (
                                                    <Chip
                                                      key={index}
                                                      label={translatedName}
                                                      variant='outlined'
                                                      sx={{
                                                        fontFamily:
                                                          'Nunito, sans-serif',
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        borderColor: '#4caf50',
                                                        color: '#2e7d32',
                                                        '&:hover': {
                                                          backgroundColor:
                                                            '#e8f5e8',
                                                        },
                                                      }}
                                                    />
                                                  );
                                                },
                                              )
                                            ) : (
                                              <Typography
                                                sx={{
                                                  color: '#666',
                                                  fontStyle: 'italic',
                                                }}
                                              >
                                                No common names available
                                              </Typography>
                                            )}
                                          </Box>
                                        </Box>
                                      )}

                                      {selectedGuideSection ===
                                        'Confidence Level' && (
                                        <Box sx={{ textAlign: 'center' }}>
                                          <Typography
                                            sx={{
                                              color:
                                                plantResult.data.confidence > 70
                                                  ? '#2e7d32'
                                                  : plantResult.data
                                                        .confidence > 40
                                                    ? '#f57c00'
                                                    : '#d32f2f',
                                              fontFamily: 'Rubik, sans-serif',
                                              fontSize: 48,
                                              fontWeight: 'bold',
                                              mb: 2,
                                            }}
                                          >
                                            {plantResult.data.confidence}%
                                          </Typography>
                                          <Chip
                                            label={
                                              plantResult.data.confidence > 70
                                                ? t('user.highConfidence')
                                                : plantResult.data.confidence >
                                                    40
                                                  ? t('user.mediumConfidence')
                                                  : t('user.lowConfidence')
                                            }
                                            size='medium'
                                            sx={{
                                              backgroundColor:
                                                plantResult.data.confidence > 70
                                                  ? '#e8f5e8'
                                                  : plantResult.data
                                                        .confidence > 40
                                                    ? '#fff3e0'
                                                    : '#ffebee',
                                              color:
                                                plantResult.data.confidence > 70
                                                  ? '#2e7d32'
                                                  : plantResult.data
                                                        .confidence > 40
                                                    ? '#f57c00'
                                                    : '#d32f2f',
                                              fontWeight: 'bold',
                                              fontSize: 16,
                                              mb: 3,
                                            }}
                                          />
                                          {/* Confidence Bar */}
                                          <Box
                                            sx={{
                                              width: '100%',
                                              height: 12,
                                              backgroundColor: '#e0e0e0',
                                              borderRadius: 6,
                                              overflow: 'hidden',
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                width: `${plantResult.data.confidence}%`,
                                                height: '100%',
                                                background:
                                                  plantResult.data.confidence >
                                                  70
                                                    ? 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)'
                                                    : plantResult.data
                                                          .confidence > 40
                                                      ? 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)'
                                                      : 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)',
                                                transition:
                                                  'width 0.3s ease-in-out',
                                              }}
                                            />
                                          </Box>
                                        </Box>
                                      )}

                                      {currentSection &&
                                        selectedGuideSection !==
                                          'Scientific Classification' &&
                                        selectedGuideSection !==
                                          'Common Names' &&
                                        selectedGuideSection !==
                                          'Confidence Level' && (
                                          <Box
                                            sx={{
                                              textAlign: 'left',
                                              width: '100%',
                                              '& p': {
                                                margin: '8px 0',
                                                fontFamily:
                                                  'Nunito, sans-serif',
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
                                                fontFamily:
                                                  'Nunito, sans-serif',
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
                                                  color: currentSection.color,
                                                  marginTop: 12,
                                                  marginBottom: 8,
                                                  fontFamily:
                                                    'Rubik, sans-serif',
                                                  fontWeight: 'bold',
                                                  fontSize: '16px',
                                                },
                                              '& strong': {
                                                color: currentSection.color,
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
                                                      listStylePosition:
                                                        'outside',
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
                                                      listStylePosition:
                                                        'outside',
                                                    }}
                                                  >
                                                    {children}
                                                  </ol>
                                                ),
                                                li: ({ children }) => (
                                                  <li
                                                    style={{
                                                      textAlign: 'left',
                                                      listStylePosition:
                                                        'outside',
                                                      marginLeft: 0,
                                                      paddingLeft: 0,
                                                    }}
                                                  >
                                                    {children}
                                                  </li>
                                                ),
                                              }}
                                            >
                                              {currentSection.content.trim() ||
                                                'No specific information available for this section.'}
                                            </ReactMarkdown>
                                          </Box>
                                        )}
                                    </Box>

                                    {/* Bottom Navigation Bar */}
                                    <Box
                                      sx={{
                                        borderTop: '1px solid #e0e0e0',
                                        backgroundColor: 'white',
                                        overflowX: 'auto',
                                        maxWidth: '100%',
                                        '&::-webkit-scrollbar': {
                                          height: 4,
                                        },
                                        '&::-webkit-scrollbar-track': {
                                          backgroundColor: '#f1f1f1',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                          backgroundColor: '#c1c1c1',
                                          borderRadius: 2,
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          gap: { xs: 0.5, sm: 1 },
                                          p: { xs: 0.5, sm: 1 },
                                          minWidth: 'max-content',
                                          maxWidth: '100%',
                                        }}
                                      >
                                        {/* Scientific Classification Button */}
                                        <Button
                                          onClick={() =>
                                            setSelectedGuideSection(
                                              'Scientific Classification',
                                            )
                                          }
                                          variant={
                                            selectedGuideSection ===
                                            'Scientific Classification'
                                              ? 'contained'
                                              : 'outlined'
                                          }
                                          size='small'
                                          sx={{
                                            minWidth: 'auto',
                                            px: { xs: 1, sm: 2 },
                                            py: { xs: 0.5, sm: 1 },
                                            fontSize: {
                                              xs: '0.6rem',
                                              sm: '0.7rem',
                                            },
                                            fontWeight: 'bold',
                                            backgroundColor:
                                              selectedGuideSection ===
                                              'Scientific Classification'
                                                ? '#1976d2'
                                                : 'transparent',
                                            color:
                                              selectedGuideSection ===
                                              'Scientific Classification'
                                                ? 'white'
                                                : '#1976d2',
                                            borderColor: '#1976d2',
                                            borderRadius: 2,
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: { xs: 0.2, sm: 0.5 },
                                            '&:hover': {
                                              backgroundColor:
                                                selectedGuideSection ===
                                                'Scientific Classification'
                                                  ? '#1976d2'
                                                  : 'rgba(25, 118, 210, 0.04)',
                                            },
                                          }}
                                        >
                                          <ScienceIcon
                                            sx={{
                                              fontSize: { xs: 14, sm: 16 },
                                            }}
                                          />
                                          <Typography
                                            sx={{
                                              fontSize: {
                                                xs: '0.5rem',
                                                sm: '0.6rem',
                                              },
                                              fontWeight: 'bold',
                                              lineHeight: 1,
                                            }}
                                          >
                                            Scientific
                                          </Typography>
                                        </Button>

                                        {/* Common Names Button */}
                                        {plantResult.data.commonNames &&
                                          plantResult.data.commonNames.length >
                                            0 && (
                                            <Button
                                              onClick={() =>
                                                setSelectedGuideSection(
                                                  'Common Names',
                                                )
                                              }
                                              variant={
                                                selectedGuideSection ===
                                                'Common Names'
                                                  ? 'contained'
                                                  : 'outlined'
                                              }
                                              size='small'
                                              sx={{
                                                minWidth: 'auto',
                                                px: { xs: 1, sm: 2 },
                                                py: { xs: 0.5, sm: 1 },
                                                fontSize: {
                                                  xs: '0.6rem',
                                                  sm: '0.7rem',
                                                },
                                                fontWeight: 'bold',
                                                backgroundColor:
                                                  selectedGuideSection ===
                                                  'Common Names'
                                                    ? '#4caf50'
                                                    : 'transparent',
                                                color:
                                                  selectedGuideSection ===
                                                  'Common Names'
                                                    ? 'white'
                                                    : '#4caf50',
                                                borderColor: '#4caf50',
                                                borderRadius: 2,
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: { xs: 0.2, sm: 0.5 },
                                                '&:hover': {
                                                  backgroundColor:
                                                    selectedGuideSection ===
                                                    'Common Names'
                                                      ? '#4caf50'
                                                      : 'rgba(76, 175, 80, 0.04)',
                                                },
                                              }}
                                            >
                                              <InfoIcon
                                                sx={{
                                                  fontSize: { xs: 14, sm: 16 },
                                                }}
                                              />
                                              <Typography
                                                sx={{
                                                  fontSize: {
                                                    xs: '0.5rem',
                                                    sm: '0.6rem',
                                                  },
                                                  fontWeight: 'bold',
                                                  lineHeight: 1,
                                                }}
                                              >
                                                Names
                                              </Typography>
                                            </Button>
                                          )}

                                        {/* Confidence Level Button */}
                                        <Button
                                          onClick={() =>
                                            setSelectedGuideSection(
                                              'Confidence Level',
                                            )
                                          }
                                          variant={
                                            selectedGuideSection ===
                                            'Confidence Level'
                                              ? 'contained'
                                              : 'outlined'
                                          }
                                          size='small'
                                          sx={{
                                            minWidth: 'auto',
                                            px: { xs: 1, sm: 2 },
                                            py: { xs: 0.5, sm: 1 },
                                            fontSize: {
                                              xs: '0.6rem',
                                              sm: '0.7rem',
                                            },
                                            fontWeight: 'bold',
                                            backgroundColor:
                                              selectedGuideSection ===
                                              'Confidence Level'
                                                ? '#ff9800'
                                                : 'transparent',
                                            color:
                                              selectedGuideSection ===
                                              'Confidence Level'
                                                ? 'white'
                                                : '#ff9800',
                                            borderColor: '#ff9800',
                                            borderRadius: 2,
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: { xs: 0.2, sm: 0.5 },
                                            '&:hover': {
                                              backgroundColor:
                                                selectedGuideSection ===
                                                'Confidence Level'
                                                  ? '#ff9800'
                                                  : 'rgba(255, 152, 0, 0.04)',
                                            },
                                          }}
                                        >
                                          <VerifiedIcon
                                            sx={{
                                              fontSize: { xs: 14, sm: 16 },
                                            }}
                                          />
                                          <Typography
                                            sx={{
                                              fontSize: {
                                                xs: '0.5rem',
                                                sm: '0.6rem',
                                              },
                                              fontWeight: 'bold',
                                              lineHeight: 1,
                                            }}
                                          >
                                            Confidence
                                          </Typography>
                                        </Button>

                                        {/* Agricultural Guide Sections */}
                                        {sections.map((section, index) => {
                                          const IconComponent = section.icon;
                                          return (
                                            <Button
                                              key={index}
                                              onClick={() =>
                                                setSelectedGuideSection(
                                                  section.title,
                                                )
                                              }
                                              variant={
                                                selectedGuideSection ===
                                                section.title
                                                  ? 'contained'
                                                  : 'outlined'
                                              }
                                              size='small'
                                              sx={{
                                                minWidth: 'auto',
                                                px: { xs: 1, sm: 2 },
                                                py: { xs: 0.5, sm: 1 },
                                                fontSize: {
                                                  xs: '0.6rem',
                                                  sm: '0.7rem',
                                                },
                                                fontWeight: 'bold',
                                                backgroundColor:
                                                  selectedGuideSection ===
                                                  section.title
                                                    ? section.color
                                                    : 'transparent',
                                                color:
                                                  selectedGuideSection ===
                                                  section.title
                                                    ? 'white'
                                                    : section.color,
                                                borderColor: section.color,
                                                borderRadius: 2,
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: { xs: 0.2, sm: 0.5 },
                                                '&:hover': {
                                                  backgroundColor:
                                                    selectedGuideSection ===
                                                    section.title
                                                      ? section.color
                                                      : 'rgba(0, 0, 0, 0.04)',
                                                },
                                              }}
                                            >
                                              <IconComponent
                                                sx={{
                                                  fontSize: { xs: 14, sm: 16 },
                                                }}
                                              />
                                              <Typography
                                                sx={{
                                                  fontSize: {
                                                    xs: '0.5rem',
                                                    sm: '0.6rem',
                                                  },
                                                  fontWeight: 'bold',
                                                  lineHeight: 1,
                                                }}
                                              >
                                                {section.title}
                                              </Typography>
                                            </Button>
                                          );
                                        })}
                                      </Box>
                                    </Box>
                                  </>
                                );
                              })()}
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
        {selectedNav === t('user.faq') && (
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
              {t('user.frequentlyAskedQuestions')}
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 1 }}
            >
              1. {t('user.whatIsAgroConnect')}
            </Typography>
            <Typography
              sx={{ color: '#eee', fontFamily: 'Nunito, sans-serif', mb: 2 }}
            >
              {t('user.agroConnectDescription')}
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 1 }}
            >
              2. {t('user.howCanHelp')}
            </Typography>
            <Typography
              sx={{ color: '#eee', fontFamily: 'Nunito, sans-serif', mb: 2 }}
            >
              {t('user.helpDescription')}
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>{t('user.personalizedUpdates')}</li>
                <li>{t('user.futureAI')}</li>
              </ul>
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 1 }}
            >
              3. {t('user.howToStart')}
            </Typography>
            <Typography
              sx={{ color: '#eee', fontFamily: 'Nunito, sans-serif', mb: 2 }}
            >
              <b>{t('user.exploreEngage')}</b>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>
                  <b>{t('user.messageTab')}</b>
                </li>
                <li>
                  <b>{t('user.askQuestions')}</b>
                </li>
                <li>
                  <b>{t('user.imageQueryFuture')}</b>
                </li>
                <li>{t('user.utilizeFeatures')}</li>
                <li>
                  <b>{t('user.provideFeedback')}</b>
                </li>
              </ul>
              {t('user.engageDescription')}
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: 'white', fontFamily: 'Rubik, sans-serif', mb: 1 }}
            >
              4. {t('user.howToFeedback')}
            </Typography>
            <Typography
              sx={{ color: '#eee', fontFamily: 'Nunito, sans-serif', mb: 2 }}
            >
              {t('user.feedbackDescription')}{' '}
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

  // Inside UserPage component, after other handlers
  const [isTTSProcessing, setIsTTSProcessing] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleSpeak = async (text: string) => {
    if (isTTSProcessing) {
      alert(
        'Please wait, TTS is already processing. Please wait for the current audio to finish.',
      );
      return;
    }

    setIsTTSProcessing(true);

    try {
      const audioBlob = await fetchTTSAudio(
        text,
        'alloy',
        (status: {
          message: string;
          queuePosition?: number;
          estimatedWait?: number;
        }) => {
          // Show status updates to user
          if (status.queuePosition && status.queuePosition > 1) {
            alert(
              `Please wait, you are in queue position ${status.queuePosition}. Estimated wait: ${status.estimatedWait} seconds`,
            );
          } else if (status.message) {
            alert(status.message);
          }
        },
      );

      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);

      // Remove "PLEASE WAIT" when audio starts playing
      audio.onplay = () => {
        setIsTTSProcessing(false);
        setIsAudioPlaying(true);
      };

      // Play audio and re-enable button when finished
      audio.onended = () => {
        setIsTTSProcessing(false);
        setIsAudioPlaying(false);
        URL.revokeObjectURL(url); // Clean up the blob URL
      };

      audio.onerror = () => {
        setIsTTSProcessing(false);
        setIsAudioPlaying(false);
        URL.revokeObjectURL(url);
        alert('Failed to play audio');
      };

      audio.play();
    } catch (err) {
      setIsTTSProcessing(false);
      alert('Failed to play audio: ' + err);
    }
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
            {/* Language Switcher */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#4A7C1B',
                  fontFamily: 'Nunito, sans-serif',
                  mb: 1,
                }}
              >
                {t('user.language')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={i18n.language === 'en' ? 'contained' : 'outlined'}
                  size='small'
                  onClick={() => {
                    i18n.changeLanguage('en');
                    handleMoreMenuClose();
                  }}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.3,
                    fontSize: '0.7rem',
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
                  onClick={() => {
                    i18n.changeLanguage('ne');
                    handleMoreMenuClose();
                  }}
                  sx={{
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.3,
                    fontSize: '0.7rem',
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
            <Divider />
            <MenuItem
              onClick={() => {
                setSelectedNav(t('user.faq'));
                handleMoreMenuClose();
              }}
            >
              {t('user.faq')}
            </MenuItem>
            <Divider />
            {userProfile && (
              <MenuItem
                onClick={() => {
                  setSelectedNav(t('user.userInfo'));
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
            {/* Add fallback profile menu item when userProfile is not loaded */}
            {!userProfile && (
              <MenuItem
                onClick={() => {
                  setSelectedNav(t('user.userInfo'));
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
                  ?
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
                    Profile (Loading...)
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
              {t('user.logout')}
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
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: { xs: 1, sm: 4 },
              px: { xs: 0.5, sm: 2 },
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
