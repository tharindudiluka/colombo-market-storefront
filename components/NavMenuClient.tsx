"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/Icon";
import { categoryIcons } from "@/lib/content/categories";
import type { NavigationEntry } from "@/lib/shopify/navigation";

function collectionHandle(href: string) {
  return href.split("/").filter(Boolean).at(-1) ?? "";
}

export function NavMenuClient({ entries = [] }: { entries?: NavigationEntry[] }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="hidden border-b border-black/5 bg-white md:block" aria-label={t("desktopMenuLabel")}>
      <div className="no-scrollbar mx-auto flex max-w-[var(--layout-max-width)] items-center gap-1.5 overflow-x-auto px-4 py-2.5">
        {entries.map((entry) => {
          const handle = collectionHandle(entry.href);
          const icon = categoryIcons[handle] ?? "leaf";
          const isActive = pathname === entry.href || entry.children.some((child) => pathname === child.href);
          const isOffers = handle === "angebote";
          const itemClassName = `desktop-nav-link group flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.97] ${
            isOffers
              ? "bg-brand-terracotta text-white shadow-sm hover:bg-brand-terracotta/90"
              : isActive
                ? "bg-brand-cream text-brand-teal-dark"
                : "text-brand-teal-dark/75 hover:bg-brand-cream hover:text-brand-teal-dark"
          }`;

          if (!entry.children.length) {
            return (
              <Link key={entry.id} href={entry.href} aria-current={isActive ? "page" : undefined} className={itemClassName}>
                <Icon name={icon} className={`h-4 w-4 ${isOffers ? "opacity-90" : "opacity-55 group-hover:opacity-100"}`} />
                {entry.title}
              </Link>
            );
          }

          return (
            <details key={entry.id} className="group relative shrink-0">
              <summary className={`${itemClassName} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
                <Icon name={icon} className={`h-4 w-4 ${isOffers ? "opacity-90" : "opacity-55 group-hover:opacity-100"}`} />
                {entry.title}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="absolute left-0 top-full z-30 mt-2 min-w-60 overflow-hidden rounded-2xl border border-white/80 bg-white/95 p-2 shadow-xl backdrop-blur-xl">
                {entry.href && (
                  <Link href={entry.href} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-brand-teal hover:bg-brand-cream/70">
                    {t("viewAllCategory", { category: entry.title })}
                  </Link>
                )}
                <div className="my-1 border-t border-brand-teal-dark/10" />
                {entry.children.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href}
                    aria-current={pathname === child.href ? "page" : undefined}
                    className="block rounded-xl px-3 py-2.5 text-sm text-brand-teal-dark/75 hover:bg-brand-cream/70 hover:text-brand-teal-dark"
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            </details>
          );
        })}

        <Link
          href="/pages/about-us"
          aria-current={pathname === "/pages/about-us" ? "page" : undefined}
          className="desktop-nav-link ml-auto flex shrink-0 items-center rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-brand-teal-dark/75 transition-colors hover:text-brand-teal-dark"
        >
          {t("aboutUs")}
        </Link>
      </div>
    </nav>
  );
}
