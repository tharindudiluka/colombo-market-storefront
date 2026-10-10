"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { sendAnalyticsPageView } from "@/lib/analytics";

function subscribe(onChange: () => void) {
  window.addEventListener("colombo:analytics-consent", onChange);
  return () => window.removeEventListener("colombo:analytics-consent", onChange);
}

function getConsent() {
  return window.colomboAnalyticsConsent?.granted === true;
}

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const granted = useSyncExternalStore(subscribe, getConsent, () => false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    if (!granted || !ready) return;

    // Read the committed document metadata, rather than a translated UI heading.
    // Observe streamed title changes before sending the single route event.
    let timer: ReturnType<typeof setTimeout>;
    const send = () => {
      observer.disconnect();
      clearTimeout(deadline);
      sendAnalyticsPageView(measurementId);
    };
    const schedule = () => {
      clearTimeout(timer);
      // App Router metadata can stream after the pathname commits. Wait for the
      // old title to change; equal-title destinations use the bounded fallback.
      if (!document.title || (
        window.colomboGaLastLocation !== window.location.origin + window.location.pathname + window.location.search &&
        window.colomboGaLastTitle === document.title
      )) return;
      timer = setTimeout(send, 150);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    const deadline = setTimeout(send, 5000);
    schedule();
    return () => {
      clearTimeout(timer);
      clearTimeout(deadline);
      observer.disconnect();
    };
  }, [granted, ready, pathname, query, measurementId]);

  return (
    <>
      {granted && (
        <Script
          id="colombo-ga-tag"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
          onReady={() => {
            if (!window.colomboGaConfigured && window.gtag) {
              window.colomboGaConfigured = true;
              window.gtag("js", new Date());
              window.gtag("config", measurementId, {
                send_page_view: false,
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
              });
            }
            setReady(true);
          }}
        />
      )}
    </>
  );
}
