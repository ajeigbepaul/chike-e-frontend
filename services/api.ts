import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Create a base axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Get session from NextAuth
    const session = await getSession();
    
    // If session exists, add the authorization header
    if (session) {
      // NextAuth stores the JWT in an HttpOnly cookie, so we don't need to manually add it
      // The cookie will be sent automatically with requests to the same domain
      
      // For cross-domain requests, you might need to set up your backend to accept 
      // a custom header with the token
      // config.headers['x-auth-token'] = session.accessToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // You could implement token refresh logic here if needed
      // For now, we'll let NextAuth handle session expiration
      
      // Redirect to login page if session expired
      window.location.href = '/auth/signin';
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default api;

