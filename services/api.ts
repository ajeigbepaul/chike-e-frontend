import axios from "axios";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";

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
    console.log("API Interceptor: Session", session);
    console.log("API Interceptor: Access Token", session?.accessToken);

    // Add the JWT token to the Authorization header if it exists
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
      console.log("API Interceptor: Authorization header set");
    } else {
      console.log("API Interceptor: No access token found in session.");
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

    // Only redirect to login for protected endpoints
    const protectedEndpoints: string[] = []; // No protected endpoints, all are public
    if (
      error.response?.status === 401 &&
      protectedEndpoints.some(
        (ep) => originalRequest.url && originalRequest.url.includes(ep)
      ) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Check if the error is due to JWT expiration
      const isTokenExpired =
        error.response?.data?.message
          ?.toLowerCase()
          .includes("token expired") ||
        error.response?.data?.message?.toLowerCase().includes("jwt expired") ||
        error.response?.data?.error?.toLowerCase().includes("token expired") ||
        error.response?.data?.error?.toLowerCase().includes("jwt expired");

      if (isTokenExpired) {
        // Sign out the user
        await signOut({ redirect: false });
        toast.error("Your session has expired. Please log in again.");
        if (!window.location.pathname.includes("/auth/signin")) {
          window.location.href = "/auth/signin";
        }
      } else {
        if (!window.location.pathname.includes("/auth/signin")) {
          window.location.href = "/auth/signin";
        }
      }
      return Promise.reject(error);
    }
    // For public endpoints, do not redirect, just reject
    return Promise.reject(error);
  }
);

export default api;
