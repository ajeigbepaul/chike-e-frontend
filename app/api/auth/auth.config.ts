import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Use the same API URL as the rest of the application
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Define NextAuth options
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
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

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

          return {
            id: userId,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified || true,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          isVerified: token.isVerified as boolean,
        };
      }
      return session;
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
};
