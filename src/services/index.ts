// Export all services
export { default as api } from './api';
export { default as authService } from './authService';
export { default as registrationService } from './registrationService';
export { default as aiService } from './aiService';

// Export types
export type { LoginData, AuthResponse, User } from './authService';

export type {
  RegistrationStep1Data,
  RegistrationStep2Data,
  RegistrationStep3Data,
  RegistrationStep4Data,
  RegistrationStep5Data,
  RegistrationCompleteData,
  RegistrationResponse,
  RegistrationOptions,
} from './registrationService';

export type {
  AIAdviceRequest,
  AIAdviceResponse,
  AIAnonymousRequest,
  AIDiagnosisRequest,
  AIDiagnosisResponse,
  AIWeeklyTipsResponse,
  AIServiceStatus,
} from './aiService';
