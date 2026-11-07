"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { CategoryCard } from "@/lib/catalog/categories-page";

type Props = {
  categories: CategoryCard[];
  /** Pre-formatted "View all {category}" labels, keyed by category id. */
  viewAllLabels: Record<string, string>;
};

const chevron = (className: string) => (
  <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
);

/**
 * Department link cards. From lg up every card is fully open; below that each department is an accordion row, so the
 * phone view is eight short rows instead of one long list. All links stay in the server-rendered HTML (hidden with CSS),
 * so they remain crawlable.
 */
export function HomeCategoryLinksClient({ categories, viewAllLabels }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-6 lg:grid-cols-4 lg:gap-4">
      {categories.map((category) => {
        const open = openId === category.id;
        const panelId = `home-links-${category.id.replace(/\W/g, "")}`;
        return (
          <li key={category.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-200 hover:border-brand-teal/50 hover:shadow-md motion-reduce:transition-none lg:p-5">
            {/* Phones and tablets: accordion header. */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId(open ? null : category.id)}
              className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 px-4 text-left font-heading text-base font-extrabold text-brand-teal-dark focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-teal lg:hidden"
            >
              <span>{category.title}</span>
              {chevron(`h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-90" : ""}`)}
            </button>
            {/* Desktop: the title is a link with the department's colour accent. */}
            <h3 className="hidden font-heading text-base font-extrabold text-brand-teal-dark lg:block">
              <Link href={`/collections/${category.handle}`} className="group inline-flex min-h-9 items-center gap-1.5 hover:text-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
                {category.title}
                {chevron("h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none")}
              </Link>
            </h3>
            <div id={panelId} className={`${open ? "block" : "hidden"} border-t border-neutral-100 px-4 pb-3 pt-1 lg:mt-2 lg:block lg:border-t-0 lg:p-0`}>
              {category.subs.length > 0 && (
                <ul className="lg:space-y-0.5">
                  {category.subs.map((sub) => (
                    <li key={sub.id}>
                      <Link href={`/collections/${sub.handle}`} className="flex min-h-11 items-center text-sm text-neutral-600 transition-colors hover:text-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal lg:min-h-9">{sub.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/collections/${category.handle}`}
                className={`mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand-teal-dark hover:text-brand-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal ${category.subs.length > 0 ? "lg:hidden" : ""}`}
              >
                {viewAllLabels[category.id]}
                {chevron("h-4 w-4")}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
