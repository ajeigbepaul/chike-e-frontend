import { useCallback, useState } from "react";

/**
 * Simple hook to manage a global full-screen loading overlay.
 * Designed for use with the LoaderOverlay component.
 */
export function useLoadingOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const showOverlay = useCallback((text?: string) => {
    setMessage(text);
    setIsVisible(true);
  }, []);

  const hideOverlay = useCallback(() => {
    setIsVisible(false);
    setMessage(undefined);
  }, []);

  return {
    isVisible,
    message,
    showOverlay,
    hideOverlay,
  };
}
