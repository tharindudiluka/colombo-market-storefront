type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    colomboAnalyticsConsent?: {
      granted: boolean;
      setGranted: (granted: boolean) => void;
    };
    colomboGaConfigured?: boolean;
    colomboGaLastLocation?: string;
    colomboGaLastTitle?: string;
  }
}

// No Google script or network request is created by this consent bridge.
// ConsentManager restores the saved choice and calls setGranted after a real choice.
export function analyticsBootstrap(measurementId: string) {
  return `
    if (!window.colomboAnalyticsConsent) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
      window[${JSON.stringify(`ga-disable-${measurementId}`)}] = true;
      window.gtag('consent', 'default', {
        analytics_storage: 'denied', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied'
      });
      window.colomboAnalyticsConsent = {
        granted: false,
        setGranted: function(granted) {
          if (typeof granted !== 'boolean' || this.granted === granted) return;
          this.granted = granted;
          window[${JSON.stringify(`ga-disable-${measurementId}`)}] = !granted;
          window.gtag('consent', 'update', {
            analytics_storage: granted ? 'granted' : 'denied',
            ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
          });
          if (!granted) window.colomboGaLastLocation = undefined;
          window.dispatchEvent(new Event('colombo:analytics-consent'));
        }
      };
    }
  `;
}

export function sendAnalyticsPageView(measurementId: string) {
  if (!window.colomboAnalyticsConsent?.granted || !window.colomboGaConfigured || !window.gtag) return;
  const location = window.location.origin + window.location.pathname + window.location.search;
  if (window.colomboGaLastLocation === location) return;
  const referrer = window.colomboGaLastLocation ?? document.referrer;
  window.colomboGaLastLocation = location;
  window.colomboGaLastTitle = document.title;
  window.gtag("event", "page_view", {
    send_to: measurementId,
    page_location: location,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    page_referrer: referrer,
  });
}
