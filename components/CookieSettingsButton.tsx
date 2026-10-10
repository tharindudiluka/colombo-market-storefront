"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/consent";

export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>{label}</button>;
}
