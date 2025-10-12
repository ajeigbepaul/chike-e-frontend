"use client";

import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { useLoadingOverlay } from "@/hooks/useLoadingOverlay";
import { createContext, useContext, useMemo } from "react";

const TokenExpirationHandler = dynamic(
  () => import("@/components/TokenExpirationHandler"),
  { ssr: false }
);

type LoadingOverlayContextValue = {
  showOverlay: (message?: string) => void;
  hideOverlay: () => void;
};

const LoadingOverlayContext = createContext<LoadingOverlayContextValue | null>(
  null
);

export function useLoadingOverlayContext() {
  const context = useContext(LoadingOverlayContext);
  if (!context) {
    throw new Error(
      "useLoadingOverlayContext must be used within ClientProviders"
    );
  }
  return context;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const { isVisible, message, showOverlay, hideOverlay } = useLoadingOverlay();

  const contextValue = useMemo(
    () => ({ showOverlay, hideOverlay }),
    [showOverlay, hideOverlay]
  );

  return (
    <Provider store={store}>
      <LoadingOverlayContext.Provider value={contextValue}>
        <TokenExpirationHandler />
        <Toaster />
        {children}
        {isVisible && <LoaderOverlay message={message} />}
      </LoadingOverlayContext.Provider>
    </Provider>
  );
}
