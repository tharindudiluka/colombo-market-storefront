"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { MobileNavIcon } from "@/components/MobileNavIcon";
import { mobileNavigationIcons } from "@/config/mobile-navigation";
import { site } from "@/config/site";
import { pageHandles, pageHref } from "@/config/pages";
import type { NavigationEntry } from "@/lib/shopify/navigation";

function filterEntries(entries: NavigationEntry[], query: string, locale: string): NavigationEntry[] {
  return entries.flatMap(entry => {
    if (!query || entry.title.toLocaleLowerCase(locale).includes(query)) return [entry];
    const children = filterEntries(entry.children, query, locale);
    return children.length ? [{ ...entry, children }] : [];
  });
}

const rowClass = "flex min-h-[52px] items-center gap-3.5 rounded-xl px-2.5 py-1.5 text-[15px] font-bold leading-snug text-brand-teal-dark transition-colors hover:bg-brand-cream/70 active:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-teal";

const chevronClass = "h-4 w-4 shrink-0 text-brand-teal-dark/40 transition-transform duration-200 group-data-[open]:rotate-90 motion-reduce:transition-none";
const chevron = <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={chevronClass}><path d="m9 6 6 6-6 6" /></svg>;

function MobileEntry({ entry, pathname, searching, onNavigate, depth = 0 }: {
  entry: NavigationEntry; pathname: string; searching: boolean; onNavigate: () => void; depth?: number;
}) {
  const t = useTranslations("nav");
  const [expanded, setExpanded] = useState(false);
  const submenuId = useId();
  const icon = mobileNavigationIcons[entry.href] ?? "store";
  const isOffers = entry.href === "/collections/angebote";
  const current = entry.href === pathname;
  const label = icon === "kumaio" ? t("kumaioMobile") : entry.title;
  const title = <>{depth === 0 && <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isOffers ? "bg-brand-terracotta/10 text-brand-terracotta" : "bg-brand-cream text-brand-teal"}`}>
    <MobileNavIcon name={icon} className="h-6 w-6" />
  </span>}<span className="min-w-0 flex-1 text-balance">{label}</span></>;
  const itemClass = `${rowClass} ${current ? "bg-brand-cream" : ""}`;
  const hasChildren = entry.children.length > 0;
  const isOpen = searching || expanded;
  const toggleLabel = t(isOpen ? "collapseCategory" : "expandCategory", { category: label });
  const toggle = () => setExpanded(value => !value);
  return (
    <li>
      {hasChildren ? (
        <div className="group" data-open={isOpen ? "" : undefined}>
          {entry.href === "#" ? (
            <button type="button" aria-expanded={isOpen} aria-controls={submenuId} onClick={toggle} className={`${rowClass} w-full text-left`}>
              {title}{chevron}
            </button>
          ) : (
            <div className="flex items-center">
              <Link href={entry.href} onClick={onNavigate} aria-current={current ? "page" : undefined} className={`${itemClass} min-w-0 flex-1`}>{title}</Link>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={submenuId}
                aria-label={toggleLabel}
                onClick={toggle}
                className="flex min-h-[52px] w-12 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-brand-cream/70 active:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-teal"
              >
                {chevron}
              </button>
            </div>
          )}
          <ul id={submenuId} hidden={!isOpen} className="mb-2 ml-7 mt-0.5 border-l-2 border-brand-teal/15 pl-3">
            {entry.children.map(child => <MobileEntry key={child.id} entry={child} pathname={pathname} searching={searching} onNavigate={onNavigate} depth={depth + 1} />)}
          </ul>
        </div>
      ) : entry.href === "#" ? (
        <a href="#" onClick={event => event.preventDefault()} className={depth === 0 ? itemClass : subLinkClass}>{title}</a>
      ) : (
        <Link href={entry.href} onClick={onNavigate} aria-current={current ? "page" : undefined} className={depth === 0 ? itemClass : `${subLinkClass} ${current ? "bg-brand-cream" : ""}`}>{title}</Link>
      )}
    </li>
  );
}
const subLinkClass = "flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-brand-teal-dark/85 transition-colors hover:bg-brand-cream/70 active:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-teal";
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
        className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-teal-dark transition-colors hover:bg-brand-cream xl:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-6 w-6">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-50 xl:hidden ${open ? "" : "pointer-events-none"}`}
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
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-3">
            <Image src={site.logo} alt={site.name} width={1024} height={1024} className="h-9 w-auto" />
            <button
              aria-label={t("closeMenu")}
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-brand-teal-dark transition-colors hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-brand-teal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <p className="px-2.5 pb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-teal-dark/55">
              {t("menuTitle")}
            </p>
            <label className="mb-3 flex h-12 items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 transition-colors focus-within:border-brand-teal/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-teal/15">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5 shrink-0 text-brand-teal-dark/50">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchCategories")}
                className="min-w-0 flex-1 bg-transparent text-sm text-brand-teal-dark placeholder:text-brand-teal-dark/45 focus:outline-none"
              />
            </label>
            {visibleEntries.length ? (
              <ul className="flex flex-col gap-0.5">
                {visibleEntries.map(entry => <MobileEntry key={entry.id} entry={entry} pathname={pathname} searching={Boolean(normalizedQuery)} onNavigate={() => setOpen(false)} />)}
              </ul>
            ) : (
              <p className="px-2.5 py-6 text-sm text-brand-teal-dark/60">{t("noCategoryMatches")}</p>
            )}
          </nav>
          <div className="flex gap-2 border-t border-black/5 px-4 py-3 text-sm font-semibold text-brand-teal-dark">
            <Link href={pageHref(pageHandles.contact)} onClick={() => setOpen(false)} className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-brand-teal/20 hover:bg-brand-cream">{t("contact")}</Link>
            <Link href={pageHref(pageHandles.about)} onClick={() => setOpen(false)} className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-brand-teal/20 hover:bg-brand-cream">{t("aboutUs")}</Link>
          </div>
        </div>
      </div>
    </>
  );
}
