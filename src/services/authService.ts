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
      const response = await api.post('/auth/login', credentials);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
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
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
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
}

const authService = new AuthService();
export default authService;
