import { site } from "@/config/site";

/** Delivery terms shown in marketing copy. The free-shipping threshold is read from config/site.ts, never repeated. */
export const delivery = {
  freeShippingThreshold: site.delivery.freeDeliveryThreshold,
  /** Flat shipping rate within Germany (storefront copy only; the real rate is configured in Shopify). */
  flatShippingRate: 5.99,
} as const;

/** Formats a euro amount for the page locale: "39,99 €" in German, "€39.99" in English. */
export function formatEuro(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "de-DE", { style: "currency", currency: site.currency }).format(amount);
}
