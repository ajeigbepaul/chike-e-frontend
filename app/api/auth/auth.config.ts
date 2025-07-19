import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from "next-auth/react";
import axios from "axios";
import { DefaultSession } from "next-auth";

// Use the same API URL as the rest of the application
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Extend the built-in types
declare module "next-auth" {
  interface User {
    accessToken?: string;
    role: string;
    isVerified?: boolean;
  }
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role: string;
      isVerified?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user: {
      id: string;
      role: string;
      isVerified?: boolean;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Call your backend API for authentication
          const response = await axios.post(
            `${API_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              withCredentials: true, // Important for cookies
              timeout: 10000, // 10 second timeout
            }
          );

          // Handle different API response structures
          const responseData = response.data;
          // Check different possible locations of user data in the response
          const user =
            responseData.data?.user ||
            responseData.user ||
            responseData.data ||
            responseData;

          if (!user) {
            console.error("Invalid user data in response:", responseData);
            throw new Error("Invalid user data in response");
          }

          // Check if user is verified
          if (user.isVerified === false) {
            throw new Error("Please verify your email before logging in");
          }

          // Get user ID from appropriate field (either _id or id)
          const userId = user._id || user.id;

          if (!userId) {
            console.error("User ID not found in response:", user);
            throw new Error("User ID not found in response");
          }

          // Get the JWT token from the response
          const token = responseData.token || responseData.data?.token;

          return {
            id: userId,
            email: user.email,
            name: user.name,
            role: user.role || "user", // Ensure role is set, default to "user"
            isVerified: user.isVerified ?? true, // Use nullish coalescing to ensure boolean
            accessToken: token, // Include the JWT token
          };
        } catch (error: unknown) {
          console.error("Login error:", error);

          if (axios.isAxiosError(error)) {
            if (error.response) {
              // Extract error message from response data
              const errorMessage =
                error.response.data?.message ||
                error.response.data?.error ||
                error.response.data?.error?.message ||
                "Authentication failed";

              console.error("API Error:", errorMessage);
              throw new Error(errorMessage);
            } else if (error.request) {
              // The request was made but no response was received
              console.error("No response received:", error.request);
              throw new Error("No response from authentication server");
            } else {
              // Error in setting up the request
              console.error("Request setup error:", error.message);
              throw new Error(`Request failed: ${error.message}`);
            }
          }

          // For any other type of error
          const errorMessage =
            error instanceof Error ? error.message : "Authentication error";
          console.error("General auth error:", errorMessage);
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          isVerified: token.isVerified ?? true,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle role-based redirection
      if (url.startsWith(baseUrl)) {
        // If the URL is a callback URL, extract the original destination
        const callbackUrl = new URL(url).searchParams.get("callbackUrl");
        if (callbackUrl) {
          return callbackUrl;
        }

        // For now, just redirect to homepage - let client-side handle role-based redirects
        return `${baseUrl}/`;
      }
      return url;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  // Add these options to handle SSR better
  debug: process.env.NODE_ENV === "development",
  // Disable automatic session fetching during SSR to prevent errors
  useSecureCookies: process.env.NODE_ENV === "production",
};
