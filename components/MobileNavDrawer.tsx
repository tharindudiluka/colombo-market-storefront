"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { navHandles } from "@/lib/content/nav";

export function MobileNavDrawer() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label={t("openMenu")}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center text-brand-teal-dark md:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-6 w-6">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label={t("closeMenu")}
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold text-brand-teal-dark">{t("menuTitle")}</span>
              <button aria-label={t("closeMenu")} onClick={() => setOpen(false)} className="p-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {navHandles.map((handle) => (
                <li key={handle}>
                  <a
                    href={`/collections/${handle}`}
                    className="block rounded-lg px-2 py-3 text-base font-semibold text-brand-teal-dark hover:bg-brand-cream"
                    onClick={() => setOpen(false)}
                  >
                    {t(handle)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
