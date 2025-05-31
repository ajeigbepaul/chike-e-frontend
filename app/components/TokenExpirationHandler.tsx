"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function TokenExpirationHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "TokenExpired") {
      // Show expiration message
      alert("Your session has expired. Please log in again.");
      // Sign out and redirect to login
      signOut({ redirect: true, callbackUrl: "/auth/signin" });
    }
  }, [searchParams, router]);

  return null;
}
