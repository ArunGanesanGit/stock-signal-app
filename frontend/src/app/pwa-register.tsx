"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .then((registration) => {
          console.log("✓ Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }

    // Listen for install prompt
    let deferredPrompt: any;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log("✓ PWA install prompt available");

      // You can show a custom install button here if you want
      // For now, browser will show its own prompt
    });

    window.addEventListener("appinstalled", () => {
      console.log("✓ PWA app installed successfully");
      deferredPrompt = null;
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", (e) => {});
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  return null;
}
