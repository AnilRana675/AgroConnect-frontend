import api from './api';

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationResponse {
  message: string;
  email: string;
  expiresIn: string;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  email: string;
  verifiedAt: string;
}

export interface VerificationStatusResponse {
  email: string;
  isVerified: boolean;
  verifiedAt?: string;
  firstName?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  email: string;
  expiresIn: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  email: string;
  resetAt: string;
}

export interface ValidateResetTokenRequest {
  email: string;
  token: string;
}

export interface ValidateResetTokenResponse {
  message: string;
  isValid: boolean;
  firstName?: string;
  expiresAt: string;
}

class EmailService {
  // Email Verification Methods
  async sendVerificationEmail(
    data: EmailVerificationRequest,
  ): Promise<EmailVerificationResponse> {
    try {
      const response = await api.post(
        '/email-verification/send-verification',
        data,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to send verification email',
      );
    }
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      const response = await api.post('/email-verification/verify', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Email verification failed',
      );
    }
  }

  async resendVerificationEmail(
    data: EmailVerificationRequest,
  ): Promise<EmailVerificationResponse> {
    try {
      const response = await api.post(
        '/email-verification/resend-verification',
        data,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to resend verification email',
      );
    }
  }

  async getVerificationStatus(
    email: string,
  ): Promise<VerificationStatusResponse> {
    try {
      const response = await api.get(
        `/email-verification/verification-status/${encodeURIComponent(email)}`,
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get verification status',
      );
    }
  }

  // Password Reset Methods
  async requestPasswordReset(
    data: PasswordResetRequest,
  ): Promise<PasswordResetResponse> {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to request password reset',
      );
    }
  }

  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async validateResetToken(
    data: ValidateResetTokenRequest,
  ): Promise<ValidateResetTokenResponse> {
    try {
      const response = await api.post('/auth/validate-reset-token', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Token validation failed',
      );
    }
  }
}

const emailService = new EmailService();
export default emailService;
