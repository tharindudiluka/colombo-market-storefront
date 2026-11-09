"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { delivery, formatEuro } from "@/config/delivery";

type FaqItem = { q: string; a: string };

export function FaqAccordion() {
  const t = useTranslations("faq");
  const locale = useLocale();
  // Shipping figures come from config, never from the copy.
  const values: Record<string, string> = { threshold: formatEuro(delivery.freeShippingThreshold, locale), rate: formatEuro(delivery.flatShippingRate, locale) };
  const items = (t.raw("items") as FaqItem[]).map((item) => ({
    ...item,
    a: item.a.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match),
  }));
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const accordionId = useId();

  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-4">
        <h2 className="flex items-center gap-2.5 text-xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-[22px]">
          <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-brand-teal" />
          {t("title")}
        </h2>

        <ul className="mt-5 grid gap-2.5 sm:mt-6">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const questionId = `${accordionId}-question-${i}`;
            const panelId = `${accordionId}-answer-${i}`;
            return (
              <li key={item.q} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-200 hover:border-brand-teal/50 hover:shadow-md motion-reduce:transition-none">
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left font-heading text-[15px] font-extrabold leading-snug text-brand-teal-dark focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-teal sm:text-base"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {item.q}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-90" : ""}`}
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div id={panelId} role="region" aria-labelledby={questionId} hidden={!isOpen} className="border-t border-neutral-100">
                  <p className="px-4 pb-4 pt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">{item.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
