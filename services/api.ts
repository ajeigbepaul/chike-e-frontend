import axios from "axios";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

interface CustomSession extends Session {
  accessToken?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Create a base axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for sending cookies
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Get session from NextAuth
    const session = (await getSession()) as CustomSession;

    // Add the JWT token to the Authorization header if it exists
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
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

      // Redirect to login page if session expired
      window.location.href = "/auth/signin";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
