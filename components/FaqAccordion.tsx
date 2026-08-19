"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type FaqItem = { q: string; a: string };

export function FaqAccordion() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">
        {t("title")}
      </h2>

      <div className="mt-4 divide-y divide-black/10 rounded-xl border border-black/10">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q}>
              <button
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-brand-teal-dark sm:text-base"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {item.q}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              {isOpen && (
                <p className="px-4 pb-4 text-sm text-brand-teal-dark/70">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
