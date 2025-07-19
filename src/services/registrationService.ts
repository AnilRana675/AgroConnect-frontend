import api from './api';

export interface RegistrationStep1Data {
  firstName: string;
  middleName?: string;
  lastName: string;
  sessionId?: string;
}

export interface RegistrationStep2Data {
  province: string;
  district: string;
  municipality: string;
  sessionId: string;
}

export interface RegistrationStep3Data {
  farmerType: string;
  sessionId: string;
}

export interface RegistrationStep4Data {
  economicScale: string;
  sessionId: string;
}

export interface RegistrationStep5Data {
  email: string;
  sessionId: string;
}

export interface RegistrationCompleteData {
  password: string;
  sessionId: string;
}

export interface RegistrationResponse {
  message: string;
  step: number;
  data?: any;
  nextStep?: number;
  user?: any;
  token?: string;
  expiresIn?: string;
  sessionId?: string;
  registrationComplete?: boolean;
}

export interface RegistrationOptions {
  agricultureTypes: string[];
  economicScales: string[];
  states: string[];
}

class RegistrationService {
  // Step 1: Name Registration
  async step1(data: RegistrationStep1Data): Promise<RegistrationResponse> {
    try {
      const response = await api.post('/registration/step1', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Step 1 registration failed',
      );
    }
  }

  // Step 2: Location Registration
  async step2(data: RegistrationStep2Data): Promise<RegistrationResponse> {
    try {
      const response = await api.post('/registration/step2', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Step 2 registration failed',
      );
    }
  }

  // Step 3: Agriculture Type Registration
  async step3(data: RegistrationStep3Data): Promise<RegistrationResponse> {
    try {
      const response = await api.post('/registration/step3', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Step 3 registration failed',
      );
    }
  }

  // Step 4: Economic Scale Registration
  async step4(data: RegistrationStep4Data): Promise<RegistrationResponse> {
    try {
      const response = await api.post('/registration/step4', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Step 4 registration failed',
      );
    }
  }

  // Step 5: Email Registration
  async step5(data: RegistrationStep5Data): Promise<RegistrationResponse> {
    try {
      const response = await api.post('/registration/step5', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Step 5 registration failed',
      );
    }
  }

  // Complete Registration
  async complete(
    data: RegistrationCompleteData,
  ): Promise<RegistrationResponse> {
    try {
      const response = await api.post('/registration/complete', data);

      // Store token and user if registration is complete
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Registration completion failed',
      );
    }
  }

  // Get Registration Progress
  async getProgress(sessionId: string): Promise<any> {
    try {
      const response = await api.get(`/registration/progress/${sessionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get registration progress',
      );
    }
  }

  // Get Registration Options
  async getOptions(): Promise<RegistrationOptions> {
    try {
      const response = await api.get('/registration/options');
      return response.data.options;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get registration options',
      );
    }
  }

  // Generate session ID
  generateSessionId(): string {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

const registrationService = new RegistrationService();
export default registrationService;
