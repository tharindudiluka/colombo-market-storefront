"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/Icon";
import { HomepageCategoryIcon } from "@/components/HomepageCategoryIcon";
import { mobileNavigationIcons } from "@/config/mobile-navigation";
import { site } from "@/config/site";
import type { NavigationEntry } from "@/lib/shopify/navigation";

function filterEntries(entries: NavigationEntry[], query: string, locale: string): NavigationEntry[] {
  return entries.flatMap(entry => {
    if (!query || entry.title.toLocaleLowerCase(locale).includes(query)) return [entry];
    const children = filterEntries(entry.children, query, locale);
    return children.length ? [{ ...entry, children }] : [];
  });
}

function MobileEntry({ entry, pathname, searching, onNavigate, depth = 0 }: {
  entry: NavigationEntry; pathname: string; searching: boolean; onNavigate: () => void; depth?: number;
}) {
  const t = useTranslations("nav");
  const icon = mobileNavigationIcons[entry.id] ?? "store";
  const title = <>{depth === 0 && <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-cream/60 text-brand-teal">
    {icon === "mortar" || icon === "candy" ? <HomepageCategoryIcon name={icon} className="h-5 w-5" /> : <Icon name={icon} className="h-5 w-5" />}
  </span>}<span className="min-w-0 flex-1">{entry.title}</span></>;
  const linkClass = "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-brand-teal-dark/80 hover:bg-brand-cream/60";
  return (
    <li>
      {entry.children.length ? (
        <details open={searching || undefined} className="group rounded-xl">
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-bold text-brand-teal-dark hover:bg-brand-cream/60 [&::-webkit-details-marker]:hidden">
            {title}<svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 shrink-0"><path d="m9 6 6 6-6 6" /></svg>
          </summary>
          <ul className="ml-4 border-l border-brand-teal/15 py-1 pl-2">
            {entry.href !== "#" && <li><Link href={entry.href} onClick={onNavigate} className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-teal hover:bg-brand-cream/50">{t("viewAllCategory", {category:entry.title})}</Link></li>}
            {entry.children.map(child => <MobileEntry key={child.id} entry={child} pathname={pathname} searching={searching} onNavigate={onNavigate} depth={depth + 1} />)}
          </ul>
        </details>
      ) : entry.href === "#" ? (
        <a href="#" onClick={event => event.preventDefault()} className={linkClass}>{title}</a>
      ) : (
        <Link href={entry.href} onClick={onNavigate} aria-current={entry.href === pathname ? "page" : undefined} className={linkClass}>{title}</Link>
      )}
    </li>
  );
}
export function MobileNavDrawer({ entries }: { entries: NavigationEntry[] }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const visibleEntries = filterEntries(entries, normalizedQuery, locale);

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
                {visibleEntries.map(entry => <MobileEntry key={entry.id} entry={entry} pathname={pathname} searching={Boolean(normalizedQuery)} onNavigate={() => setOpen(false)} />)}
              </ul>
            ) : (
              <p className="px-1 py-6 text-sm text-brand-teal-dark/60">{t("noCategoryMatches")}</p>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
