"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/Icon";
import { site } from "@/config/site";
import { categoryIcons } from "@/lib/content/categories";
import type { NavigationEntry } from "@/lib/shopify/navigation";

export function MobileNavDrawer({ entries }: { entries: NavigationEntry[] }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const visibleEntries = entries
    .map((entry) => {
      const matchingChildren = entry.children.filter((child) =>
        child.title.toLocaleLowerCase(locale).includes(normalizedQuery)
      );
      const entryMatches = entry.title.toLocaleLowerCase(locale).includes(normalizedQuery);
      return {
        ...entry,
        children: normalizedQuery && !entryMatches ? matchingChildren : entry.children,
        visible: !normalizedQuery || entryMatches || matchingChildren.length > 0,
      };
    })
    .filter((entry) => entry.visible);

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
        className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-teal-dark transition-colors hover:bg-brand-cream lg:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-6 w-6">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
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
          className={`absolute left-0 top-0 flex h-full w-[var(--layout-drawer-width)] max-w-[88vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
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

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <p className="px-1 pb-3 text-xs font-bold uppercase tracking-wide text-brand-teal-dark/50">
              {t("menuTitle")}
            </p>
            <label className="mb-4 flex h-12 items-center gap-3 rounded-xl border border-black/10 bg-white/80 px-4 shadow-sm focus-within:border-brand-teal/50 focus-within:ring-2 focus-within:ring-brand-teal/15">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5 shrink-0 text-brand-teal-dark/50">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchCategories")}
                aria-label={t("searchCategories")}
                className="min-w-0 flex-1 bg-transparent text-sm text-brand-teal-dark placeholder:text-brand-teal-dark/45 focus:outline-none"
              />
            </label>
            {visibleEntries.length ? (
              <ul className="flex flex-col gap-1">
                {visibleEntries.map((entry) => {
                  const handle = entry.href.split("/").filter(Boolean).at(-1) ?? "";
                  const isActive = entry.href === pathname;
                  return (
                    <li key={entry.id}>
                      {entry.children.length ? (
                        <details open={Boolean(normalizedQuery)} className="group rounded-xl">
                          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-bold text-brand-teal-dark hover:bg-brand-cream/60 [&::-webkit-details-marker]:hidden">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-cream/60 text-brand-teal">
                              <Icon name={categoryIcons[handle] ?? "leaf"} className="h-5 w-5" />
                            </span>
                            <span className="flex-1">{entry.title}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-4 w-4 transition-transform group-open:rotate-90">
                              <path d="m9 6 6 6-6 6" />
                            </svg>
                          </summary>
                          <ul className="ml-7 border-l border-brand-teal/15 py-1 pl-5">
                            {entry.href && (
                              <li>
                                <Link href={entry.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-teal hover:bg-brand-cream/50">
                                  {t("viewAllCategory", { category: entry.title })}
                                </Link>
                              </li>
                            )}
                            {entry.children.filter((child) => !normalizedQuery || entry.title.toLocaleLowerCase(locale).includes(normalizedQuery) || child.title.toLocaleLowerCase(locale).includes(normalizedQuery)).map((child) => (
                              <li key={child.id}>
                                <Link href={child.href} onClick={() => setOpen(false)} aria-current={child.href === pathname ? "page" : undefined} className="block rounded-lg px-3 py-2 text-sm text-brand-teal-dark/75 hover:bg-brand-cream/50 hover:text-brand-teal-dark">
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <Link href={entry.href} onClick={() => setOpen(false)} aria-current={isActive ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-semibold transition-colors ${isActive ? "bg-brand-cream text-brand-teal-dark" : "text-brand-teal-dark/80 hover:bg-brand-cream/60"}`}>
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-cream/60 text-brand-teal">
                            <Icon name={categoryIcons[handle] ?? "leaf"} className="h-5 w-5" />
                          </span>
                          <span className="flex-1">{entry.title}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-1 py-6 text-sm text-brand-teal-dark/60">{t("noCategoryMatches")}</p>
            )}
            <div className="mt-5 border-t border-brand-teal-dark/10 pt-4">
              <Link
                href="/pages/about-us"
                onClick={() => setOpen(false)}
                aria-current={pathname === "/pages/about-us" ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-semibold transition-colors ${
                  pathname === "/pages/about-us" ? "text-brand-teal-dark" : "text-brand-teal-dark/80 hover:text-brand-teal-dark"
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center text-brand-teal">
                  <Icon name="leaf" className="h-5 w-5" />
                </span>
                <span>{t("aboutUs")}</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
