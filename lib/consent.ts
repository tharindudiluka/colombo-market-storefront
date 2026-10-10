"use client";

export const CONSENT_KEY = "colombo-consent";
export const CONSENT_VERSION = 1;
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const CHANGE_EVENT = "colombo:consent-choice";
export const OPEN_CONSENT_EVENT = "colombo:open-consent";
let memoryChoice: string | null = null;

type ConsentChoice = { version: number; necessary: true; analytics: boolean; updatedAt: number };

export function parseConsent(raw: string | null): ConsentChoice | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    return value.version === CONSENT_VERSION && value.necessary === true &&
      typeof value.analytics === "boolean" && typeof value.updatedAt === "number" &&
      value.updatedAt <= Date.now() && Date.now() - value.updatedAt < MAX_AGE ? value : null;
  } catch { return null; }
}

export function getConsentSnapshot(): string | null {
  let raw = memoryChoice;
  if (raw === null) {
    try { raw = window.localStorage.getItem(CONSENT_KEY); } catch { /* Session-only fallback. */ }
  }
  return parseConsent(raw) ? raw : null;
}

export function subscribeConsent(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) {
      memoryChoice = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

export function clearAnalyticsCookies() {
  // Only GA cookies; never touch cart, locale or customer cookies.
  const names = document.cookie.split(";").map(cookie => cookie.trim().split("=")[0])
    .filter(name => name === "_ga" || name.startsWith("_ga_"));
  const parts = window.location.hostname.split(".");
  const domains = parts.map((_, index) => parts.slice(index).join(".")).filter(domain => domain.includes("."));
  for (const name of names) {
    const deletion = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = deletion;
    for (const domain of domains) document.cookie = `${deletion}; Domain=${domain}`;
  }
}

export function saveConsent(analytics: boolean) {
  memoryChoice = JSON.stringify({ version: CONSENT_VERSION, necessary: true, analytics, updatedAt: Date.now() });
  try { window.localStorage.setItem(CONSENT_KEY, memoryChoice); } catch {
    // A quota failure must not leave a previous grant stored after withdrawal.
    try { window.localStorage.removeItem(CONSENT_KEY); } catch { /* Storage is unavailable; keep the in-memory choice. */ }
  }
  // Update synchronously so withdrawal stops events before the next route change.
  window.colomboAnalyticsConsent?.setGranted(analytics);
  if (!analytics) clearAnalyticsCookies();
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
