"use client";

import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const TokenExpirationHandler = dynamic(
  () => import("@/components/TokenExpirationHandler"),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TokenExpirationHandler />
      <Toaster />
      {children}
    </>
  );
}
