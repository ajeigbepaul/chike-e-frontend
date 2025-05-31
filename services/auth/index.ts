import axios from 'axios';
import { signIn, signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

// You might want to replace this with your actual API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Authentication API service functions
export const authService = {
  // Login with NextAuth
  async login(email: string, password: string, callbackUrl?: string) {
    try {
      console.log(`Attempting to login with email: ${email}`);
      
      // Add the callbackUrl to the signIn options if provided
      const signInOptions: any = {
        email,
        password,
        redirect: false,
      };
      
      if (callbackUrl) {
        signInOptions.callbackUrl = callbackUrl;
      }
      
      const result = await signIn('credentials', signInOptions);
      
      console.log('Login result:', result);
      
      if (result?.error) {
        // Handle specific error messages
        if (result.error.includes('verify')) {
          return { 
            success: false, 
            error: result.error,
            needsVerification: true 
          };
        }
        
        return { success: false, error: result.error };
      }
      
      return { success: true, url: result?.url };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred during login' };
    }
  },

  // Register new user
  async register(userData: { name: string; email: string; password: string; passwordConfirm: string; phone: string }) {
    try {
      console.log(`Attempting to register user: ${userData.email}`);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      console.log('Registration response:', response.data);
      
      // Check for different response formats
      if (response.data?.success === false) {
        const errorMessage = response.data?.message || 'Registration failed';
        return { success: false, error: errorMessage };
      }
      
      // Show a success toast
      toast.success('Registration successful! Please check your email for verification.');
      
      return { 
        success: true, 
        data: response.data,
        message: 'Registration successful! Please check your email for verification.' 
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Extract error message from response
      let errorMessage = 'Registration failed';
      
      if (error.response?.data) {
        errorMessage = 
          error.response.data.message || 
          error.response.data.error || 
          error.response.data.msg || 
          errorMessage;
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Logout
  async logout() {
    try {
      await signOut({ redirect: false });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Failed to log out' };
    }
  },

  // Request password reset
  async forgotPassword(email: string) {
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return { success: true };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      return { success: false, error: errorMessage };
    }
  },

  // Reset password with token
  async resetPassword(token: string, newPassword: string) {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { 
        token, 
        password: newPassword 
      });
      return { success: true };
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      return { success: false, error: errorMessage };
    }
  },

  // Verify email with token
  async verifyEmail(token: string) {
    try {
      console.log(`Attempting to verify email with token: ${token.substring(0, 10)}...`);
      
      let response;
      
      // Try multiple common API patterns for email verification
      try {
        // First try direct token in URL pattern
        console.log(`Attempting GET ${API_URL}/auth/verify-email/${token}`);
        response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
        console.log('Verification success via GET with token in URL:', response.data);
        return { success: true, data: response.data };
      } catch (firstAttemptError) {
        console.log('First verification attempt failed, trying POST method');
        
        try {
          // Try token in body pattern
          console.log(`Attempting POST ${API_URL}/auth/verify-email with token in body`);
          response = await axios.post(`${API_URL}/auth/verify-email`, { token });
          console.log('Verification success via POST with token in body:', response.data);
          return { success: true, data: response.data };
        } catch (secondAttemptError) {
          console.log('Second verification attempt failed, trying GET with query param');
          
          // Try token as query parameter
          console.log(`Attempting GET ${API_URL}/auth/verify-email?token=${token}`);
          response = await axios.get(`${API_URL}/auth/verify-email?token=${token}`);
          console.log('Verification success via GET with token as query param:', response.data);
          return { success: true, data: response.data };
        }
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      
      // Extract error message from response with fallbacks
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.response?.data?.msg ||
        'Failed to verify email. The link may have expired or been used already.';
      
      console.error(`Verification failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  },
  
  // Handle verification redirect
  handleVerificationRedirect(token: string, callbackUrl?: string) {
    // Get the base URL
    const baseUrl = window.location.origin;
    const successUrl = callbackUrl || `${baseUrl}/auth/verify-success`;
    
    // First verify the email
    return this.verifyEmail(token)
      .then(result => {
        if (result.success) {
          // Show success toast
          toast.success('Email verified successfully!');
          
          // Redirect to success page
          window.location.href = successUrl;
          return { success: true };
        } else {
          // Show error toast
          toast.error(result.error || 'Verification failed');
          return { success: false, error: result.error };
        }
      })
      .catch(error => {
        console.error('Verification redirect error:', error);
        toast.error('An error occurred during verification');
        return { success: false, error: 'An error occurred during verification' };
      });
  }
};

