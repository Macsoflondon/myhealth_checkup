import { useState, useEffect, useCallback } from "react";
import errorToast from "@/lib/errorToast";

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useNetworkStatus(showToasts = true): NetworkStatus {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    if (wasOffline && showToasts) {
      errorToast.online();
    }
  }, [wasOffline, showToasts]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setWasOffline(true);
    if (showToasts) {
      errorToast.offline();
    }
  }, [showToasts]);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { isOnline, wasOffline };
}

export default useNetworkStatus;
