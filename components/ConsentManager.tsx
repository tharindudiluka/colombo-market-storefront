"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { policyHandles, policyHref } from "@/config/pages";
import { clearAnalyticsCookies, getConsentSnapshot, OPEN_CONSENT_EVENT, parseConsent, saveConsent, subscribeConsent } from "@/lib/consent";

const buttonClass = "min-h-11 rounded-xl border border-brand-teal-dark/30 px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal-dark";
const primaryClass = `${buttonClass} bg-brand-teal-dark text-white hover:bg-brand-teal`;
const secondaryClass = `${buttonClass} bg-white text-brand-teal-dark hover:bg-category-sage`;

export function ConsentManager() {
  const t = useTranslations("consent");
  const raw = useSyncExternalStore(subscribeConsent, getConsentSnapshot, () => null);
  const hydrated = useSyncExternalStore(subscribeConsent, () => true, () => false);
  const choice = parseConsent(raw);
  const analytics = choice?.analytics === true;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const bannerSettings = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    window.colomboAnalyticsConsent?.setGranted(analytics);
    if (!analytics) clearAnalyticsCookies();
  }, [hydrated, analytics]);

  useEffect(() => {
    const openSettings = () => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setDraft(parseConsent(getConsentSnapshot())?.analytics === true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) {
      dialog.current.close();
      if (returnFocus.current?.isConnected) returnFocus.current.focus();
      else bannerSettings.current?.focus();
    }
  }, [open]);

  const choose = (enabled: boolean) => { saveConsent(enabled); setOpen(false); };
  const settings = () => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));

  return <>
    {hydrated && !choice && !open && <section aria-labelledby="consent-banner-title" className="fixed inset-x-0 bottom-0 z-[100] border-t border-brand-teal-dark/20 bg-white p-4 text-brand-teal-dark shadow-xl sm:p-6">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex-1">
          <h2 id="consent-banner-title" className="text-lg font-bold">{t("title")}</h2>
          <p className="mt-2 text-sm leading-relaxed">{t("text")}</p>
          <Link href={policyHref(policyHandles.privacy)} className="mt-2 inline-block rounded text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">{t("privacyPolicy")}</Link>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" className={primaryClass} onClick={() => choose(true)}>{t("acceptAll")}</button>
          <button type="button" className={secondaryClass} onClick={() => choose(false)}>{t("necessaryOnly")}</button>
          <button ref={bannerSettings} type="button" className={secondaryClass} onClick={settings}>{t("settings")}</button>
        </div>
      </div>
    </section>}
    <dialog ref={dialog} aria-labelledby="consent-settings-title" aria-describedby="consent-settings-description" onCancel={() => setOpen(false)} className="fixed inset-0 m-auto max-h-[90dvh] w-11/12 max-w-lg overflow-y-auto rounded-2xl border border-brand-teal-dark/20 bg-white p-5 text-brand-teal-dark shadow-xl backdrop:bg-black/40 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 id="consent-settings-title" className="text-xl font-bold">{t("title")}</h2>
        <button type="button" className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-brand-teal-dark/20 hover:bg-category-sage focus-visible:outline-2 focus-visible:outline-offset-2" aria-label={t("close")} onClick={() => setOpen(false)}><span aria-hidden="true">×</span></button>
      </div>
      <p id="consent-settings-description" className="mt-3 text-sm leading-relaxed">{t("text")}</p>
      <div className="mt-5 space-y-3">
        <div className="rounded-xl border border-brand-teal-dark/15 bg-category-sage/40 p-4">
          <label className="flex items-center justify-between gap-3 font-semibold"><span>{t("necessary")}</span><input type="checkbox" checked disabled aria-describedby="consent-necessary-description" className="h-5 w-5 accent-brand-teal-dark" /></label>
          <p id="consent-necessary-description" className="mt-2 text-sm leading-relaxed">{t("necessaryDescription")}</p>
          <span className="mt-2 block text-xs font-semibold">{t("required")}</span>
        </div>
        <div className="rounded-xl border border-brand-teal-dark/15 p-4">
          <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 font-semibold"><span>{t("analytics")}</span><input type="checkbox" checked={draft} onChange={event => setDraft(event.target.checked)} aria-describedby="consent-analytics-description" className="h-5 w-5 accent-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-4" /></label>
          <p id="consent-analytics-description" className="mt-2 text-sm leading-relaxed">{t("analyticsDescription")}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className={primaryClass} onClick={() => choose(draft)}>{t("save")}</button>
        <button type="button" className={secondaryClass} onClick={() => choose(true)}>{t("acceptAll")}</button>
        <button type="button" className={secondaryClass} onClick={() => choose(false)}>{t("necessaryOnly")}</button>
      </div>
      <Link href={policyHref(policyHandles.privacy)} onClick={() => setOpen(false)} className="mt-4 inline-block rounded text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">{t("privacyPolicy")}</Link>
    </dialog>
  </>;
}
