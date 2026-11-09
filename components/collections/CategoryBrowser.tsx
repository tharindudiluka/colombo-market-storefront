"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { HomepageCategoryIcon } from "@/components/HomepageCategoryIcon";
import { Link } from "@/i18n/navigation";
import { homepageCategoryPresentation } from "@/lib/content/homepage-categories";
import type { CategoryImage } from "@/config/category-images";

export type BrowserCategory = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  /** Pre-formatted product count ("20 Produkte") or null. */
  countLabel: string | null;
  viewAllLabel: string;
  subLabel: string;
  /** Purpose-built collage (config/category-images.ts) or, failing that, the best product photo. */
  image: CategoryImage | null;
  packshot: string | null;
  subs: { id: string; title: string; handle: string }[];
};

type Props = {
  /** Server-rendered page heading (H1 + intro); the search box sits beside it. */
  heading: ReactNode;
  categories: BrowserCategory[];
  hasSriLanka: boolean;
  text: { quickNavLabel: string; sriLankaPill: string; searchLabel: string; searchPlaceholder: string; clear: string; noResults: string; resultsLabel: string };
};

const fold = (value: string) => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");

const chevron = (className: string) => (
  <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
);

function Thumb({ category, size, sizes }: { category: BrowserCategory; size: string; sizes: string }) {
  const presentation = homepageCategoryPresentation[category.handle];
  return (
    <span aria-hidden className={`relative block shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white ${size}`}>
      {category.image ? (
        <Image src={category.image.src} alt="" fill sizes={sizes} className="object-contain" />
      ) : category.packshot ? (
        <Image src={category.packshot} alt="" fill sizes={sizes} className="object-contain p-1.5" />
      ) : (
        <span className={`absolute inset-0 flex items-center justify-center ${presentation?.tone ?? "bg-category-sage text-brand-teal-dark"}`}>
          <HomepageCategoryIcon name={presentation?.icon ?? "leaf"} className="h-1/2 w-1/2" />
        </span>
      )}
    </span>
  );
}

/**
 * Quick-access bar + department directory for /collections. Every link is part of the server-rendered HTML; the search
 * box only hides non-matching departments/subcategories in the browser (nothing is removed from the markup on load).
 */
export function CategoryBrowser({ heading, categories, hasSriLanka, text }: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const q = fold(query.trim());
  const visible = useMemo(
    () =>
      categories.flatMap((category) => {
        if (!q) return [{ category, subs: category.subs }];
        const titleHit = fold(category.title).includes(q);
        const subs = titleHit ? category.subs : category.subs.filter((sub) => fold(sub.title).includes(q));
        return titleHit || subs.length ? [{ category, subs }] : [];
      }),
    [categories, q],
  );

  // Highlight the pill of the section currently under the header.
  useEffect(() => {
    const targets = [...document.querySelectorAll<HTMLElement>("[data-nav-section]")];
    if (!targets.length || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.getAttribute("data-nav-section"));
      },
      { rootMargin: "-170px 0px -60% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [visible.length]);

  const pill = (isActive: boolean, accent = false) =>
    `inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal ${
      isActive
        ? "border-brand-cta bg-brand-cta text-white"
        : accent
          ? "border-brand-terracotta/40 bg-white text-brand-terracotta hover:border-brand-terracotta hover:bg-brand-terracotta hover:text-white"
          : "border-neutral-300 bg-white text-neutral-800 hover:border-brand-cta hover:bg-brand-cta hover:text-white"
    }`;

  return (
    <>
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4">
        <div className="flex flex-col gap-4 pb-4 sm:pb-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">{heading}</div>
          {/* A div (not a form): the global form[role="search"] rule styles the header search box. */}
          <div role="search" className="relative lg:w-80 lg:shrink-0">
            <label htmlFor="category-search" className="sr-only">{text.searchLabel}</label>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input
              id="category-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={text.searchPlaceholder}
              autoComplete="off"
              className="control h-11 w-full rounded-full border border-neutral-300 bg-white pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label={text.clear} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-brand-teal">
                <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            )}
          </div>
        </div>

        <nav aria-label={text.quickNavLabel} className="border-y border-neutral-200 py-2.5">
            <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
              {visible.map(({ category }) => (
                <li key={category.id} className="shrink-0">
                  <a href={`#cat-${category.handle}`} aria-current={active === category.handle ? "location" : undefined} className={pill(active === category.handle)}>
                    {category.title}
                  </a>
                </li>
              ))}
              {hasSriLanka && !q && (
                <li className="shrink-0">
                  <a href="#sri-lanka" aria-current={active === "sri-lanka" ? "location" : undefined} className={pill(active === "sri-lanka", true)}>{text.sriLankaPill}</a>
                </li>
              )}
            </ul>
        </nav>
      </div>

      <section aria-label={text.resultsLabel} className="mx-auto max-w-[var(--layout-max-width)] px-4 pt-5 sm:pt-6">
        <p role="status" aria-live="polite" className={visible.length ? "sr-only" : "rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-600"}>
          {visible.length ? "" : text.noResults}
        </p>
        <ul className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          {visible.map(({ category, subs }) => (
            <li key={category.id}>
              <article
                id={`cat-${category.handle}`}
                data-nav-section={category.handle}
                className="scroll-mt-44 flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-3.5 transition-colors hover:border-brand-teal/60 sm:p-4"
              >
                <div className="flex gap-3.5 sm:gap-4">
                  <Link href={`/collections/${category.handle}`} tabIndex={-1} aria-hidden="true" className="shrink-0 cursor-pointer self-start">
                    <Thumb category={category} size="h-[76px] w-[76px] sm:h-[104px] sm:w-[104px]" sizes="104px" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                      <h2 className="font-heading text-lg font-extrabold leading-tight text-brand-teal-dark sm:text-xl">
                        <Link href={`/collections/${category.handle}`} className="hover:text-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">{category.title}</Link>
                      </h2>
                      {category.countLabel && <span className="text-xs font-semibold text-neutral-500">{category.countLabel}</span>}
                    </div>
                    {category.description && <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-neutral-600 sm:text-sm">{category.description}</p>}
                  </div>
                </div>
                {subs.length > 0 && (
                  <nav aria-label={category.subLabel} className="mt-3.5">
                    <ul className="flex flex-wrap gap-1.5">
                      {subs.map((sub) => (
                        <li key={sub.id}>
                          <Link href={`/collections/${sub.handle}`} className="inline-flex min-h-9 items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 text-[13px] font-medium text-neutral-800 transition-colors hover:border-brand-cta hover:bg-brand-cta hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">{sub.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
                <Link href={`/collections/${category.handle}`} className="mt-auto inline-flex min-h-10 items-center gap-1 pt-2.5 text-sm font-bold text-brand-teal hover:text-brand-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
                  {category.viewAllLabel}
                  {chevron("h-4 w-4")}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
