import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: any;
  token: string;
  expiresIn: string;
}

export interface User {
  _id: string;
  personalInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  locationInfo: {
    province: string;
    district: string;
    municipality: string;
  };
  farmInfo: {
    farmerType: string;
    economicScale: string;
  };
  loginCredentials: {
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  onboardingStatus?: string;
}

class AuthService {
  // Login user
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔐 AuthService: Making login request to /auth/login');
      const response = await api.post('/auth/login', credentials);
      console.log('🔐 AuthService: Login API response:', response.data);

      // The backend wraps the response in a data object
      const loginData = response.data.data;
      console.log('🔐 AuthService: Extracted login data:', loginData);

      if (loginData?.token) {
        console.log('🔐 AuthService: Storing token and user in localStorage');
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        console.log(
          '🔐 AuthService: Token stored:',
          loginData.token.substring(0, 20) + '...',
        );

        // Return the expected format for the frontend
        return {
          message: response.data.message,
          user: loginData.user,
          token: loginData.token,
          expiresIn: loginData.expiresIn || '7d',
        };
      } else {
        console.error('🔐 AuthService: No token in response data:', loginData);
        throw new Error('Login failed: No token received');
      }
    } catch (error: any) {
      console.error('🔐 AuthService: Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      console.log(
        '👤 AuthService: Fetching current user profile from /auth/me',
      );
      const response = await api.get('/auth/me');
      console.log('👤 AuthService: Profile API response:', response.data);

      // The backend wraps the response in a data object
      const profileData = response.data.data;
      console.log('👤 AuthService: Extracted profile data:', profileData);

      if (profileData?.user) {
        console.log(
          '👤 AuthService: User profile retrieved successfully:',
          profileData.user.personalInfo?.firstName,
        );
        return profileData.user;
      } else {
        console.error('👤 AuthService: No user in response data:', profileData);
        throw new Error('Failed to get user profile: No user data received');
      }
    } catch (error: any) {
      console.error('👤 AuthService: Profile fetch error:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to get user profile',
      );
    }
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to change password',
      );
    }
  }

  // Verify token
  async verifyToken(token: string): Promise<any> {
    try {
      const response = await api.post('/auth/verify-token', { token });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Token verification failed',
      );
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get stored user
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to request password reset',
      );
    }
  }

  // Reset password with token
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<void> {
    try {
      await api.post('/auth/reset-password', {
        email,
        token,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  // Validate reset token
  async validateResetToken(email: string, token: string): Promise<any> {
    try {
      const response = await api.post('/auth/validate-reset-token', {
        email,
        token,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Token validation failed',
      );
    }
  }
}

const authService = new AuthService();
export default authService;
