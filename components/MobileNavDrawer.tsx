"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/Icon";
import { site } from "@/config/site";
import { navHandles } from "@/lib/content/nav";
import { categoryIcons } from "@/lib/content/categories";

export function MobileNavDrawer() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        aria-label={t("openMenu")}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-teal-dark transition-colors hover:bg-brand-cream md:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-6 w-6">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          aria-label={t("closeMenu")}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          inert={!open}
          className={`absolute left-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <Image src={site.logo} alt={site.name} width={1024} height={1024} className="h-9 w-auto" />
            <button
              aria-label={t("closeMenu")}
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-brand-teal-dark transition-colors hover:bg-brand-cream"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-brand-teal-dark/40">
              {t("menuTitle")}
            </p>
            <ul className="flex flex-col gap-0.5">
              {navHandles.map((handle) => {
                const href = `/collections/${handle}`;
                const isActive = pathname === href;

                return (
                  <li key={handle}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors ${
                        isActive
                          ? "bg-brand-cream text-brand-teal-dark"
                          : "text-brand-teal-dark/80 hover:bg-brand-cream/60"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isActive ? "bg-white text-brand-teal" : "bg-brand-cream/60 text-brand-teal"
                        }`}
                      >
                        <Icon name={categoryIcons[handle] ?? "leaf"} className="h-5 w-5" />
                      </span>
                      <span className="flex-1">{t(handle)}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-4 w-4 opacity-30">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
