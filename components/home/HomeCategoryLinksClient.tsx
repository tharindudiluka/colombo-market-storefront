"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { CategoryImage } from "@/config/category-images";
import type { CategoryCard } from "@/lib/catalog/categories-page";

type Props = {
  categories: CategoryCard[];
  /** Pre-formatted "View all {category}" labels, keyed by category id. */
  viewAllLabels: Record<string, string>;
  /** Optional one-line description and collage thumbnail per category, keyed by category id. */
  extras: Record<string, { description: string | null; image: CategoryImage | null }>;
};

const chevron = (className: string) => (
  <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
);

function Thumb({ image, size }: { image: CategoryImage | null; size: string }) {
  if (!image) return null;
  return (
    <span aria-hidden className={`relative block shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white ${size}`}>
      <Image src={image.src} alt="" fill sizes="56px" className="object-contain" />
    </span>
  );
}

/**
 * Department link cards. From lg up every card is fully open: thumbnail + title + one-line description, a divider, the
 * subcategory rows and a "view all" footer pinned to the bottom (so all cards share one rhythm and height). Below lg each
 * department is an accordion row, so the phone view is eight short rows instead of one long list. All links stay in the
 * server-rendered HTML (hidden with CSS), so they remain crawlable.
 */
export function HomeCategoryLinksClient({ categories, viewAllLabels, extras }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-6 lg:grid-cols-4 lg:gap-4">
      {categories.map((category) => {
        const open = openId === category.id;
        const panelId = `home-links-${category.id.replace(/\W/g, "")}`;
        const extra = extras[category.id];
        return (
          <li key={category.id} className="group/card flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-200 hover:border-brand-teal/50 hover:shadow-md motion-reduce:transition-none">
            {/* Phones and tablets: accordion header. */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId(open ? null : category.id)}
              className="flex min-h-16 w-full cursor-pointer items-center gap-3 px-4 text-left font-heading text-base font-extrabold text-brand-teal-dark focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-teal lg:hidden"
            >
              <Thumb image={extra?.image ?? null} size="h-10 w-10" />
              <span className="min-w-0 flex-1">{category.title}</span>
              {chevron(`h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-90" : ""}`)}
            </button>

            {/* Desktop: thumbnail + linked title + description. */}
            <div className="hidden items-center gap-3 p-4 pb-3 lg:flex">
              {/* The thumbnail links to the department too; the title link is the accessible one, so this is skipped by keyboard/AT. */}
              <Link href={`/collections/${category.handle}`} tabIndex={-1} aria-hidden="true" className="shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">
                <Thumb image={extra?.image ?? null} size="h-14 w-14" />
              </Link>
              <div className="min-w-0">
                <h3 className="font-heading text-base font-extrabold leading-tight text-brand-teal-dark">
                  <Link href={`/collections/${category.handle}`} className="hover:text-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
                    {category.title}
                  </Link>
                </h3>
                {extra?.description && <p className="mt-1 line-clamp-2 text-xs leading-snug text-neutral-500">{extra.description}</p>}
              </div>
            </div>

            <div id={panelId} className={`${open ? "flex" : "hidden"} flex-1 flex-col border-t border-neutral-100 lg:flex`}>
              {category.subs.length > 0 && (
                <ul className="px-2 py-1.5 lg:px-3 lg:py-2">
                  {category.subs.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/collections/${sub.handle}`}
                        className="group/row flex min-h-11 items-center justify-between gap-2 rounded-lg px-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-brand-teal focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-teal lg:min-h-9"
                      >
                        <span>{sub.title}</span>
                        {chevron("h-3.5 w-3.5 shrink-0 text-neutral-300 transition duration-200 group-hover/row:translate-x-0.5 group-hover/row:text-brand-teal motion-reduce:transition-none")}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/collections/${category.handle}`}
                className="mt-auto flex min-h-11 items-center justify-between gap-2 border-t border-neutral-100 bg-neutral-50 px-4 text-sm font-bold text-brand-teal-dark transition-colors hover:bg-brand-teal hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-teal"
              >
                <span>{viewAllLabels[category.id]}</span>
                {chevron("h-4 w-4 shrink-0")}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
