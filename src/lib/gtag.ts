declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fires a GA4 event if analytics is loaded (NEXT_PUBLIC_GA_ID set); a safe no-op otherwise. */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}
