import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  farmType?: string;
  location?: string;
  experience?: string;
  onboardingStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingRequest {
  onboardingStatus: string;
}

export interface PersonalizedMessage {
  id: string;
  title: string;
  content: string;
  type: 'weather' | 'crop' | 'pest' | 'government' | 'general';
  isRead: boolean;
  createdAt: string;
}

class UserService {
  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/user/profile');
    return response.data;
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put('/api/user/profile', userData);
    return response.data;
  }

  // Update onboarding status
  async updateOnboardingStatus(
    onboardingData: OnboardingRequest,
  ): Promise<void> {
    await api.post('/api/user/onboarding', onboardingData);
  }

  // Get personalized messages for the user
  async getPersonalizedMessages(): Promise<PersonalizedMessage[]> {
    const response = await api.get('/api/user/messages');
    return response.data;
  }

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<void> {
    await api.patch(`/api/user/messages/${messageId}/read`);
  }

  // Get user statistics (for dashboard)
  async getUserStats(): Promise<{
    totalMessages: number;
    unreadMessages: number;
  }> {
    const response = await api.get('/api/user/stats');
    return response.data;
  }
}

const userService = new UserService();
export default userService;
