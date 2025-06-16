"use client";

import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const TokenExpirationHandler = dynamic(
  () => import("@/components/TokenExpirationHandler"),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <TokenExpirationHandler />
      <Toaster />
      {children}
    </Provider>
  );
}