"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { site } from "@/config/site";
import type { UiProductDetail } from "@/lib/shopify/mappers";

export function ProductDetailsAccordion({ product }: { product: UiProductDetail }) {
  const t = useTranslations("product.details");
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const threshold = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: site.currency,
  }).format(site.delivery.freeDeliveryThreshold);

  const sections = [
    {
      title: t("descriptionTitle"),
      body: product.descriptionHtml ? (
        <div
          className="prose prose-sm max-w-none text-brand-teal-dark/80 [&_a]:text-brand-teal [&_li]:mt-1 [&_p]:mt-2 [&_p:first-child]:mt-0 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : (
        <p className="text-brand-teal-dark/60">{product.description}</p>
      ),
    },
    {
      title: t("deliveryTitle"),
      body: <p>{t("deliveryBody", { threshold })}</p>,
    },
    {
      title: t("returnsTitle"),
      body: <p>{t("returnsBody")}</p>,
    },
  ];

  return (
    <section className="mx-auto max-w-[var(--layout-max-width)] px-4 py-8">
      <div className="mx-auto max-w-3xl divide-y divide-black/10 rounded-xl border border-black/10">
        {sections.map((section, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={section.title}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-brand-teal-dark sm:text-base"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                {section.title}
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
              {isOpen && <div className="px-4 pb-4 text-sm text-brand-teal-dark/70">{section.body}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
