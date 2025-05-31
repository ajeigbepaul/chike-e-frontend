// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email: string;
    role: string; // Changed from literal type to string to match backend
    isVerified?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: string; // Changed from literal type to string to match backend
      isVerified?: boolean;
    } & DefaultSession['user'];
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // Changed from literal type to string to match backend
    isVerified?: boolean;
  }
}
