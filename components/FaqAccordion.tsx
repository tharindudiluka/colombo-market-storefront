"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { BotanicalAccents } from "@/components/BotanicalAccents";

type FaqItem = { q: string; a: string };

export function FaqAccordion() {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const accordionId = useId();

  return (
    <section className="relative isolate bg-white py-10 sm:py-12">
      <BotanicalAccents variant="faq" />
      <div className="relative z-10 mx-auto max-w-[var(--layout-max-width)] px-4">
        <h2 className="font-heading text-xl font-extrabold text-brand-teal-dark sm:text-2xl">
          {t("title")}
        </h2>

        <div className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const questionId = `${accordionId}-question-${i}`;
            const panelId = `${accordionId}-answer-${i}`;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-brand-teal-dark sm:text-base"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {item.q}
                  <svg
                    aria-hidden="true"
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
                <div id={panelId} role="region" aria-labelledby={questionId} hidden={!isOpen}>
                  <p className="px-4 pb-4 text-sm leading-relaxed text-brand-teal-dark/80 lg:text-base">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
