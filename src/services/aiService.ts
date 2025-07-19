import api from './api';

export interface AIAdviceRequest {
  question: string;
  userId?: string;
}

export interface AIAdviceResponse {
  success: boolean;
  data: {
    answer: string;
    question: string;
    personalized: boolean;
    userProfile?: any;
    userDetails?: any;
  };
  metadata: {
    requestId: string;
    responseTime: string;
    service: string;
    model: string;
    personalizationApplied: boolean;
    contextType: string;
    timestamp: string;
    apiVersion: string;
  };
  analytics: {
    questionLength: number;
    answerLength: number;
    processingTime: number;
    cached: boolean;
    confidenceScore: number;
  };
}

export interface AIAnonymousRequest {
  question: string;
  location?: string;
  farmerType?: string;
  economicScale?: string;
}

export interface AIDiagnosisRequest {
  description: string;
  cropType?: string;
  location?: string;
  severity?: 'mild' | 'moderate' | 'severe';
}

export interface AIDiagnosisResponse {
  success: boolean;
  data: {
    diagnosis: string;
    symptoms: {
      description: string;
      severity: string;
      riskLevel: string;
      urgency: string;
    };
    cropInfo: {
      type: string;
      affectedArea: string;
      commonDiseases: string[];
    };
    recommendations: {
      immediateActions: string[];
      preventiveMeasures: string[];
      followUpRequired: boolean;
    };
  };
  metadata: any;
  analytics: any;
}

export interface AIWeeklyTipsResponse {
  success: boolean;
  data: {
    tips: string;
    userProfile: any;
    userDetails: any;
    seasonalContext: {
      currentSeason: string;
      weekOfYear: number;
      month: string;
      applicableRegion: string;
    };
  };
  metadata: any;
  analytics: any;
}

export interface AIServiceStatus {
  success: boolean;
  configured: boolean;
  message: string;
  service: {
    name: string;
    provider: string;
    model: string;
    features: string[];
  };
  timestamp: string;
  environment: string;
}

class AIService {
  // Check AI service status
  async getStatus(): Promise<AIServiceStatus> {
    try {
      const response = await api.get('/ai/status');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get AI service status',
      );
    }
  }

  // Get personalized farming advice
  async getAdvice(request: AIAdviceRequest): Promise<AIAdviceResponse> {
    try {
      const response = await api.post('/ai/ask', request);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get farming advice',
      );
    }
  }

  // Get anonymous farming advice
  async getAnonymousAdvice(request: AIAnonymousRequest): Promise<any> {
    try {
      const response = await api.post('/ai/ask-anonymous', request);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Failed to get anonymous farming advice',
      );
    }
  }

  // Diagnose crop disease
  async diagnoseCropDisease(
    request: AIDiagnosisRequest,
  ): Promise<AIDiagnosisResponse> {
    try {
      const response = await api.post('/ai/diagnose', request);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to diagnose crop disease',
      );
    }
  }

  // Get weekly farming tips
  async getWeeklyTips(userId: string): Promise<AIWeeklyTipsResponse> {
    try {
      const response = await api.get(`/ai/weekly-tips/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get weekly tips',
      );
    }
  }

  // Get weekly tips for authenticated user
  async getWeeklyTipsForAuthUser(): Promise<any> {
    try {
      const response = await api.get('/ai/weekly-tips');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get weekly tips',
      );
    }
  }
}

const aiService = new AIService();
export default aiService;
