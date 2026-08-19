"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "colombo-market-promo-dismissed";

export function PromoModal() {
  const t = useTranslations("promoModal");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  function close() {
    setOpen(false);
    window.localStorage.setItem(STORAGE_KEY, "1");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="relative w-full max-w-md rounded-t-3xl bg-brand-teal p-6 text-white sm:rounded-3xl sm:p-8">
        <button
          aria-label={t("close")}
          onClick={close}
          className="absolute right-4 top-4 text-white/80 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="text-3xl" aria-hidden>
          🌶️
        </p>
        <h3 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">{t("title")}</h3>
        <p className="mt-2 text-sm text-white/85">{t("body")}</p>

        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            close();
          }}
        >
          <input
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            className="w-full rounded-full bg-white px-4 py-3 text-sm text-brand-teal-dark placeholder:text-brand-teal-dark/50 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-brand-cream py-3 text-sm font-bold text-brand-teal-dark"
          >
            {t("submit")}
          </button>
        </form>
        <p className="mt-3 text-[11px] text-white/60">{t("terms")}</p>
      </div>
    </div>
  );
}
