import api from './api';
import { authService } from './auth';

// User API service
export const userService = {
  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await api.get('/users/me');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch user profile' 
      };
    }
  },
  
  // Update user profile
  async updateProfile(userData: any) {
    try {
      const response = await api.put('/users/me', userData);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  },
  
  // Change password
  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const response = await api.post('/users/change-password', {
        currentPassword,
        newPassword
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to change password' 
      };
    }
  }
};

// Export all services
export { authService };
export default api;

