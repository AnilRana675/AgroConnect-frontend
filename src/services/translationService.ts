import api from './api';

export interface TranslationRequest {
  text: string;
  fromLanguage: 'en' | 'ne';
  toLanguage: 'en' | 'ne';
}

export interface TranslationResponse {
  success: boolean;
  data: {
    originalText: string;
    translatedText: string;
    fromLanguage: string;
    toLanguage: string;
    confidence: number;
    model: string;
    timestamp: string;
  };
}

export interface LanguageDetectionRequest {
  text: string;
}

export interface LanguageDetectionResponse {
  success: boolean;
  data: {
    text: string;
    detectedLanguage: 'en' | 'ne' | 'unknown';
    confidence: number;
    supportedLanguages: string[];
  };
}

export class TranslationService {
  /**
   * Translate text between English and Nepali
   */
  async translateText(
    request: TranslationRequest,
  ): Promise<TranslationResponse> {
    try {
      const response = await api.post('/translation/translate', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Translation failed');
    }
  }

  /**
   * Detect language of input text
   */
  async detectLanguage(text: string): Promise<LanguageDetectionResponse> {
    try {
      const response = await api.post('/translation/detect-language', {
        text,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 'Language detection failed',
      );
    }
  }

  /**
   * Translate AI response to user's preferred language
   */
  async translateAIResponse(
    aiResponse: string,
    userLanguage: 'en' | 'ne' = 'en',
  ) {
    try {
      const response = await api.post('/translation/translate-ai-response', {
        aiResponse,
        userLanguage,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 'AI response translation failed',
      );
    }
  }

  /**
   * Check translation service status
   */
  async getStatus() {
    try {
      const response = await api.get('/translation/status');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          'Failed to get translation service status',
      );
    }
  }

  /**
   * Translate text to English if it's in Nepali (for AI processing)
   */
  async translateToEnglish(text: string): Promise<string> {
    try {
      // First detect language
      const detection = await this.detectLanguage(text);

      if (detection.data.detectedLanguage === 'ne') {
        // Translate to English
        const translation = await this.translateText({
          text,
          fromLanguage: 'ne',
          toLanguage: 'en',
        });
        return translation.data.translatedText;
      }

      // Return original text if already in English or unknown
      return text;
    } catch (error) {
      console.warn(
        'Translation to English failed, using original text:',
        error,
      );
      return text;
    }
  }

  /**
   * Translate text to user's preferred language
   */
  async translateToUserLanguage(
    text: string,
    userLanguage: 'en' | 'ne',
  ): Promise<string> {
    try {
      if (userLanguage === 'en') {
        return text; // Assume text is already in English
      }

      // Translate to Nepali
      const translation = await this.translateText({
        text,
        fromLanguage: 'en',
        toLanguage: 'ne',
      });

      return translation.data.translatedText;
    } catch (error) {
      console.warn(
        'Translation to user language failed, using original text:',
        error,
      );
      return text;
    }
  }
}

const translationService = new TranslationService();
export default translationService;

// Ensure this file is treated as a module
export {};
