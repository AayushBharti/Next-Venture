"use client";

import { useEffect } from "react";

/**
 * Registers the service worker in production.
 * Renders nothing — side-effect only.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);
  return null;
}
