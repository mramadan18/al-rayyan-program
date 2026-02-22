import { useState, useEffect } from "react";

/**
 * Hook to detect real internet connectivity.
 * Combines navigator.onLine with a periodic fetch to a reliable server.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    // Function to check real connection by fetching a tiny resource
    const checkRealConnection = async () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setIsOnline(false);
        return;
      }

      try {
        // Use a small, reliable resource (Google's favicon) with no-cache
        // We use a timeout to avoid hanging indefinitely
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch("https://www.google.com/favicon.ico", {
          mode: "no-cors",
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setIsOnline(true);
      } catch (error) {
        // If fetch fails and navigator says online, it might be a captive portal or DNS issue
        setIsOnline(false);
      }
    };

    const handleOnline = () => {
      checkRealConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Initial check
      checkRealConnection();

      // Optional: periodic check every 30 seconds if online
      const interval = setInterval(checkRealConnection, 30000);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        clearInterval(interval);
      };
    }
  }, []);

  return { isOnline, isMounted };
}
