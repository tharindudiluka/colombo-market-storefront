"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { site } from "@/config/site";
import type { UiProductDetail, UiProductVariant } from "@/lib/shopify/mappers";

export function ProductDetailsAccordion({ product, variant, descriptionHtml }: {
  product: UiProductDetail;
  variant: UiProductVariant;
  /** Sanitized by the server before crossing the client boundary. */
  descriptionHtml: string;
}) {
  const t = useTranslations("product.details");
  const locale = useLocale();
  const id = useId();
  const hasDescription = Boolean(descriptionHtml.trim() || product.description.trim());
  const [openSection, setOpenSection] = useState<string | null>(hasDescription ? "description" : "information");
  const threshold = new Intl.NumberFormat(locale, { style: "currency", currency: site.currency }).format(site.delivery.freeDeliveryThreshold);
  const information = [
    ...(product.vendor ? [{ label: t("brand"), value: product.vendor }] : []),
    ...variant.selectedOptions.filter((option) => option.name !== "Title" && option.value !== "Default Title").map((option) => ({ label: option.name, value: option.value })),
    ...(variant.sku ? [{ label: t("sku"), value: variant.sku }] : []),
    ...(variant.barcode ? [{ label: t("barcode"), value: variant.barcode }] : []),
    { label: t("availability"), value: variant.availableForSale ? t("inStock") : t("outOfStock") },
  ];
  const structuredInformation = [
    { key: "ingredients", value: product.information.ingredients },
    { key: "legalName", value: product.information.legalName },
    { key: "storage", value: product.information.storage },
    { key: "origin", value: product.information.origin },
    { key: "manufacturerDistributor", value: product.information.manufacturerDistributor },
  ].filter((row) => row.value);
  const nutrition = product.information.nutrition;
  const sections = [
    ...(hasDescription ? [{ key: "description", title: t("descriptionTitle"), body: descriptionHtml ? <div className="product-rich-text" dangerouslySetInnerHTML={{ __html: descriptionHtml }} /> : <p>{product.description}</p> }] : []),
    { key: "information", title: t("informationTitle"), body: <div className="space-y-6"><dl className="divide-y divide-brand-teal-dark/10">{information.map((row) => (
      <div key={row.label} className="grid grid-cols-2 gap-4 py-3 first:pt-0 last:pb-0">
        <dt className="text-brand-teal-dark/65">{row.label}</dt><dd className="min-w-0 break-words font-medium text-brand-teal-dark">{row.value}</dd>
      </div>
    ))}</dl>
      {structuredInformation.length > 0 && <dl className="space-y-4">{structuredInformation.map((row) => (
        <div key={row.key}>
          <dt className="font-semibold text-brand-teal-dark">{t(`structured.${row.key}`)}</dt>
          <dd className="mt-1 whitespace-pre-line break-words">{row.value}</dd>
        </div>
      ))}</dl>}
      {nutrition && <table className="w-full table-fixed border-collapse text-left text-sm">
        <caption className="pb-3 text-left font-semibold text-brand-teal-dark">{t("structured.nutrition")} — {t("structured.per", { basis: nutrition.basis })}</caption>
        <tbody>{nutrition.rows.map((row) => <tr key={row.key} className="border-t border-brand-teal-dark/10">
          <th scope="row" className="w-1/2 py-2 pr-4 break-words font-normal">{t(`structured.${row.key}`)}</th>
          <td className="py-2 text-right break-words tabular-nums">{row.value}</td>
        </tr>)}</tbody>
      </table>}
    </div> },
    { key: "delivery", title: t("deliveryTitle"), body: <div className="space-y-3"><p>{t("deliveryBody", { threshold })}</p><p>{site.address.street}, {site.address.postalCode} {site.address.city}</p><p>{t("returnsBody")}</p></div> },
  ];
  return <section className="mt-6 overflow-hidden rounded-2xl border border-brand-teal-dark/10 bg-white" aria-label={t("informationTitle")}>
    {sections.map((section, index) => {
      const isOpen = openSection === section.key;
      const buttonId = `${id}-${section.key}-button`;
      const panelId = `${id}-${section.key}-panel`;
      return <div key={section.key} className={index > 0 ? "border-t border-brand-teal-dark/10" : undefined}>
        <h2><button type="button" id={buttonId} aria-controls={panelId} aria-expanded={isOpen} onClick={() => setOpenSection(isOpen ? null : section.key)} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-brand-teal-dark transition-colors hover:bg-brand-cream/20 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-teal sm:text-base">
          {section.title}<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" className={`h-5 w-5 shrink-0 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}><path d="M12 5v14M5 12h14" /></svg>
        </button></h2>
        <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="px-5 pb-5 text-sm leading-relaxed text-brand-teal-dark/80 sm:text-base">{section.body}</div>
      </div>;
    })}
  </section>;
}
