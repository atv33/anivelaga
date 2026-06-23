const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export const analyticsEnabled = Boolean(GA_MEASUREMENT_ID);

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || initialized || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  initialized = true;
}

export function trackPageView(path: string, title = document.title) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;

  initAnalytics();

  window.gtag?.("event", "page_view", {
    page_title: title,
    page_location: window.location.href,
    page_path: path,
  });
}
