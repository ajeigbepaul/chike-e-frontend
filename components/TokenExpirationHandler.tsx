"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TokenExpirationHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.expires) {
      const expirationTime = new Date(session.expires).getTime();
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        router.push("/auth/signin?error=TokenExpired");
      }
    }
  }, [session, status, router]);

  return null;
}
