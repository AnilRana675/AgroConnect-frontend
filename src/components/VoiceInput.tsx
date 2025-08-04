import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Chip, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  onSend?: (transcript: string) => void;
  disabled?: boolean;
  language?: string;
  autoSend?: boolean;
  compact?: boolean;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onSend,
  disabled = false,
  language = 'en-US',
  autoSend = false,
  compact = false,
}) => {
  const { t, i18n } = useTranslation();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Map language codes
  const getLanguageCode = (lang: string) => {
    switch (lang) {
      case 'ne':
        return 'ne-NP'; // Nepali
      case 'en':
      default:
        return 'en-US'; // English
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognitionInstance = new SpeechRecognition();

        // Configure speech recognition
        recognitionInstance.continuous = false; // Change to false for better detection
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = getLanguageCode(language);
        recognitionInstance.maxAlternatives = 1;

        // Event handlers
        recognitionInstance.onstart = () => {
          setIsListening(true);
          setError(null);
          // Don't clear transcript on start, preserve existing text
        };

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let currentInterimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              currentInterimTranscript += result[0].transcript;
            }
          }

          if (finalTranscript) {
            const newTranscript = transcript + finalTranscript;
            setTranscript(newTranscript);
            onTranscript(newTranscript);

            // Auto-send if enabled and transcript is meaningful
            if (autoSend && onSend && newTranscript.trim().length > 3) {
              setTimeout(() => {
                onSend(newTranscript);
                setTranscript('');
                setInterimTranscript('');
                recognitionInstance.stop();
              }, 1000);
            }
          }

          setInterimTranscript(currentInterimTranscript);
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);

          // Clear timeout on error
          if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
          }

          let errorMessage = t('voice.error');
          switch (event.error) {
            case 'no-speech':
              // Show a gentle message for no speech detected
              setError(
                i18n.language === 'ne'
                  ? 'कुनै आवाज सुनिएन। फेरि प्रयास गर्नुहोस्।'
                  : 'No speech detected. Please try again.',
              );
              break;
            case 'audio-capture':
              errorMessage = t('voice.audioCapture');
              setError(errorMessage);
              break;
            case 'not-allowed':
              errorMessage = t('voice.notAllowed');
              setError(errorMessage);
              break;
            case 'network':
              errorMessage = t('voice.networkError');
              setError(errorMessage);
              break;
            default:
              errorMessage = `${t('voice.error')}: ${event.error}`;
              setError(errorMessage);
          }

          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setIsSupported(false);
        setError(t('voice.notSupported'));
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [language, t]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update language when i18n language changes
  useEffect(() => {
    if (recognition) {
      recognition.lang = getLanguageCode(i18n.language);
    }
  }, [i18n.language, recognition]);

  const startListening = () => {
    if (recognition && !isListening && !disabled) {
      try {
        setError(null);
        setInterimTranscript('');

        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
          setTimeoutId(null);
        }

        // Set a timeout to automatically stop listening after 10 seconds of no speech
        const newTimeoutId = setTimeout(() => {
          if (recognition && isListening) {
            recognition.stop();
            setError(null); // Don't show error for timeout
          }
        }, 10000);
        setTimeoutId(newTimeoutId);

        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError(t('voice.error'));
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      try {
        // Clear timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
          setTimeoutId(null);
        }
        recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  const handleSend = () => {
    if (transcript.trim() && onSend) {
      onSend(transcript);
      setTranscript('');
      setInterimTranscript('');
      if (isListening) {
        stopListening();
      }
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  };

  if (!isSupported) {
    const getBrowserInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('firefox')) {
        return 'Firefox';
      } else if (
        userAgent.includes('safari') &&
        !userAgent.includes('chrome')
      ) {
        return 'Safari';
      } else if (userAgent.includes('edge')) {
        return 'Edge';
      } else if (userAgent.includes('chrome')) {
        return 'Chrome';
      }
      return 'Unknown';
    };

    const browser = getBrowserInfo();

    return (
      <Alert severity='info' sx={{ mt: 1 }}>
        <Typography variant='body2'>
          <strong>{t('voice.notSupported')}</strong>
        </Typography>
        <Typography variant='body2' sx={{ mt: 1 }}>
          {i18n.language === 'ne'
            ? `आवाज इनपुट सुविधा ${browser} मा उपलब्ध छैन। कृपया Google Chrome वा Microsoft Edge प्रयोग गर्नुहोस्।`
            : `Voice input is not available in ${browser}. Please use Google Chrome or Microsoft Edge for voice features.`}
        </Typography>
        <Typography variant='body2' sx={{ mt: 1 }}>
          {i18n.language === 'ne'
            ? 'यद्यपि, तपाईं अझै पनि तल टाइप गरेर प्रश्नहरू सोध्न सक्नुहुन्छ।'
            : 'However, you can still type your questions in the text box below.'}
        </Typography>
      </Alert>
    );
  }

  const displayText = transcript + interimTranscript;

  // Compact mode - minimal UI for integration with existing input
  if (compact) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Simple voice control */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          <IconButton
            onClick={isListening ? stopListening : startListening}
            disabled={disabled}
            color={isListening ? 'error' : 'primary'}
            sx={{
              bgcolor: isListening ? 'error.light' : 'primary.light',
              color: 'white',
              '&:hover': {
                bgcolor: isListening ? 'error.main' : 'primary.main',
              },
            }}
          >
            {isListening ? <StopIcon /> : <MicIcon />}
          </IconButton>

          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ fontSize: 14 }}
          >
            {isListening
              ? i18n.language === 'ne'
                ? 'सुन्दै...'
                : 'Listening...'
              : i18n.language === 'ne'
                ? 'आवाज इनपुट'
                : 'Voice Input'}
          </Typography>

          <Chip
            label={i18n.language === 'ne' ? 'नेपाली' : 'English'}
            size='small'
            color='primary'
            variant='outlined'
          />
        </Box>

        {/* Error Display */}
        {error && (
          <Alert
            severity='warning'
            onClose={() => setError(null)}
            sx={{ fontSize: 12 }}
          >
            <Typography variant='caption'>{error}</Typography>
          </Alert>
        )}

        {/* Instructions when listening */}
        {isListening && !error && (
          <Alert severity='info' sx={{ py: 0.5 }}>
            <Typography variant='caption'>
              {i18n.language === 'ne'
                ? '🎤 अब बोल्नुहोस्...'
                : '🎤 Speak now...'}
            </Typography>
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Initial Usage Tips */}
      {!transcript && !isListening && !error && (
        <Alert severity='info' sx={{ mb: 1 }}>
          <Typography variant='body2'>
            {i18n.language === 'ne'
              ? '💡 आवाज इनपुट प्रयोग गर्न: माइक बटन दबाउनुहोस् र स्पष्ट बोल्नुहोस्। शान्त ठाउँमा बस्नुहोस्।'
              : '💡 To use voice input: Click the microphone button and speak clearly. Use in a quiet environment.'}
          </Typography>
        </Alert>
      )}

      {/* Voice Control Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={isListening ? stopListening : startListening}
          disabled={disabled}
          color={isListening ? 'error' : 'primary'}
          sx={{
            bgcolor: isListening ? 'error.light' : 'primary.light',
            color: 'white',
            '&:hover': {
              bgcolor: isListening ? 'error.main' : 'primary.main',
            },
          }}
        >
          {isListening ? <StopIcon /> : <MicIcon />}
        </IconButton>

        <Typography variant='body2' color='text.secondary'>
          {isListening ? t('voice.listening') : t('voice.clickToStart')}
        </Typography>

        {transcript && (
          <IconButton
            onClick={handleSend}
            disabled={disabled || !transcript.trim()}
            color='primary'
            size='small'
          >
            <SendIcon />
          </IconButton>
        )}

        <Chip
          label={i18n.language === 'ne' ? 'नेपाली' : 'English'}
          size='small'
          color='primary'
          variant='outlined'
        />
      </Box>

      {/* Transcript Display */}
      {displayText && (
        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300',
            minHeight: 60,
          }}
        >
          <Typography variant='body2' color='text.primary'>
            {transcript}
            {interimTranscript && (
              <span style={{ color: '#666', fontStyle: 'italic' }}>
                {interimTranscript}
              </span>
            )}
          </Typography>

          {transcript && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <IconButton onClick={clearTranscript} size='small'>
                <Typography variant='caption'>{t('voice.clear')}</Typography>
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {/* Error Display and Tips */}
      {error && (
        <Alert severity='warning' onClose={() => setError(null)}>
          <Typography variant='body2' sx={{ mb: 1 }}>
            {error}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {i18n.language === 'ne'
              ? 'सुझाव: स्पष्ट र ढिलो बोल्नुहोस्, शान्त ठाउँमा बस्नुहोस्, र माइक्रोफोन नजिक राख्नुहोस्।'
              : 'Tips: Speak clearly and slowly, stay in a quiet environment, and keep microphone close.'}
          </Typography>
        </Alert>
      )}

      {/* Instructions when listening */}
      {isListening && !error && (
        <Alert severity='info'>
          <Typography variant='body2'>
            {i18n.language === 'ne'
              ? '🎤 अब बोल्नुहोस्... स्पष्ट र ढिलो बोल्नुहोस्।'
              : '🎤 Speak now... Talk clearly and at a normal pace.'}
          </Typography>
        </Alert>
      )}

      {/* Status Indicators */}
      {isListening && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'error.main',
              animation: 'pulse 1s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 },
              },
            }}
          />
          <Typography variant='caption' color='text.secondary'>
            {t('voice.recording')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default VoiceInput;
