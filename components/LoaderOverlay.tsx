import React from "react";

interface LoaderOverlayProps {
  message?: string;
}

/**
 * Displays a full-screen semi-transparent overlay with a centered spinner.
 * Useful when waiting for critical route transitions after authentication.
 */
export function LoaderOverlay({ message }: LoaderOverlayProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-brand-yellow" />
        {message && (
          <p className="text-center text-sm font-medium text-white/90">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
